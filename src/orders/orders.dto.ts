import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength
} from 'class-validator';
import { OrderStatus } from './order-domain';

export class CreateOrderDto {
  @IsString()
  @MinLength(1)
  customerName!: string;

  @IsString()
  @MinLength(1)
  customerEmail!: string;

  @IsOptional()
  @IsString()
  customerPhone?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  productId?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  customizationId?: string | null;

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

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}

export class UpdateFinalPriceDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  finalPriceCents!: number;
}
