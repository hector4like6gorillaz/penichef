import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateInventaryDto } from './dto/create-inventary.dto';
import { UpdateInventaryDto } from './dto/update-inventary.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Inventary } from './entities/inventary.entity';
import { isValidObjectId, Model } from 'mongoose';
import { format } from 'date-fns';

@Injectable()
export class InventaryService {
  constructor(
    @InjectModel(Inventary.name)
    private readonly inventaryModel: Model<Inventary>,
  ) {}

  async create(createInventaryDto: CreateInventaryDto) {
    createInventaryDto.product = createInventaryDto.product.toUpperCase();
    createInventaryDto.brand = createInventaryDto.brand.toUpperCase();
    createInventaryDto.provider = createInventaryDto.provider.toUpperCase();
    createInventaryDto.category = createInventaryDto.category.toUpperCase();
    createInventaryDto.unitOfMeasurement =
      createInventaryDto.unitOfMeasurement.toUpperCase();
    const dateNow: string = this.getDate();
    createInventaryDto.createdAt = dateNow;
    createInventaryDto.updatedAt = dateNow;
    if (createInventaryDto.lastCost > createInventaryDto.actualCost) {
      createInventaryDto.unitaryCostActually =
        createInventaryDto.lastCost / createInventaryDto.quanty;
    } else {
      createInventaryDto.unitaryCostActually =
        createInventaryDto.actualCost / createInventaryDto.quanty;
    }

    try {
      const inventary = await this.inventaryModel.create({
        createdAt: createInventaryDto.createdAt,
        updatedAt: createInventaryDto.updatedAt,
        product: createInventaryDto.product,
        provider: createInventaryDto.provider,
        brand: createInventaryDto.brand,
        quanty: createInventaryDto.quanty,
        lastCost: createInventaryDto.lastCost,
        actualCost: createInventaryDto.actualCost,
        unitaryCostActually: createInventaryDto.unitaryCostActually,

        unitOfMeasurement: createInventaryDto.unitOfMeasurement,
        category: createInventaryDto.category,
      });
      return inventary;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all inventary`;
  }

  async findOne(term: string) {
    let inventary: Inventary;

    if (!inventary) {
      inventary = await this.inventaryModel.findOne({
        product: term.toUpperCase().trim(),
      });
    }
    if (!inventary) {
      inventary = await this.inventaryModel.findOne({
        brand: term.toUpperCase().trim(),
      });
    }
    if (!inventary) {
      inventary = await this.inventaryModel.findOne({
        unitOfMeasurement: term.toUpperCase().trim(),
      });
    }
    if (!inventary) {
      inventary = await this.inventaryModel.findOne({
        category: term.toUpperCase().trim(),
      });
    }
    if (!inventary) {
      inventary = await this.inventaryModel.findOne({
        provider: term.toUpperCase().trim(),
      });
    }
    if (!inventary && isValidObjectId(term)) {
      inventary = await this.inventaryModel.findById(term);
    }

    if (!inventary)
      throw new NotFoundException(
        `Inventary product with id or name :${term} not found`,
      );

    return inventary;
  }

  async update(id: string, updateInventaryDto: UpdateInventaryDto) {
    const category = await this.findOne(id);
    updateInventaryDto.product = updateInventaryDto.product.toUpperCase();
    updateInventaryDto.brand = updateInventaryDto.brand.toUpperCase();
    updateInventaryDto.provider = updateInventaryDto.provider.toUpperCase();
    updateInventaryDto.category = updateInventaryDto.category.toUpperCase();
    updateInventaryDto.unitOfMeasurement =
      updateInventaryDto.unitOfMeasurement.toUpperCase();

    updateInventaryDto.updatedAt = this.getDate();
    if (updateInventaryDto.lastCost > updateInventaryDto.actualCost) {
      updateInventaryDto.unitaryCostActually =
        updateInventaryDto.lastCost / updateInventaryDto.quanty;
    } else {
      updateInventaryDto.unitaryCostActually =
        updateInventaryDto.actualCost / updateInventaryDto.quanty;
    }

    try {
      await category.updateOne(updateInventaryDto);
      return { ...category.toJSON(), ...updateInventaryDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.inventaryModel.deleteOne({
      _id: id,
    });
    if (deletedCount === 0)
      throw new BadRequestException(`Product with id:${id} not found`);
    return;
  }

  //functions
  private getDate(): string {
    const date = new Date(Date.now());
    const formatDate = format(date, 'dd/MM/yyyy');
    return formatDate;
  }
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Inventory product exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      'Cant create inventary product - check server logs',
    );
  }
}
