import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Branch } from '../../branches/entities/branch.entity';

export class CreateVehicleDto {
  @ApiProperty({ example: 'VEH001' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'AB123CD' })
  @IsNotEmpty()
  @IsString()
  plate: string;

  @ApiProperty({ example: 'Fiat' })
  @IsNotEmpty()
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Ducato' })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty({ type: Branch })
  @Validate(IsExist, ['Branch', 'id'], {
    message: 'branchNotExists',
  })
  branch: Branch;
}
