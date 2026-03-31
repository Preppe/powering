import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateBranchDto } from './create-branch.dto';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  @ApiProperty({ example: 'BR001' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'Via Roma 1' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Milano' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: '20100' })
  @IsOptional()
  @IsString()
  zip?: string;
}
