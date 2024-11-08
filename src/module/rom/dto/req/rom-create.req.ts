import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RomCreateReq {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    value: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    unit: 'GB' | 'TB';

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    description: string;
}