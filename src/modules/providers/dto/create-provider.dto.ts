import { IsOptional, MinLength } from 'class-validator';

export class CreateProviderDto {
  @MinLength(1)
  name: string;
  createdAt: string;
  @IsOptional()
  updatedAt?: string;
}
