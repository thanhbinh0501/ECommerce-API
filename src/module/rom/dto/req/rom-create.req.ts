import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RomCreateReq {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    size: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    description: string;
}