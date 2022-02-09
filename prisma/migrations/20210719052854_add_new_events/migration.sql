/*
  Warnings:

  - Added the required column `eventFromId` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventToId` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inviteFromId` to the `Invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inviteToId` to the `Invitations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Events` ADD COLUMN `eventFromId` INTEGER NOT NULL,
    ADD COLUMN `eventToId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Invitations` ADD COLUMN `inviteFromId` INTEGER NOT NULL,
    ADD COLUMN `inviteToId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Events` ADD FOREIGN KEY (`eventFromId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Events` ADD FOREIGN KEY (`eventToId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invitations` ADD FOREIGN KEY (`inviteFromId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invitations` ADD FOREIGN KEY (`inviteToId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
