/*
  Warnings:

  - You are about to drop the column `coffee_amount` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `featured_image` on the `post` table. All the data in the column will be lost.
  - Added the required column `roast_level` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "coffee_amount",
DROP COLUMN "content",
DROP COLUMN "featured_image",
ADD COLUMN     "bean_weight" INTEGER,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "roast_level" TEXT NOT NULL,
ADD COLUMN     "water_temp" INTEGER;

-- CreateIndex
CREATE INDEX "post_roast_level_idx" ON "post"("roast_level");

-- CreateIndex
CREATE INDEX "post_grind_size_idx" ON "post"("grind_size");

-- CreateIndex
CREATE INDEX "post_bean_weight_idx" ON "post"("bean_weight");

-- CreateIndex
CREATE INDEX "post_water_temp_idx" ON "post"("water_temp");
