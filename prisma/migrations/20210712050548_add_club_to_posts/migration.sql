-- AlterTable
ALTER TABLE `Post` ADD COLUMN `club_id` INTEGER;

-- AddForeignKey
ALTER TABLE `Post` ADD FOREIGN KEY (`club_id`) REFERENCES `Clubs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
