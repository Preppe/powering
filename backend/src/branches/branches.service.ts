import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { paginate, Paginated, PaginateQuery, PaginateConfig } from 'nestjs-paginate';
import { CreateBranchDto } from './dto/create-branch.dto';
import { Branch } from './entities/branch.entity';
import { VehiclesService } from '../vehicles/vehicles.service';
import { NullableType } from '../utils/types/nullable.type';

export const BRANCH_PAGINATION_CONFIG: PaginateConfig<Branch> = {
  sortableColumns: ['code', 'city', 'zip', 'createdAt'],
  searchableColumns: ['code', 'address', 'city', 'zip'],
  defaultSortBy: [['createdAt', 'DESC']],
  maxLimit: 100,
};

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private branchesRepository: Repository<Branch>,
    private vehiclesService: VehiclesService,
  ) {}

  create(createBranchDto: CreateBranchDto): Promise<Branch> {
    return this.branchesRepository.save(
      this.branchesRepository.create(createBranchDto),
    );
  }

  findAll(query: PaginateQuery): Promise<Paginated<Branch>> {
    return paginate(query, this.branchesRepository, BRANCH_PAGINATION_CONFIG);
  }

  findOne(id: Branch['id']): Promise<NullableType<Branch>> {
    return this.branchesRepository.findOne({ where: { id } });
  }

  update(id: Branch['id'], payload: DeepPartial<Branch>): Promise<Branch> {
    return this.branchesRepository.save(
      this.branchesRepository.create({ id, ...payload }),
    );
  }

  async remove(id: Branch['id']): Promise<void> {
    const vehicleCount = await this.vehiclesService.countByBranch(id);
    if (vehicleCount > 0) {
      throw new ConflictException(
        'Impossibile eliminare la filiale: ci sono ancora automezzi assegnati',
      );
    }
    await this.branchesRepository.delete(id);
  }
}
