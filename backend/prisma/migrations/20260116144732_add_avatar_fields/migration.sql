-- AlterTable
ALTER TABLE `users`
  ADD COLUMN `avatarType` VARCHAR(191) NULL COMMENT '头像类型: upload(用户上传) | ai_generated(AI生成)',
  ADD COLUMN `avatarUpdatedAt` DATETIME(3) NULL COMMENT '头像更新时间',
  ADD COLUMN `lastAiAvatarDate` DATETIME(3) NULL COMMENT '上次AI生成头像的日期（用于每日限制）';
