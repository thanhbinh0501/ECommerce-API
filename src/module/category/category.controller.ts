import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { ApiOkDataListRes, ApiOkPaginationRes } from '@config/swagger.config';
import { CategoryBloc } from '@module/category/category.bloc';
import { CreateCategoryReq } from '@module/category/dto/req/create-category.req';
import { FetchCategoryReq } from '@module/category/dto/req/fetch-category.req';
import { UpdateCategoryReq } from '@module/category/dto/req/update-category.req';
import { CategoryRes } from '@module/category/dto/res/category.res';
import { PermitAll } from '@security/decorator/permit-all.decorator';
import { Roles } from '@security/decorator/role.decorator';
import { RolesGuard } from '@security/guard/role.guard';
import { Ctx } from '@security/request-context/req-context.decorator';
import { CtxReq } from '@security/request-context/request-context.dto';
import { ApiKeyName } from '@share/constant/common.constant';
import { DataListRes } from '@share/data-list/res/data-list.res';
import { RoleEnum } from '@share/enum/role.enum';
import { PaginationRes } from '@share/page/response/pagination.res';
import { JwtGuard } from '@security/guard/jwt.guard';

@Controller('categories')
@ApiTags('Category')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
export class CategoryController {
  constructor(private readonly categoryBloc: CategoryBloc) {}

  @Post()
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Create category' })
  @ApiCreatedResponse({ type: CategoryRes })
  async createCategory(@Ctx() ctx: CtxReq, @Body() req: CreateCategoryReq): Promise<CategoryRes> {
    return this.categoryBloc.createCategory(ctx.userId, req);
  }

  @Get()
  @ApiSecurity(ApiKeyName)
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @ApiOperation({ summary: 'Fetch all categories' })
  @ApiOkPaginationRes(CategoryRes)
  async fetchCategories(@Query() req: FetchCategoryReq): Promise<PaginationRes<CategoryRes>> {
    return this.categoryBloc.fetchCategories(req);
  }

  @Get('public/:slug')
  @PermitAll()
  @ApiOperation({ summary: 'Get public category by slug' })
  @ApiOkResponse({ type: CategoryRes })
  async getCategoryBySlug(@Param('slug') slug: string): Promise<CategoryRes> {
    return this.categoryBloc.getBySlug(slug);
  }

  @Get('public')
  @PermitAll()
  @ApiOperation({ summary: 'Get all categories for users' })
  @ApiOkDataListRes(CategoryRes)
  async getAllCategories(): Promise<DataListRes<CategoryRes>> {
    return this.categoryBloc.getAllCategories();
  }

  @Get(':id')
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiOkResponse({ type: CategoryRes })
  async getCategoryById(@Param('id') id: number): Promise<CategoryRes> {
    return this.categoryBloc.getById(id);
  }

  @Put(':id')
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Update category' })
  @ApiOkResponse({ type: CategoryRes })
  async updateCategory(
    @Ctx() ctx: CtxReq,
    @Param('id') id: number,
    @Body() req: UpdateCategoryReq,
  ): Promise<CategoryRes> {
    return this.categoryBloc.updateCategoryById(id, req, ctx.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiSecurity(ApiKeyName)
  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Delete category by ID' })
  async deleteCategory(@Param('id') id: number): Promise<void> {
    await this.categoryBloc.deleteCategoryById(id);
  }
}
