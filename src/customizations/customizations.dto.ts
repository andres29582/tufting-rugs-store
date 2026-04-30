import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';
import {
  DesignReferenceKind,
  RugFormat,
  SizeCategory
} from '../domain/domain-enums';

export class CreateDesignReferenceDto {
  @IsOptional()
  @IsEnum(DesignReferenceKind)
  kind?: DesignReferenceKind;

  @IsString()
  @MinLength(1)
  url!: string;

  @IsOptional()
  @IsString()
  storageKey?: string | null;

  @IsOptional()
  @IsString()
  mimeType?: string | null;

  @IsOptional()
  @IsString()
  originalName?: string | null;
}

export class CreateCustomizationDto {
  @IsString()
  @MinLength(1)
  productId!: string;

  @IsString()
  @MinLength(1)
  customerName!: string;

  @IsEmail()
  customerEmail!: string;

  @IsOptional()
  @IsString()
  customerPhone?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  preferredColors?: string[];

  @IsOptional()
  @IsEnum(SizeCategory)
  sizeCategory?: SizeCategory;

  @IsOptional()
  @IsString()
  sizeLabel?: string | null;

  @IsOptional()
  @IsEnum(RugFormat)
  format?: RugFormat;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => CreateDesignReferenceDto)
  designReferences?: CreateDesignReferenceDto[];
}

export class CreateOrderFromCustomizationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  estimatedPriceCents?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  finalPriceCents?: number | null;

  @IsOptional()
  @IsString()
  notes?: string | null;
}
