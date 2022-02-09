/*
  Warnings:

  - A unique constraint covering the columns `[eventName]` on the table `EventTypes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Post` MODIFY `description` VARCHAR(191);

-- CreateIndex
CREATE UNIQUE INDEX `EventTypes.eventName_unique` ON `EventTypes`(`eventName`);
