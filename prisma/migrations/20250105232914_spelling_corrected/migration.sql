/*
  Warnings:

  - You are about to drop the column `createdA` on the `issue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `issue` DROP COLUMN `createdA`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
