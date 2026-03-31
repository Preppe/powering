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
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { Vehicle } from './entities/vehicle.entity';
import { NullableType } from '../utils/types/nullable.type';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@ApiBearerAuth()
@Roles(RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Vehicles')
@Controller({
  path: 'vehicles',
  version: '1',
})
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @SerializeOptions({ groups: ['admin'] })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    return this.vehiclesService.create(createVehicleDto);
  }

  @SerializeOptions({ groups: ['admin'] })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Vehicle>> {
    return this.vehiclesService.findAll(query);
  }

  @SerializeOptions({ groups: ['admin'] })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: Vehicle['id']): Promise<NullableType<Vehicle>> {
    return this.vehiclesService.findOne(id);
  }

  @SerializeOptions({ groups: ['admin'] })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: Vehicle['id'],
    @Body() updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Vehicle['id']): Promise<void> {
    return this.vehiclesService.remove(id);
  }
}
