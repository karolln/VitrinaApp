/*
  Warnings:

  - You are about to drop the column `celular` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telefono]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `telefono` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Usuario_celular_key";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "celular",
ADD COLUMN     "telefono" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_telefono_key" ON "Usuario"("telefono");
