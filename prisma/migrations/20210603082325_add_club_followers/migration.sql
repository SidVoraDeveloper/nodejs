-- CreateTable
CREATE TABLE `ClubFollowers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `followingId` INTEGER NOT NULL,
    `followedById` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deleted` DATETIME(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClubFollowers` ADD FOREIGN KEY (`followingId`) REFERENCES `Clubs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClubFollowers` ADD FOREIGN KEY (`followedById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
