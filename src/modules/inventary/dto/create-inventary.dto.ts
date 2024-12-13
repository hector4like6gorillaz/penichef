import { IsOptional, IsPositive, Min, MinLength } from 'class-validator';

export class CreateInventaryDto {
  @MinLength(1)
  product: string;
  @MinLength(1)
  brand: string;
  @MinLength(1)
  provider: string;
  @MinLength(1)
  category: string;
  @IsPositive()
  quanty: number;
  @MinLength(1)
  unitOfMeasurement: string;
  @Min(0)
  lastCost: number;
  @Min(0)
  actualCost: number;

  unitaryCostActually?: number;
  createdAt: string;
  @IsOptional()
  updatedAt?: string;
}
