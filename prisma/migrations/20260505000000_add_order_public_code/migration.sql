-- Add a customer-facing order code that is independent from the internal cuid.
ALTER TABLE "Order" ADD COLUMN "publicCode" TEXT;

-- Backfill existing rows, if any, with stable RUG-YYYYMMDD-XXXX codes.
DO $$
DECLARE
  rec RECORD;
  candidate TEXT;
  suffix_attempt INTEGER;
BEGIN
  FOR rec IN
    SELECT "id", "createdAt"
    FROM "Order"
    ORDER BY "createdAt", "id"
  LOOP
    suffix_attempt := 0;

    LOOP
      candidate :=
        'RUG-' ||
        to_char(rec."createdAt", 'YYYYMMDD') ||
        '-' ||
        upper(substr(md5(rec."id" || ':' || suffix_attempt::text), 1, 4));

      EXIT WHEN NOT EXISTS (
        SELECT 1 FROM "Order" WHERE "publicCode" = candidate
      );

      suffix_attempt := suffix_attempt + 1;
    END LOOP;

    UPDATE "Order"
    SET "publicCode" = candidate
    WHERE "id" = rec."id";
  END LOOP;
END $$;

ALTER TABLE "Order" ALTER COLUMN "publicCode" SET NOT NULL;

CREATE UNIQUE INDEX "Order_publicCode_key" ON "Order"("publicCode");
