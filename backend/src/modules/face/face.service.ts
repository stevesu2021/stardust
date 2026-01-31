import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MinioService } from '../../common/minio/minio.service';

@Injectable()
export class FaceService {
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

  async analyzeFace(file: Express.Multer.File, userId: string) {
    // 将图片转换为 base64
    const base64Image = file.buffer.toString('base64');
    const mimeType = file.mimetype || 'image/jpeg';

    const prompt = `图片是用户拍的面部照片，请基于照片分析用户的面相，如果不是清晰的正面面部照片，直接回复，照片不合格请重新拍摄。
正常面部照片，要求从额头，眼睛，鼻子，嘴巴，综合运势，这5个方面进行分析，每一个方面都需要覆盖到。
结果要求按照以下格式要求返回。

例子1：
{
    "success": true,
    "data": {
        "forehead": "额头宽阔饱满，天庭饱满，智慧出众，早年运势较好，有良好的学习能力和思考能力。",
        "eyes": "眼睛明亮有神，眼神清澈，表明此人聪明机敏，观察力强，具有较好的洞察力和判断力。",
        "nose": "鼻梁挺直，鼻翼适中，鼻头圆润，说明此人意志坚定，做事有原则，财运较好，善于理财。",
        "mouth": "嘴唇厚薄适中，嘴角微微上扬，说明此人性格温和，善于表达，人际关系良好，有较好的福气。",
        "overall": "整体面相格局和谐，五官端正，显示出你是一个聪明、有福气且性格温和的人。早年运势较好，适合在学业或事业上稳步发展。中年财运亨通，需注意理财规划。晚年生活安逸，家庭和睦。近期运势平稳上升，宜积极进取，抓住机遇。"
    }
}

例子2：
{
    "success": true,
    "data": {
        "forehead": "额头高耸饱满，发际线整齐，天庭饱满之相，预示早年运势亨通，智慧超群，在学业和事业上都有较好的发展潜力。",
        "eyes": "眼睛稍大，双眼皮，眼神坚定而温和，显示出既有决断力又具同情心的性格，在人际交往中容易获得他人的信任与支持。",
        "nose": "鼻梁高挺，鼻头微圆，鼻翼收束，这是典型的财帛宫旺盛之相，说明财运较佳，善于理财，中年以后财富积累可观。",
        "mouth": "嘴唇轮廓清晰，嘴角自然上扬，牙齿整齐，说明口才良好，待人真诚，在社交场合容易获得好人缘，事业上有贵人相助。",
        "overall": "整体面相格局优秀，五官搭配和谐，预示你具备成功人士的基本特征。早年聪慧好学，事业起点较高；中年财运亨通，宜把握机会扩大财富；晚年安康顺遂，家庭幸福。整体运势呈上升趋势，宜保持积极心态，继续努力。"
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
      const result = this.parseFaceReading(content);

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

      await this.prisma.faceReading.create({
        data: {
          userId,
          imageUrl,
          forehead: result.forehead || '',
          eyes: result.eyes || '',
          nose: result.nose || '',
          mouth: result.mouth || '',
          overall: result.overall || '',
        },
      });

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('面相分析错误:', error);
      throw new BadRequestException('面相分析失败，请稍后重试');
    }
  }

  async getHistory(userId: string) {
    return this.prisma.faceReading.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteReading(readingId: string, userId: string) {
    const reading = await this.prisma.faceReading.findUnique({
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
    await this.prisma.faceReading.delete({
      where: { id: readingId },
    });

    return { success: true };
  }

  private parseFaceReading(content: string) {
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
        if (parsed.forehead || parsed.eyes || parsed.nose || parsed.mouth || parsed.overall) {
          return {
            forehead: parsed.forehead || '',
            eyes: parsed.eyes || '',
            nose: parsed.nose || '',
            mouth: parsed.mouth || '',
            overall: parsed.overall || ''
          };
        }
      }

      // JSON 解析失败，使用原来的文本解析方式
      return this.parseTextFaceReading(content);
    } catch (error) {
      console.error('JSON 解析失败，尝试文本解析:', error);
      return this.parseTextFaceReading(content);
    }
  }

  private parseTextFaceReading(content: string) {
    const result: any = {
      forehead: '',
      eyes: '',
      nose: '',
      mouth: '',
      overall: ''
    };

    // 按行分割内容
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);

    let currentSection = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line === '额头' || line.includes('额头')) {
        if (currentSection && currentContent.length > 0) {
          result[currentSection] = currentContent.join('');
        }
        currentSection = 'forehead';
        currentContent = [];
      } else if (line === '眼睛' || line.includes('眼睛')) {
        if (currentSection && currentContent.length > 0) {
          result[currentSection] = currentContent.join('');
        }
        currentSection = 'eyes';
        currentContent = [];
      } else if (line === '鼻子' || line.includes('鼻子')) {
        if (currentSection && currentContent.length > 0) {
          result[currentSection] = currentContent.join('');
        }
        currentSection = 'nose';
        currentContent = [];
      } else if (line === '嘴巴' || line.includes('嘴巴')) {
        if (currentSection && currentContent.length > 0) {
          result[currentSection] = currentContent.join('');
        }
        currentSection = 'mouth';
        currentContent = [];
      } else if (line === '综合运势' || line.includes('综合运势')) {
        if (currentSection && currentContent.length > 0) {
          result[currentSection] = currentContent.join('');
        }
        currentSection = 'overall';
        currentContent = [];
      } else if (line && !line.includes('面相分析结果')) {
        // 忽略标题行，收集内容
        currentContent.push(line);
      }
    }

    // 添加最后一个部分
    if (currentSection && currentContent.length > 0) {
      result[currentSection] = currentContent.join('');
    }

    // 如果解析失败，返回原始内容作为综合运势
    if (!result.forehead && !result.eyes && !result.nose && !result.mouth && !result.overall) {
      result.overall = content;
    }

    return result;
  }
}
