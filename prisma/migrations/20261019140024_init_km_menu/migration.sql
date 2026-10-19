-- CreateTable
CREATE TABLE `Menu` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `harga` INTEGER NOT NULL,
    `deskripsi` TEXT NULL,
    `gambarUrl` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
