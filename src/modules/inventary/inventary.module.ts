import { Module } from '@nestjs/common';
import { InventaryService } from './inventary.service';
import { InventaryController } from './inventary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventary, InventarySchema } from './entities/inventary.entity';

@Module({
  controllers: [InventaryController],
  providers: [InventaryService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Inventary.name,
        schema: InventarySchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class InventaryModule {}
