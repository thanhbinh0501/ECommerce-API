import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ColorCreateReq {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    description: string;
}