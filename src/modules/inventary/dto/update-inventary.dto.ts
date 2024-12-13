import { PartialType } from '@nestjs/mapped-types';
import { CreateInventaryDto } from './create-inventary.dto';

export class UpdateInventaryDto extends PartialType(CreateInventaryDto) {}
