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
  UseGuards, NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { RomBloc } from './rom.bloc';
import { RomRes } from './dto/res/rom.res';
import { RolesGuard } from '@security/guard/role.guard';
import { Roles } from '@security/decorator/role.decorator';
import { RoleEnum } from '@share/enum/role.enum';
import { JwtGuard } from '@security/guard/jwt.guard';
import { FetchRomReq } from './dto/req/fetch-rom.req';
import { RomCreateReq } from './dto/req/rom-create.req';
import { Ctx } from '@security/request-context/req-context.decorator';
import { CtxReq } from '@security/request-context/request-context.dto';
import { ApiKeyName, ApiOkPaginationRes } from '@config/swagger.config';
import { PaginationRes } from '@share/page/response/pagination.res';

@Controller('roms')
@ApiTags('Rom')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
export class RomController {
  constructor(private readonly romBloc: RomBloc) {}

  @Post()
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Create rom' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RomRes,
  })
  async createRom(@Ctx() ctx: CtxReq, @Body() req: RomCreateReq): Promise<RomRes> {
    const id = await this.romBloc.createRom(ctx, req);
    const rom = await this.romBloc.getById(id);
    return plainToInstance(RomRes, rom, { excludeExtraneousValues: true });
  }

  @Get()
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Fetch all roms' })
  @ApiOkPaginationRes(RomRes)
  async searchRoms(@Query() req: FetchRomReq): Promise<PaginationRes<RomRes>> {
    const data = await this.romBloc.searchRoms(req);
    return data.map((rom) =>
      plainToInstance(RomRes, rom, { excludeExtraneousValues: true }),
    );
  }

  @Get(':id')
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Get rom by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RomRes,
  })
  async getRomById(@Param('id') id: number): Promise<RomRes> {
    const rom = await this.romBloc.getById(id);
    return plainToInstance(RomRes, rom, {
      excludeExtraneousValues: true,
    });
  }

  @Get('search-by-value-unit')
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Get rom by value and unit' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RomRes,
  })
  async getRomByValueAndUnit(
    @Query('value') value: string,
    @Query('unit') unit: 'GB' | 'TB',
  ): Promise<RomRes> {
    const rom = await this.romBloc.getByValueAndUnit(value, unit);
    if (!rom) {
      throw new NotFoundException(`Rom with value ${value} and unit ${unit} not found`);
    }
    return plainToInstance(RomRes, rom, { excludeExtraneousValues: true });
  }


  @Put(':id')
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Update rom' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RomRes,
  })
  async updateRom(
    @Ctx() ctx: CtxReq,
    @Param('id') id: number,
    @Body() req: RomCreateReq,
  ): Promise<RomRes> {
    await this.romBloc.updateRom(id, req, ctx.userId);
    const updatedRom = await this.romBloc.getById(id);
    return plainToInstance(RomRes, updatedRom, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Delete rom' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  async deleteRom(@Param('id') id: number): Promise<void> {
    await this.romBloc.deleteRom(id);
  }
}
