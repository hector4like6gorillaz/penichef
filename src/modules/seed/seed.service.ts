import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Provider } from '../providers/entities/provider.entity';
import { Model } from 'mongoose';
import { format } from 'date-fns';
import {
  categorySeed,
  proveedoresSeed,
} from 'src/common/constants/seed-contants';
import { Category } from '../categorys/entities/category.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Provider.name)
    private readonly providerModel: Model<Provider>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}
  async executedSeed() {
    const thisDate = this.getDate();
    await this.providerModel.deleteMany({});
    await this.categoryModel.deleteMany({});
    const providerToInsert = [];
    const categoryToInsert = [];

    proveedoresSeed.forEach((item) => {
      providerToInsert.push({ name: item, createdAt: thisDate });
    });
    await this.providerModel.insertMany(providerToInsert);

    categorySeed.forEach((item) => {
      categoryToInsert.push({ name: item, createdAt: thisDate });
    });
    await this.categoryModel.insertMany(categoryToInsert);

    return `Seed created`;
  }
  //functions
  private getDate(): string {
    const date = new Date(Date.now());
    const formatDate = format(date, 'dd/MM/yyyy');
    return formatDate;
  }
}
