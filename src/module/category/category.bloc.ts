import { Injectable } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Transactional } from 'typeorm-transactional';
import { CtxReq } from '@security/request-context/request-context.dto';
import { NotFoundException } from '@exception/not-found.exception';
import { PageRequest } from '@share/page/page-request';
import { Category } from '@entity/category.entity';
import { Page } from '@share/page/page';
import { CategoryCreateReq } from './dto/req/category-create.req';
import { AppLogger } from '@config/logger/app-logger.config';
import { ErrorCode } from '@share/constant/error-code';
import { ValidatorException } from '@exception/validator.exception';
import { FetchCategoryReq } from './dto/req/fetch-category.req';

@Injectable()
export class CategoryBloc {
  deleteCategory: any;
  constructor(
    private readonly categoryService: CategoryService,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(CategoryBloc.name);
  }

  @Transactional()
  async createCategory({ userId: currentUserId }: CtxReq, req: CategoryCreateReq): Promise<number> {
    const { name, description } = req;
    this.log.info(`Create category with name #${name} and description #${description}`);

    const existCategory = await this.categoryService.getByName(name);
    if (existCategory) {
      throw new ValidatorException(
        `Category with name ${name} already exitsts`,
        ErrorCode.CATEGORY_ALREADY_EXIST,
      );
    }

    const category = await this.categoryService.save({
      name,
      description,
      createdBy: currentUserId,
      updatedBy: currentUserId,
    } as Category);

    return category.id;
  }

  async searchCategories(req: FetchCategoryReq): Promise<Page<Category>> {
    this.log.info(`Fetch all categories by req #`, req);
    const { keyword } = req;
    const pageRequest = PageRequest.ofRequest(req);
    return this.categoryService.fetchCategories(keyword, pageRequest);
  }

  async getById(id: number): Promise<Category> {
    this.log.info(`Get category by id #${id}`);
    const category = await this.categoryService.getById(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  @Transactional()
  async updateCategory(id: number, req: CategoryCreateReq, currentUserId: number): Promise<void> {
    this.log.info(`Update category by id #${id}`);

    const category = await this.getById(id);
    category.name = req.name || category.name;
    category.description = req.description || category.description;
    category.updatedBy = currentUserId;

    await this.categoryService.save(category);
  }
}
