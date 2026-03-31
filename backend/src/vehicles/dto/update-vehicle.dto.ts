import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, Validate } from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { CreateVehicleDto } from './create-vehicle.dto';
import { Branch } from '../../branches/entities/branch.entity';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @ApiProperty({ example: 'VEH001' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'AB123CD' })
  @IsOptional()
  @IsString()
  plate?: string;

  @ApiProperty({ example: 'Fiat' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 'Ducato' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ type: Branch })
  @IsOptional()
  @Validate(IsExist, ['Branch', 'id'], {
    message: 'branchNotExists',
  })
  branch?: Branch;
}
