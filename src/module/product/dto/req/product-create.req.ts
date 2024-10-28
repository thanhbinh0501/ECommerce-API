import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class ProductCreateReq {
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsOptional()
    @ApiProperty({ required: false })
    description: string;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @ApiProperty()
    price: number;
    
    @IsInt()
    @Min(0)
    @ApiProperty({ default: 0 })
    quantity: number;
    
    @IsOptional()
    @ApiProperty({ required: false })
    color: string;
    
    @IsOptional()
    @IsInt()
    @Min(0)
    @ApiProperty({ required: false, description: 'Dung lượng bộ nhớ ROM (GB)' })
    rom: number;
    
    @IsOptional()
    @IsInt()
    @Min(0)
    @ApiProperty({ required: false, description: 'Dung lượng RAM (GB)' })
    ram: number;
    
    @IsNotEmpty()
    @IsInt()
    @ApiProperty({ description: 'ID của category liên kết' })
    categoryId: number;
}