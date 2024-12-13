import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InventaryService } from './inventary.service';
import { CreateInventaryDto } from './dto/create-inventary.dto';
import { UpdateInventaryDto } from './dto/update-inventary.dto';

@Controller('inventary')
export class InventaryController {
  constructor(private readonly inventaryService: InventaryService) {}

  @Post()
  create(@Body() createInventaryDto: CreateInventaryDto) {
    return this.inventaryService.create(createInventaryDto);
  }

  @Get()
  findAll() {
    return this.inventaryService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.inventaryService.findOne(term);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventaryDto: UpdateInventaryDto,
  ) {
    return this.inventaryService.update(id, updateInventaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventaryService.remove(id);
  }
}
