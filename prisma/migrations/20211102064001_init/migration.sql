-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191),
    `prenom` VARCHAR(191),
    `email` VARCHAR(191),
    `password` VARCHAR(255) NOT NULL,
    `telephone` VARCHAR(12) NOT NULL,
    `logo` TEXT NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'isPublic',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservation` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3),
    `code` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `nombre` INTEGER,
    `user` VARCHAR(191) NOT NULL,
    `voyage` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Voyage` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3),
    `depart` DATETIME(3),
    `origine` VARCHAR(191),
    `destination` VARCHAR(191),
    `etat` BOOLEAN NOT NULL DEFAULT true,
    `price` INTEGER,
    `arrive` DATETIME(3),
    `difference` DATETIME(3),
    `total` INTEGER,
    `user` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_user_fkey` FOREIGN KEY (`user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_voyage_fkey` FOREIGN KEY (`voyage`) REFERENCES `Voyage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Voyage` ADD CONSTRAINT `Voyage_user_fkey` FOREIGN KEY (`user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
