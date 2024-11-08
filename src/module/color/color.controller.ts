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

import { ColorBloc } from './color.bloc';
import { ColorRes } from './dto/res/color.res';
import { RolesGuard } from '@security/guard/role.guard';
import { Roles } from '@security/decorator/role.decorator';
import { RoleEnum } from '@share/enum/role.enum';
import { JwtGuard } from '@security/guard/jwt.guard';
import { FetchColorReq } from './dto/req/fetch-color.req';
import { ColorCreateReq } from './dto/req/color-create.req';
import { Ctx } from '@security/request-context/req-context.decorator';
import { CtxReq } from '@security/request-context/request-context.dto';
import { ApiKeyName, ApiOkPaginationRes } from '@config/swagger.config';
import { PaginationRes } from '@share/page/response/pagination.res';
import { ColorUpdateReq } from '@module/color/dto/req/color-update.req';

@Controller('colors')
@ApiTags('Color')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
export class ColorController {
  constructor(private readonly colorBloc: ColorBloc) {}

  @Post()
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Create color' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Number,
  })
  async createColor(@Ctx() ctx: CtxReq, @Body() req: ColorCreateReq): Promise<number> {
    return this.colorBloc.createColor(ctx, req);
  }

  @Get()
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Fetch all colors' })
  @ApiOkPaginationRes(ColorRes)
  async searchColors(@Query() req: FetchColorReq): Promise<PaginationRes<ColorRes>> {
    const data = await this.colorBloc.searchColors(req);
    return data.map((color) =>
      plainToInstance(ColorRes, color, { excludeExtraneousValues: true }),
    );
  }

  @Get(':id')
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Get color by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ColorRes,
  })
  async getColorById(@Param('id') id: number): Promise<ColorRes> {
    const color = await this.colorBloc.getById(id);
    return plainToInstance(ColorRes, color, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Update color' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ColorRes,
  })
  async updateColor(
    @Ctx() ctx: CtxReq,
    @Param('id') id: number,
    @Body() req: ColorUpdateReq,
  ): Promise<ColorRes> {
    await this.colorBloc.updateColor(id, req, ctx.userId);
    const updatedColor = await this.colorBloc.getById(id);
    return plainToInstance(ColorRes, updatedColor, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Delete color' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  async deleteColor(@Param('id') id: number): Promise<void> {
    await this.colorBloc.deleteColor(id);
  }
}
