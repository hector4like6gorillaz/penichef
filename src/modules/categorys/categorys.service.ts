import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';
import { isValidObjectId, Model } from 'mongoose';
import { format } from 'date-fns';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/utils/paginatedResult.util';

@Injectable()
export class CategorysService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    createCategoryDto.name = createCategoryDto.name.toUpperCase();
    const dateNow: string = this.getDate();
    createCategoryDto.createdAt = dateNow;
    createCategoryDto.updatedAt = dateNow;

    try {
      const category = await this.categoryModel.create({
        name: createCategoryDto.name,
        createdAt: createCategoryDto.createdAt,
        updatedAt: createCategoryDto.updatedAt,
      });
      return category;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, page = 1 } = paginationDto;

    // Obtener los datos paginados
    const categorys = await this.categoryModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');

    // Contar el total de documentos
    const total = await this.categoryModel.countDocuments();

    // Calcular metadatos
    const currentPage = page;

    // Construir URLs para nextPage y prevPage
    const baseUrl = 'categorys';

    // Estructurar la respuesta
    return new PaginatedResult(categorys, limit, currentPage, total, baseUrl);
  }

  async findOne(term: string) {
    let category: Category;

    if (!category) {
      category = await this.categoryModel.findOne({
        name: term.toUpperCase().trim(),
      });
    }
    if (!category && isValidObjectId(term)) {
      category = await this.categoryModel.findById(term);
    }

    if (!category)
      throw new NotFoundException(
        `Category with id or name :${term} not found`,
      );

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    updateCategoryDto.name = updateCategoryDto.name.toUpperCase();
    updateCategoryDto.updatedAt = this.getDate();

    try {
      await category.updateOne(updateCategoryDto);
      return { ...category.toJSON(), ...updateCategoryDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.categoryModel.deleteOne({
      _id: id,
    });
    if (deletedCount === 0)
      throw new BadRequestException(`Category with id:${id} not found`);

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
        `category exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      'Cant create category - check server logs',
    );
  }
}
