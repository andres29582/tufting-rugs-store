import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength
} from 'class-validator';
import { ProductType, RugFormat, SizeCategory } from '../domain/domain-enums';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsEnum(ProductType)
  type!: ProductType;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  basePriceCents!: number;

  @IsEnum(SizeCategory)
  sizeCategory!: SizeCategory;

  @IsString()
  @MinLength(1)
  sizeLabel!: string;

  @IsEnum(RugFormat)
  format!: RugFormat;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  basePriceCents?: number;

  @IsOptional()
  @IsEnum(SizeCategory)
  sizeCategory?: SizeCategory;

  @IsOptional()
  @IsString()
  @MinLength(1)
  sizeLabel?: string;

  @IsOptional()
  @IsEnum(RugFormat)
  format?: RugFormat;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
