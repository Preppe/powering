import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ example: 'BR001' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'Via Roma 1' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'Milano' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: '20100' })
  @IsNotEmpty()
  @IsString()
  zip: string;
}
