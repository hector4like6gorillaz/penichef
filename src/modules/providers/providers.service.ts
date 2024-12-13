import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Provider } from './entities/provider.entity';
import { isValidObjectId, Model } from 'mongoose';
import { format } from 'date-fns';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/utils/paginatedResult.util';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectModel(Provider.name)
    private readonly providerModel: Model<Provider>,
  ) {}

  async create(createProviderDto: CreateProviderDto) {
    createProviderDto.name = createProviderDto.name.toUpperCase();
    const dateNow: string = this.getDate();
    createProviderDto.createdAt = dateNow;
    createProviderDto.updatedAt = dateNow;

    try {
      const provider = await this.providerModel.create({
        name: createProviderDto.name,
        createdAt: createProviderDto.createdAt,
        updatedAt: createProviderDto.updatedAt,
      });
      return provider;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, page = 1 } = paginationDto;

    // Obtener los datos paginados
    const providers = await this.providerModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');

    // Contar el total de documentos
    const total = await this.providerModel.countDocuments();

    // Calcular metadatos
    const currentPage = page;

    // Construir URLs para nextPage y prevPage
    const baseUrl = 'providers';

    // Estructurar la respuesta
    return new PaginatedResult(providers, limit, currentPage, total, baseUrl);
  }

  async findOne(term: string) {
    let provider: Provider;

    if (!provider) {
      provider = await this.providerModel.findOne({
        name: term.toUpperCase().trim(),
      });
    }
    if (!provider && isValidObjectId(term)) {
      provider = await this.providerModel.findById(term);
    }

    if (!provider)
      throw new NotFoundException(
        `Proveedor with id or name :${term} not found`,
      );

    return provider;
  }

  async update(id: string, updateProviderDto: UpdateProviderDto) {
    const provider = await this.findOne(id);
    updateProviderDto.name = updateProviderDto.name.toUpperCase();
    updateProviderDto.updatedAt = this.getDate();

    try {
      await provider.updateOne(updateProviderDto);
      return { ...provider.toJSON(), ...updateProviderDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    //const pokemon = await this.findOne(id);
    //this.pokemonModel.findByIdAndDelete(id);
    //await pokemon.deleteOne();
    //const result = await this.pokemonModel.findByIdAndDelete(id); referencia
    const { deletedCount } = await this.providerModel.deleteOne({
      _id: id,
    });
    if (deletedCount === 0)
      throw new BadRequestException(`Provider with id:${id} not found`);

    return;
  }

  private getDate(): string {
    const date = new Date(Date.now());
    const formatDate = format(date, 'dd/MM/yyyy');
    return formatDate;
  }
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Provider exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      'Cant create provider - check server logs',
    );
  }
}
