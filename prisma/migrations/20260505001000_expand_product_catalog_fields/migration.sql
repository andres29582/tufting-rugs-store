ALTER TABLE "Product" ADD COLUMN "category" TEXT;
ALTER TABLE "Product" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Product" ADD COLUMN "colors" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Product" ADD COLUMN "features" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Product" ADD COLUMN "material" TEXT;
ALTER TABLE "Product" ADD COLUMN "productionTime" TEXT;
ALTER TABLE "Product" ADD COLUMN "isCustomizable" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Product" ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Product"
SET
  "category" = CASE
    WHEN "type" = 'FULL_CUSTOM' THEN 'Personalizadas'
    ELSE 'Decorativas'
  END,
  "features" = CASE
    WHEN "type" = 'FULL_CUSTOM' THEN ARRAY['100% personalizable', 'Aprobacion previa', 'Medidas flexibles']::TEXT[]
    ELSE ARRAY['Hecha a mano', 'Material premium', 'Base antiderrapante']::TEXT[]
  END
WHERE "category" IS NULL;

CREATE INDEX "Product_category_idx" ON "Product"("category");
CREATE INDEX "Product_isFeatured_idx" ON "Product"("isFeatured");
