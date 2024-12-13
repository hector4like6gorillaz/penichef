import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProvidersModule } from '../providers/providers.module';
import { CategorysModule } from '../categorys/categorys.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProvidersModule, CategorysModule],
})
export class SeedModule {}
