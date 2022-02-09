/*
  Warnings:

  - You are about to drop the column `event_id` on the `eventtypes` table. All the data in the column will be lost.
  - Added the required column `event_id` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `EventTypes` DROP FOREIGN KEY `eventtypes_ibfk_1`;

-- AlterTable
ALTER TABLE `Events` ADD COLUMN `event_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `EventTypes` DROP COLUMN `event_id`;

-- AddForeignKey
ALTER TABLE `Events` ADD FOREIGN KEY (`event_id`) REFERENCES `EventTypes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
