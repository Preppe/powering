import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { Branch } from './entities/branch.entity';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Branch]), VehiclesModule],
  controllers: [BranchesController],
  providers: [IsExist, IsNotExist, BranchesService],
  exports: [BranchesService],
})
export class BranchesModule {}
