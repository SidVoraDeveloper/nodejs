/*
  Warnings:

  - Added the required column `club_id` to the `ClubMembers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ClubMembers` ADD COLUMN     `club_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ClubMembers` ADD FOREIGN KEY (`club_id`) REFERENCES `Clubs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
