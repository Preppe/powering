import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { Branch } from './entities/branch.entity';
import { NullableType } from '../utils/types/nullable.type';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@ApiBearerAuth()
@Roles(RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Branches')
@Controller({
  path: 'branches',
  version: '1',
})
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @SerializeOptions({ groups: ['admin'] })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBranchDto: CreateBranchDto): Promise<Branch> {
    return this.branchesService.create(createBranchDto);
  }

  @SerializeOptions({ groups: ['admin'] })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Branch>> {
    return this.branchesService.findAll(query);
  }

  @SerializeOptions({ groups: ['admin'] })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: Branch['id']): Promise<NullableType<Branch>> {
    return this.branchesService.findOne(id);
  }

  @SerializeOptions({ groups: ['admin'] })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: Branch['id'],
    @Body() updateBranchDto: UpdateBranchDto,
  ): Promise<Branch> {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Branch['id']): Promise<void> {
    return this.branchesService.remove(id);
  }
}
