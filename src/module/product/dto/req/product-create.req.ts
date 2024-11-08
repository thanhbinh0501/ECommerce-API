import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductCreateReq {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    description: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    categoryId: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    colorId: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    romId: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    price: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    stock: number;
}