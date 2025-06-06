import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { AppLogger } from '@config/logger/app-logger.config';
import { ValidatorException } from '@exception/validator.exception';
import { CategoryService } from '@module/category/category.service';
import { CreateCategoryReq } from '@module/category/dto/req/create-category.req';
import { FetchCategoryReq } from '@module/category/dto/req/fetch-category.req';
import { CategoryRes } from '@module/category/dto/res/category.res';
import { ErrorCode } from '@share/constant/error-code.constant';
import { DataListRes } from '@share/data-list/res/data-list.res';
import { PageRequest } from '@share/page/page-request';
import { PaginationRes } from '@share/page/response/pagination.res';

@Injectable()
export class CategoryBloc {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(CategoryBloc.name);
  }

  @Transactional()
  async createCategory(currentUserId: number, req: CreateCategoryReq): Promise<CategoryRes> {
    const { name, slug } = req;
    this.log.info('Create category with data #', req);

    if (await this.categoryService.existsByName(name)) {
      throw new ValidatorException(
        `Category with name ${name} already exists`,
        ErrorCode.CATEGORY_NAME_ALREADY_EXIST,
      );
    }

    if (await this.categoryService.existsBySlug(slug)) {
      throw new ValidatorException(
        `Category with slug ${slug} already exists`,
        ErrorCode.CATEGORY_SLUG_ALREADY_EXIST,
      );
    }

    const category = await this.categoryService.save({
      ...req,
      createdBy: currentUserId,
    });

    return plainToInstance(CategoryRes, category, { excludeExtraneousValues: true });
  }

  async fetchCategories(req: FetchCategoryReq): Promise<PaginationRes<CategoryRes>> {
    this.log.info(`Fetch all categories with req #`, req);

    const { keyword } = req;
    const pageRequest = PageRequest.ofRequest(req);
    const categories = await this.categoryService.fetchCategories(keyword, pageRequest);

    return categories.map((category) =>
      plainToInstance(CategoryRes, category, { excludeExtraneousValues: true }),
    );
  }

  async getById(id: number): Promise<CategoryRes> {
    this.log.info(`Get category by id #${id}`);

    const category = await this.categoryService.getById(id);

    return plainToInstance(CategoryRes, category, { excludeExtraneousValues: true });
  }

  async getBySlug(slug: string): Promise<CategoryRes> {
    this.log.info(`Get category by slug #${slug}`);

    const category = await this.categoryService.getBySlug(slug);

    return plainToInstance(CategoryRes, category, { excludeExtraneousValues: true });
  }

  @Transactional()
  async updateCategoryById(
    id: number,
    req: CreateCategoryReq,
    currentUserId: number,
  ): Promise<CategoryRes> {
    this.log.info(`Update category by id #${id} with data`, req);

    const category = await this.categoryService.getById(id);
    const { name, slug } = req;

    if (await this.categoryService.existsByName(name, id)) {
      throw new ValidatorException(
        `Category with name already exists`,
        ErrorCode.CATEGORY_NAME_ALREADY_EXIST,
      );
    }

    if (await this.categoryService.existsBySlug(slug, id)) {
      throw new ValidatorException(
        `Category with slug ${slug} already exists`,
        ErrorCode.CATEGORY_SLUG_ALREADY_EXIST,
      );
    }

    return plainToInstance(
      CategoryRes,
      await this.categoryService.save({
        ...category,
        ...req,
        updatedBy: currentUserId,
      }),
      { excludeExtraneousValues: true },
    );
  }

  @Transactional()
  async deleteCategoryById(id: number): Promise<void> {
    this.log.info(`Delete category by id: ${id}`);

    await this.categoryService.getById(id);
    return this.categoryService.delete(id);
  }

  async getAllCategories(): Promise<DataListRes<CategoryRes>> {
    this.log.info('Get all categories');

    const categories = await this.categoryService.getAllCategories();

    return categories.map((category) =>
      plainToInstance(CategoryRes, category, { excludeExtraneousValues: true }),
    );
  }
}
