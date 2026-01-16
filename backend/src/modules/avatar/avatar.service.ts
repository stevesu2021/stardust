import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MinioService } from '../../common/minio/minio.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AvatarService {
  private readonly dashscopeApiKey: string;
  private readonly dashscopeBaseUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.dashscopeApiKey = this.configService.get<string>('DASHSCOPE_API_KEY') || '';
    this.dashscopeBaseUrl = this.configService.get<string>('DASHSCOPE_BASE_URL') || 'https://dashscope.aliyuncs.com/compatible-mode/v1';
  }

  /**
   * 上传头像
   */
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    console.log('[AvatarService] Uploading avatar for user:', userId);

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('仅支持 JPG、PNG、WebP 格式的图片');
    }

    // 验证文件大小（最大 5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('图片大小不能超过 5MB');
    }

    // 如果用户已有头像，先删除旧头像
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    if (user?.avatar) {
      const objectName = this.minio.extractObjectNameFromUrl(user.avatar);
      if (objectName) {
        try {
          await this.minio.deleteFile(objectName);
        } catch (error) {
          console.warn('[AvatarService] Failed to delete old avatar:', error);
        }
      }
    }

    // 上传新头像到 MinIO
    const fileName = `${userId}-${Date.now()}.${file.mimetype.split('/')[1]}`;
    const avatarUrl = await this.minio.uploadFile(
      file.buffer,
      fileName,
      file.mimetype,
      'avatars',
    );

    // 更新用户头像信息
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatar: avatarUrl,
        avatarType: 'upload',
        avatarUpdatedAt: new Date(),
      },
    });

    console.log('[AvatarService] Avatar uploaded successfully:', avatarUrl);

    return {
      avatar: avatarUrl,
      avatarType: 'upload',
      avatarUpdatedAt: new Date(),
    };
  }

  /**
   * AI生成头像
   */
  async generateAvatar(userId: string) {
    console.log('[AvatarService] Generating AI avatar for user:', userId);

    // 获取用户信息
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 获取用户的星盘信息
    const astrologyReading = await this.prisma.astrologyReading.findUnique({
      where: { userId },
    });

    // 生成提示词
    const prompt = this.generatePrompt(user, astrologyReading);
    console.log('[AvatarService] Generated prompt:', prompt);
    console.log('[AvatarService] Prompt length:', prompt.length);

    try {
      // 步骤1: 创建异步任务
      console.log('[AvatarService] Step 1: Creating async task...');
      const createTaskResponse = await this.fetchWithTimeout(
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.dashscopeApiKey}`,
            'X-DashScope-Async': 'enable',
          },
          body: JSON.stringify({
            model: 'wanx-v1',
            input: {
              prompt: prompt,
            },
            parameters: {
              size: '1024*1024',
              n: 1,
              style: '<photography>',
            },
          }),
        },
        30000,
      );

      if (!createTaskResponse.ok) {
        const errorText = await createTaskResponse.text();
        console.error('[AvatarService] Create task failed:', errorText);
        throw new BadRequestException(`AI生成失败: HTTP ${createTaskResponse.status}`);
      }

      const taskData = await createTaskResponse.json();
      const taskId = taskData?.output?.task_id;

      if (!taskId) {
        console.error('[AvatarService] Invalid task response:', JSON.stringify(taskData));
        throw new BadRequestException('AI生成失败，无法获取任务ID');
      }

      console.log('[AvatarService] Task created:', taskId);

      // 步骤2: 轮询查询任务结果
      console.log('[AvatarService] Step 2: Polling task result...');
      let imageUrl: string | null = null;
      const maxAttempts = 30; // 最多轮询30次
      const pollInterval = 2000; // 每次间隔2秒

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));

        const queryResponse = await this.fetchWithTimeout(
          `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.dashscopeApiKey}`,
            },
          },
          10000,
        );

        if (!queryResponse.ok) {
          console.error('[AvatarService] Query task failed:', await queryResponse.text());
          continue;
        }

        const queryData = await queryResponse.json();
        const taskStatus = queryData?.output?.task_status;

        console.log(`[AvatarService] Task status (attempt ${attempt + 1}):`, taskStatus);

        if (taskStatus === 'SUCCEEDED') {
          imageUrl = queryData?.output?.results?.[0]?.url;
          break;
        } else if (taskStatus === 'FAILED' || taskStatus === 'CANCELED') {
          const code = queryData?.output?.code;
          const message = queryData?.output?.message;
          console.error('[AvatarService] Task failed:', { code, message });
          throw new BadRequestException(`AI生成失败: ${message || '未知错误'}`);
        }
        // PENDING 或 RUNNING 则继续轮询
      }

      if (!imageUrl) {
        throw new BadRequestException('AI生成超时，请稍后重试');
      }

      console.log('[AvatarService] Image generated:', imageUrl);

      // 下载图片并上传到 MinIO
      const imageResponse = await this.fetchWithTimeout(
        imageUrl,
        {
          method: 'GET',
        },
        30000,
      );

      if (!imageResponse.ok) {
        throw new BadRequestException('图片下载失败');
      }

      const arrayBuffer = await imageResponse.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);
      const fileName = `${userId}-ai-${Date.now()}.png`;

      // 如果用户已有头像，先删除旧头像
      if (user.avatar) {
        const objectName = this.minio.extractObjectNameFromUrl(user.avatar);
        if (objectName) {
          try {
            await this.minio.deleteFile(objectName);
          } catch (error) {
            console.warn('[AvatarService] Failed to delete old avatar:', error);
          }
        }
      }

      // 上传到 MinIO
      const avatarUrl = await this.minio.uploadFile(
        imageBuffer,
        fileName,
        'image/png',
        'avatars',
      );

      // 更新用户头像信息
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          avatar: avatarUrl,
          avatarType: 'ai_generated',
          avatarUpdatedAt: new Date(),
          // 只有成功生成时才更新最后使用日期
          lastAiAvatarDate: new Date(),
        },
      });

      console.log('[AvatarService] AI avatar generated successfully:', avatarUrl);

      return {
        avatar: avatarUrl,
        avatarType: 'ai_generated',
        avatarUpdatedAt: new Date(),
        lastAiAvatarDate: new Date(),
      };
    } catch (error) {
      console.error('[AvatarService] AI generation error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`AI生成失败: ${error.message || '未知错误'}`);
    }
  }

  /**
   * 带超时的 fetch 请求（默认60秒超时）
   */
  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 60000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if ((error as Error).name === 'AbortError') {
        throw new BadRequestException('请求超时');
      }
      throw error;
    }
  }

  /**
   * 生成AI提示词
   */
  private generatePrompt(user: any, astrology: any): string {
    // 性别
    const genderText = user.gender === 'male' ? '男性' : user.gender === 'female' ? '女性' : '中性风格';

    // 年龄估算
    const age = new Date().getFullYear() - user.birthYear;

    // 简化提示词，避免包含可能被API拒绝的内容
    // 保持简洁，专注于描述人物外貌
    const prompt = `一个${age}岁左右的${genderText}人物头像，专业摄影风格，正面面容，表情自然友善，背景简洁干净，高质量摄影，光线柔和自然。`;

    return prompt;
  }

  /**
   * 获取用户头像信息
   */
  async getAvatarInfo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        avatar: true,
        avatarType: true,
        avatarUpdatedAt: true,
        lastAiAvatarDate: true,
      },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 检查今天是否已使用AI生成
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let canUseAiToday = true;

    if (user.lastAiAvatarDate) {
      const lastDate = new Date(user.lastAiAvatarDate);
      lastDate.setHours(0, 0, 0, 0);
      canUseAiToday = lastDate.getTime() !== today.getTime();
    }

    return {
      avatar: user.avatar,
      avatarType: user.avatarType,
      avatarUpdatedAt: user.avatarUpdatedAt,
      lastAiAvatarDate: user.lastAiAvatarDate,
      canUseAiToday,
    };
  }
}
