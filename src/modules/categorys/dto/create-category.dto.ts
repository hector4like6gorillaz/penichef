import { IsOptional, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @MinLength(1)
  name: string;
  createdAt: string;
  @IsOptional()
  updatedAt?: string;
}
