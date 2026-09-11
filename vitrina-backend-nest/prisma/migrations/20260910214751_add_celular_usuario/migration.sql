/*
  Warnings:

  - A unique constraint covering the columns `[celular]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `celular` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "celular" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_celular_key" ON "Usuario"("celular");
