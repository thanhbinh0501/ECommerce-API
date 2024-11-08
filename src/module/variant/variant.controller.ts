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

import { VariantBloc } from './variant.bloc';
import { VariantRes } from './dto/res/variant.res';
import { RolesGuard } from '@security/guard/role.guard';
import { Roles } from '@security/decorator/role.decorator';
import { RoleEnum } from '@share/enum/role.enum';
import { JwtGuard } from '@security/guard/jwt.guard';
import { FetchVariantReq } from './dto/req/fetch-variant.req';
import { VariantCreateReq } from './dto/req/variant-create.req';
import { Ctx } from '@security/request-context/req-context.decorator';
import { CtxReq } from '@security/request-context/request-context.dto';
import { ApiKeyName, ApiOkPaginationRes } from '@config/swagger.config';
import { PaginationRes } from '@share/page/response/pagination.res';

@Controller('variants')
@ApiTags('Variant')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
export class VariantController {
  constructor(private readonly variantBloc: VariantBloc) {}

  @Post()
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Create variant' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Number,
  })
  async createVariant(@Ctx() ctx: CtxReq, @Body() req: VariantCreateReq): Promise<number> {
    return this.variantBloc.createVariant(ctx, req);
  }

  @Get()
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Fetch all variants' })
  @ApiOkPaginationRes(VariantRes)
  async searchVariants(@Query() req: FetchVariantReq): Promise<PaginationRes<VariantRes>> {
    const data = await this.variantBloc.searchVariants(req);
    return data.map((variant) =>
      plainToInstance(VariantRes, variant, { excludeExtraneousValues: true }),
    );
  }

  @Get(':id')
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Get variant by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VariantRes,
  })
  async getVariantById(@Param('id') id: number): Promise<VariantRes> {
    const variant = await this.variantBloc.getById(id);
    return plainToInstance(VariantRes, variant, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Update variant' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VariantRes,
  })
  async updateVariant(
    @Ctx() ctx: CtxReq,
    @Param('id') id: number,
    @Body() req: VariantCreateReq,
  ): Promise<VariantRes> {
    await this.variantBloc.updateVariant(id, req, ctx.userId);
    const updatedVariant = await this.variantBloc.getById(id);
    return plainToInstance(VariantRes, updatedVariant, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Delete variant' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  async deleteVariant(@Param('id') id: number): Promise<void> {
    await this.variantBloc.deleteVariant(id);
  }
}
