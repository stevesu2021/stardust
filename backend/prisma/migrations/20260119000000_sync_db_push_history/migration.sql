-- AlterTable
ALTER TABLE `prayers` ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `deities` LONGTEXT NULL,
    ADD COLUMN `isAnonymous` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `supports` INTEGER NOT NULL DEFAULT 0,
    MODIFY `content` longtext NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `anonymousNickname` VARCHAR(191) NULL,
    ADD COLUMN `birthProvince` VARCHAR(191) NOT NULL DEFAULT '山西',
    ADD COLUMN `currentProvince` VARCHAR(191) NOT NULL DEFAULT '北京';

-- CreateTable
CREATE TABLE `astrology_readings` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `zodiacSign` VARCHAR(191) NOT NULL,
    `lunarDate` VARCHAR(191) NOT NULL,
    `yearPillar` VARCHAR(191) NOT NULL,
    `monthPillar` VARCHAR(191) NOT NULL,
    `dayPillar` VARCHAR(191) NOT NULL,
    `hourPillar` VARCHAR(191) NOT NULL,
    `fiveElements` LONGTEXT NOT NULL,
    `zodiacInterpretation` LONGTEXT NOT NULL,
    `baziInterpretation` LONGTEXT NOT NULL,
    `klineInterpretation` LONGTEXT NOT NULL,
    `dailyInterpretCount` INTEGER NOT NULL DEFAULT 0,
    `lastInterpretDate` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `astrology_readings_userId_key`(`userId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_fortunes` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `fortuneDate` VARCHAR(191) NOT NULL,
    `overallScore` INTEGER NOT NULL,
    `summary` VARCHAR(191) NOT NULL,
    `precautions` LONGTEXT NULL,
    `career` LONGTEXT NULL,
    `love` LONGTEXT NULL,
    `wealth` LONGTEXT NULL,
    `health` LONGTEXT NULL,
    `luckyColor` VARCHAR(191) NULL,
    `luckyNumber` INTEGER NULL,
    `luckyDirection` VARCHAR(191) NULL,
    `advice` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `daily_fortunes_userId_fortuneDate_key`(`userId` ASC, `fortuneDate` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `devout_prayers` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `category` VARCHAR(191) NULL,
    `categoryName` VARCHAR(191) NULL,
    `deities` LONGTEXT NULL,
    `supports` INTEGER NOT NULL DEFAULT 0,
    `isAnonymous` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `devout_prayers_userId_fkey`(`userId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `face_readings` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `imageUrl` LONGTEXT NOT NULL,
    `forehead` LONGTEXT NOT NULL,
    `eyes` LONGTEXT NOT NULL,
    `nose` LONGTEXT NOT NULL,
    `mouth` LONGTEXT NOT NULL,
    `overall` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `face_readings_userId_fkey`(`userId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `famous_people` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `nationality` VARCHAR(191) NOT NULL,
    `birthDate` VARCHAR(191) NOT NULL,
    `zodiacSign` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mbti_results` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `mbtiType` VARCHAR(191) NOT NULL,
    `eScore` INTEGER NOT NULL DEFAULT 0,
    `iScore` INTEGER NOT NULL DEFAULT 0,
    `sScore` INTEGER NOT NULL DEFAULT 0,
    `nScore` INTEGER NOT NULL DEFAULT 0,
    `tScore` INTEGER NOT NULL DEFAULT 0,
    `fScore` INTEGER NOT NULL DEFAULT 0,
    `jScore` INTEGER NOT NULL DEFAULT 0,
    `pScore` INTEGER NOT NULL DEFAULT 0,
    `answers` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `mbti_results_userId_key`(`userId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `palm_readings` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `imageUrl` LONGTEXT NOT NULL,
    `lifeLine` LONGTEXT NOT NULL,
    `wisdomLine` LONGTEXT NOT NULL,
    `loveLine` LONGTEXT NOT NULL,
    `careerLine` LONGTEXT NOT NULL,
    `overall` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `palm_readings_userId_fkey`(`userId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `title` LONGTEXT NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `productUrl` LONGTEXT NOT NULL,
    `imageUrl` LONGTEXT NOT NULL,
    `price` DOUBLE NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `shopName` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `tags` VARCHAR(191) NULL,
    `remark` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `products_productId_platform_key`(`productId` ASC, `platform` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reunite_prayers` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `targetName` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `prayerCount` INTEGER NOT NULL DEFAULT 1,
    `isAnonymous` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `reunite_prayers_userId_fkey`(`userId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `astrology_readings` ADD CONSTRAINT `astrology_readings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_fortunes` ADD CONSTRAINT `daily_fortunes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devout_prayers` ADD CONSTRAINT `devout_prayers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `face_readings` ADD CONSTRAINT `face_readings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mbti_results` ADD CONSTRAINT `mbti_results_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `palm_readings` ADD CONSTRAINT `palm_readings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reunite_prayers` ADD CONSTRAINT `reunite_prayers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

