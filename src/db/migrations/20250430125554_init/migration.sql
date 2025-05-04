/*
  Warnings:

  - The `grind_size` column on the `post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `roast_level` on the `post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GrindSize" AS ENUM ('EXTRA_FINE', 'FINE', 'MEDIUM_FINE', 'MEDIUM', 'MEDIUM_COARSE', 'COARSE', 'EXTRA_COARSE');

-- CreateEnum
CREATE TYPE "RoastLevel" AS ENUM ('LIGHT', 'LIGHT_MEDIUM', 'MEDIUM', 'MEDIUM_DARK', 'DARK', 'FRENCH');

-- AlterTable
ALTER TABLE "post" DROP COLUMN "grind_size",
ADD COLUMN     "grind_size" "GrindSize",
DROP COLUMN "roast_level",
ADD COLUMN     "roast_level" "RoastLevel" NOT NULL;

-- CreateIndex
CREATE INDEX "post_roast_level_idx" ON "post"("roast_level");

-- CreateIndex
CREATE INDEX "post_grind_size_idx" ON "post"("grind_size");
