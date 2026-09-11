-- CreateTable
CREATE TABLE "CodigoRecuperacion" (
    "id" SERIAL NOT NULL,
    "celular" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodigoRecuperacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CodigoRecuperacion_celular_idx" ON "CodigoRecuperacion"("celular");
