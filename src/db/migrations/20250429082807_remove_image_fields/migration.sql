/*
  Warnings:

  - You are about to drop the column `profile_image` on the `author` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `step` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "author" DROP COLUMN "profile_image";

-- AlterTable
ALTER TABLE "step" DROP COLUMN "image";
