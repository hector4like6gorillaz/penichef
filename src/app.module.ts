import { Module } from '@nestjs/common';
import { ProvidersModule } from './modules/providers/providers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedModule } from './modules/seed/seed.module';
import { CommonModule } from './common/common.module';
import { CategorysModule } from './modules/categorys/categorys.module';
import { InventaryModule } from './modules/inventary/inventary.module';

@Module({
  imports: [
    ProvidersModule,
    MongooseModule.forRoot('mongodb://localhost:29017/nest-penichef'),
    SeedModule,
    CommonModule,
    CategorysModule,
    InventaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
