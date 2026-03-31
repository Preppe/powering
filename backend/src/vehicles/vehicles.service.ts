import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { paginate, Paginated, PaginateQuery, PaginateConfig } from 'nestjs-paginate';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { NullableType } from '../utils/types/nullable.type';

export const VEHICLE_PAGINATION_CONFIG: PaginateConfig<Vehicle> = {
  sortableColumns: ['code', 'plate', 'brand', 'model', 'createdAt'],
  searchableColumns: ['code', 'plate', 'brand', 'model'],
  filterableColumns: { 'branch.id': true },
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['branch'],
  maxLimit: 100,
};

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) {}

  create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    return this.vehiclesRepository.save(
      this.vehiclesRepository.create(createVehicleDto),
    );
  }

  findAll(query: PaginateQuery): Promise<Paginated<Vehicle>> {
    return paginate(query, this.vehiclesRepository, VEHICLE_PAGINATION_CONFIG);
  }

  findOne(id: Vehicle['id']): Promise<NullableType<Vehicle>> {
    return this.vehiclesRepository.findOne({ where: { id } });
  }

  update(
    id: Vehicle['id'],
    payload: DeepPartial<Vehicle>,
  ): Promise<Vehicle> {
    return this.vehiclesRepository.save(
      this.vehiclesRepository.create({ id, ...payload }),
    );
  }

  countByBranch(branchId: string): Promise<number> {
    return this.vehiclesRepository.count({
      where: { branch: { id: branchId } },
    });
  }

  async remove(id: Vehicle['id']): Promise<void> {
    await this.vehiclesRepository.delete(id);
  }
}
