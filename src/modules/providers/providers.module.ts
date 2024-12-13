import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Provider, ProviderSchema } from './entities/provider.entity';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Provider.name,
        schema: ProviderSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class ProvidersModule {}
