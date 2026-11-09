-- Tabla Visita: estaba en el esquema pero nunca tuvo migración.
-- Se crea solo si no existe, por si alguien la creó a mano en el servidor.
CREATE TABLE IF NOT EXISTS "Visita" (
    "id" SERIAL NOT NULL,
    "negocioId" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visita_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Visita_negocioId_idx" ON "Visita"("negocioId");

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Visita_negocioId_fkey') THEN
        ALTER TABLE "Visita" ADD CONSTRAINT "Visita_negocioId_fkey"
            FOREIGN KEY ("negocioId") REFERENCES "Negocio"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Precio opcional del producto (en pesos, sin decimales).
ALTER TABLE "Producto" ADD COLUMN IF NOT EXISTS "precio" INTEGER;
