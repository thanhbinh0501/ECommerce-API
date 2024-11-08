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
  
  import { ProductBloc } from './product.bloc';
  import { ProductRes } from './dto/res/product.res';
  import { RolesGuard } from '@security/guard/role.guard';
  import { Roles } from '@security/decorator/role.decorator';
  import { RoleEnum } from '@share/enum/role.enum';
  import { JwtGuard } from '@security/guard/jwt.guard';
  import { FetchProductReq } from './dto/req/fetch-product.req';
  import { ProductCreateReq } from './dto/req/product-create.req';
  import { Ctx } from '@security/request-context/req-context.decorator';
  import { CtxReq } from '@security/request-context/request-context.dto';
  import { ApiKeyName, ApiOkPaginationRes } from '@config/swagger.config';
  import { PaginationRes } from '@share/page/response/pagination.res';
  
  @Controller('products')
  @ApiTags('Product')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  export class ProductController {
    constructor(private readonly productBloc: ProductBloc) {}
  
    @Post()
    @ApiSecurity(ApiKeyName)
    @ApiOperation({ summary: 'Create product' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      type: Number,
    })
    async createProduct(@Ctx() ctx: CtxReq, @Body() req: ProductCreateReq): Promise<number> {
      return this.productBloc.createProduct(ctx, req);
    }
  
    @Get()
    @ApiSecurity(ApiKeyName)
    @ApiOperation({ summary: 'Fetch all products' })
    @ApiOkPaginationRes(ProductRes)
    async searchProducts(@Query() req: FetchProductReq): Promise<PaginationRes<ProductRes>> {
      const data = await this.productBloc.searchProducts(req);
      return data.map((product) =>
        plainToInstance(ProductRes, product, { excludeExtraneousValues: true }),
      );
    }
  
    @Get(':id')
    @ApiSecurity(ApiKeyName)
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      type: ProductRes,
    })
    async getProductById(@Param('id') id: number): Promise<ProductRes> {
      const product = await this.productBloc.getById(id);
      return plainToInstance(ProductRes, product, {
        excludeExtraneousValues: true,
      });
    }
  
    @Put(':id')
    @ApiSecurity(ApiKeyName)
    @ApiOperation({ summary: 'Update product' })
    @ApiResponse({
      status: HttpStatus.OK,
      type: ProductRes,
    })
    async updateProduct(
      @Ctx() ctx: CtxReq,
      @Param('id') id: number,
      @Body() req: ProductCreateReq,
    ): Promise<ProductRes> {
      await this.productBloc.updateProduct(id, req, ctx.userId);
      const updatedProduct = await this.productBloc.getById(id);
      return plainToInstance(ProductRes, updatedProduct, {
        excludeExtraneousValues: true,
      });
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiSecurity(ApiKeyName)
    @ApiOperation({ summary: 'Delete product' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
    })
    async deleteProduct(@Param('id') id: number): Promise<void> {
      await this.productBloc.deleteProduct(id);
    }
  }
  