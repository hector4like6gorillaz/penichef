import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @IsNumber()
  @Min(1)
  limit?: number;
  @IsOptional()
  @IsNumber()
  offset?: number;
  @IsOptional()
  @IsNumber()
  page?: number;
}
