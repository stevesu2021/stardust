import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MinioService } from '../../common/minio/minio.service';

@Injectable()
export class PalmService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private minioService: MinioService,
  ) {
    this.apiKey = this.configService.get<string>('DASHSCOPE_API_KEY');
    this.baseUrl = this.configService.get<string>('DASHSCOPE_BASE_URL');
    this.model = this.configService.get<string>('DASHSCOPE_MODEL');
  }

  async analyzePalm(file: Express.Multer.File, userId: string) {
    // 将图片转换为 base64
    const base64Image = file.buffer.toString('base64');
    const mimeType = file.mimetype || 'image/jpeg';

    const prompt = `图片是用户拍的照片，请基于照片分析用户的手相，如果不是手掌的照片，直接回复，照片不合格请重新拍摄。
正常手掌照片，要求从生命线，智慧线，感情线，事业线，综合运势,这5个方面进行分析，每一个方面都需要覆盖到。
结果要求按照以下格式要求返回。

例子1：
{
    "success": true,
    "data": {
        "lifeLine": "生命线深长，身体健康，精力充沛，有较强的生活适应能力。",
        "wisdomLine": "智慧线清晰，思维敏捷，善于分析问题，具有很好的学习能力和创造力。",
        "loveLine": "感情线平直，感情专一，对待感情认真负责，适合稳定长久的关系。",
        "careerLine": "事业线明显向上，事业心强，适合创业或从事管理工作，有望在事业上取得成就。",
        "overall": "整体手相格局均衡，显示出你是一个务实、有条理且富有责任感的人。只要保持专注与坚持，事业与生活都能稳步向前。感情方面虽不热烈但稳定，适合细水长流的缘分。近期运势平稳，宜稳中求进，不宜冒进。"
    }
}

例子2：
{
    "success": true,
    "data": {
        "lifeLine": "生命线深长且流畅，显示身体健康状况良好，精力旺盛，具有较强的抗压能力和生活适应力，能较好应对各种挑战。",
        "wisdomLine": "智慧线清晰平直，延伸至无名指下方，表明思维逻辑性强，学习能力突出，善于理性分析与解决问题，适合从事需要思考与规划的工作。",
        "loveLine": "感情线较长且微微上扬，末端分叉，代表情感丰富、细腻，对感情投入认真，容易动情但也可能因情绪波动影响关系，建议在感情中保持沟通与平衡。",
        "careerLine": "事业线从手掌中部清晰向上延伸，略带分叉，说明事业心强，有明确目标和进取精神，适合独立发展或管理岗位，中年后事业有望稳步上升。",
        "overall": "整体手相格局均衡有力，预示你具备良好的发展潜力与执行力。只要保持专注与耐心，事业与生活都将稳步前进。近期人际运佳，易得贵人相助，感情方面需多加用心经营，避免因忙碌忽略伴侣感受。"
    }
}`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64Image}`,
                  },
                },
                {
                  type: 'text',
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '分析失败，请重试';

      // 检查是否是照片不合格的情况
      if (content.includes('照片不合格请重新拍摄')) {
        throw new BadRequestException('照片不合格请重新拍摄');
      }

      // 解析返回的内容
      const result = this.parsePalmReading(content);

      // 保存照片和记录
      let imageUrl: string;
      if (this.minioService.isMinioEnabled()) {
        // 使用 MinIO 存储
        const fileName = `${userId}-${Date.now()}.${file.originalname.split('.').pop() || 'jpg'}`;
        imageUrl = await this.minioService.uploadFile(file.buffer, fileName, mimeType);
      } else {
        // MinIO 未启用，使用 base64 data URL（仅用于演示，生产环境应该配置 MinIO）
        console.warn('MinIO 未启用，使用 base64 存储图片（仅用于演示）');
        const base64Data = file.buffer.toString('base64');
        imageUrl = `data:${mimeType};base64,${base64Data}`;
      }

      await this.prisma.palmReading.create({
        data: {
          userId,
          imageUrl,
          lifeLine: result.lifeLine || '',
          wisdomLine: result.wisdomLine || '',
          loveLine: result.loveLine || '',
          careerLine: result.careerLine || '',
          overall: result.overall || '',
        },
      });

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('手相分析错误:', error);
      throw new BadRequestException('手相分析失败，请稍后重试');
    }
  }

  async getHistory(userId: string) {
    return this.prisma.palmReading.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteReading(readingId: string, userId: string) {
    const reading = await this.prisma.palmReading.findUnique({
      where: { id: readingId },
    });

    if (!reading) {
      throw new BadRequestException('记录不存在');
    }

    if (reading.userId !== userId) {
      throw new BadRequestException('无权删除此记录');
    }

    // 从 MinIO 删除图片（如果启用了 MinIO）
    if (this.minioService.isMinioEnabled() && !reading.imageUrl.startsWith('data:')) {
      try {
        const objectName = this.minioService.extractObjectNameFromUrl(reading.imageUrl);
        if (objectName) {
          await this.minioService.deleteFile(objectName);
        }
      } catch (error) {
        console.error('删除 MinIO 文件失败:', error);
      }
    }

    // 从数据库删除记录
    await this.prisma.palmReading.delete({
      where: { id: readingId },
    });

    return { success: true };
  }

  private parsePalmReading(content: string) {
    try {
      // 尝试直接解析 JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        // 如果返回的是标准格式 { success: true, data: {...} }
        if (parsed.success && parsed.data) {
          return parsed.data;
        }

        // 如果返回的是直接的 data 对象
        if (parsed.lifeLine || parsed.wisdomLine || parsed.loveLine || parsed.careerLine || parsed.overall) {
          return {
            lifeLine: parsed.lifeLine || '',
            wisdomLine: parsed.wisdomLine || '',
            loveLine: parsed.loveLine || '',
            careerLine: parsed.careerLine || '',
            overall: parsed.overall || ''
          };
        }
      }

      // JSON 解析失败，使用原来的文本解析方式
      return this.parseTextPalmReading(content);
    } catch (error) {
      console.error('JSON 解析失败，尝试文本解析:', error);
      return this.parseTextPalmReading(content);
    }
  }

  private parseTextPalmReading(content: string) {
    const result: any = {
      lifeLine: '',
      wisdomLine: '',
      loveLine: '',
      careerLine: '',
      overall: ''
    };

    // 按行分割内容
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);

    let currentSection = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line === '生命线' || line.includes('生命线')) {
        if (currentSection && currentContent.length > 0) {
          result[currentSection] = currentContent.join('');
        }
        currentSection = 'lifeLine';
        currentContent = [];
      } else if (line === '智慧线' || line.includes('智慧线')) {
        if (currentSection && currentContent.length > 0) {
          result[currentSection] = currentContent.join('');
        }
        currentSection = 'wisdomLine';
        currentContent = [];
      } else if (line === '感情线' || line.includes('感情线')) {
        if (currentSection && currentContent.length > 0) {
          result[currentSection] = currentContent.join('');
        }
        currentSection = 'loveLine';
        currentContent = [];
      } else if (line === '事业线' || line.includes('事业线')) {
        if (currentSection && currentContent.length > 0) {
          result[currentSection] = currentContent.join('');
        }
        currentSection = 'careerLine';
        currentContent = [];
      } else if (line === '综合运势' || line.includes('综合运势')) {
        if (currentSection && currentContent.length > 0) {
          result[currentSection] = currentContent.join('');
        }
        currentSection = 'overall';
        currentContent = [];
      } else if (line && !line.includes('手相分析结果')) {
        // 忽略标题行，收集内容
        currentContent.push(line);
      }
    }

    // 添加最后一个部分
    if (currentSection && currentContent.length > 0) {
      result[currentSection] = currentContent.join('');
    }

    // 如果解析失败，返回原始内容作为综合运势
    if (!result.lifeLine && !result.wisdomLine && !result.loveLine && !result.careerLine && !result.overall) {
      result.overall = content;
    }

    return result;
  }
}
