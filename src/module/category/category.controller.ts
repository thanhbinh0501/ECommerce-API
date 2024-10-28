import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { CategoryBloc } from './category.bloc';
import { CategoryRes } from './dto/res/category.res';
import { RolesGuard } from '@security/guard/role.guard';
import { Roles } from '@security/decorator/role.decorator';
import { RoleEnum } from '@share/enum/role.enum';
import { JwtGuard } from '@security/guard/jwt.guard';
import { FetchCategoryReq } from './dto/req/fetch-category.req';
import { CategoryCreateReq } from './dto/req/category-create.req';
import { Ctx } from '@security/request-context/req-context.decorator';
import { CtxReq } from '@security/request-context/request-context.dto';
import { ApiKeyName, ApiOkPaginationRes } from '@config/swagger.config';
import { PaginationRes } from '@share/page/response/pagination.res';

@Controller('categories')
@ApiTags('Category')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
export class CategoryController {
  constructor(private readonly categoryBloc: CategoryBloc) {}

  @Post()
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Number,
  })
  async createCategory(@Ctx() ctx: CtxReq, @Body() req: CategoryCreateReq): Promise<number> {
    return this.categoryBloc.createCategory(ctx, req);
  }

  @Get()
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Fetch all categories' })
  @ApiOkPaginationRes(CategoryRes)
  async searchCategories(@Query() req: FetchCategoryReq): Promise<PaginationRes<CategoryRes>> {
    const data = await this.categoryBloc.searchCategories(req);
    return data.map((category) =>
      plainToInstance(CategoryRes, category, { excludeExtraneousValues: true }),
    );
  }

  @Get(':id')
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryRes,
  })
  async getCategoryById(@Param('id') id: number): Promise<CategoryRes> {
    const category = await this.categoryBloc.getById(id);

    return plainToInstance(CategoryRes, category, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryRes,
  })
  async updateCategory(
    @Ctx() ctx: CtxReq,
    @Param('id') id: number,
    @Body() req: CategoryCreateReq,
  ): Promise<CategoryRes> {
    await this.categoryBloc.updateCategory(id, req, ctx.userId);
    const updatedCategory = await this.categoryBloc.getById(id);

    return plainToInstance(CategoryRes, updatedCategory, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  async deleteCategory(@Param('id') id: number): Promise<void> {
    await this.categoryBloc.deleteCategory(id);
  }
}
