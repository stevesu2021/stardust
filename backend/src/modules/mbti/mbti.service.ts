import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

// MBTI 问题类型
interface MbtiQuestion {
  question: string;
  choice_a: { value: string; text: string };
  choice_b: { value: string; text: string };
}

// MBTI 类型描述
interface MbtiTypeDescription {
  type: string;
  name: string;
  description: string;
  traits: string[];
  career: string[];
  relationship: string;
}

@Injectable()
export class MbtiService {
  private questions: MbtiQuestion[] = [];
  private typeDescriptions: Record<string, MbtiTypeDescription> = {
    'INTJ': {
      type: 'INTJ',
      name: '建筑师',
      description: '富有想象力和战略性的思想家，一切皆在计划之中。',
      traits: ['独立自主', '追求完美', '善于分析', '意志坚定'],
      career: ['科学家', '系统分析师', '战略规划', '软件架构师'],
      relationship: '在关系中追求深度和真诚，需要智力上的共鸣。'
    },
    'INTP': {
      type: 'INTP',
      name: '逻辑学家',
      description: '具有创新性的发明家，对知识有着止不住的渴望。',
      traits: ['逻辑性强', '好奇心重', '独立思考', '灵活适应'],
      career: ['研究员', '程序员', '数学家', '哲学家'],
      relationship: '需要个人空间，重视智力交流和理解。'
    },
    'ENTJ': {
      type: 'ENTJ',
      name: '指挥官',
      description: '大胆、富有想象力且意志强大的领导者。',
      traits: ['天然领导', '目标导向', '果断决策', '组织能力强'],
      career: ['CEO', '管理者', '律师', '顾问'],
      relationship: '在关系中寻求成长和进步，欣赏有能力的人。'
    },
    'ENTP': {
      type: 'ENTP',
      name: '辩论家',
      description: '聪明好奇的思想者，无法抗拒智力上的挑战。',
      traits: ['机智敏捷', '喜欢辩论', '创新思维', '善于沟通'],
      career: ['企业家', '创意总监', '咨询师', '记者'],
      relationship: '需要刺激和新鲜感，重视精神层面的交流。'
    },
    'INFJ': {
      type: 'INFJ',
      name: '提倡者',
      description: '安静而神秘，鼓舞人心且不知疲倦的理想主义者。',
      traits: ['洞察力强', '富有同情心', '理想主义', '深度思考'],
      career: ['咨询师', '心理学家', '作家', '非营利组织'],
      relationship: '寻求深层情感连接，重视真诚和默契。'
    },
    'INFP': {
      type: 'INFP',
      name: '调停者',
      description: '诗意，善良的利他主义者，总是热情地为正义事业提供帮助。',
      traits: ['价值观驱动', '富有想象力', '忠诚可靠', '追求和谐'],
      career: ['艺术家', '作家', '咨询师', '教育工作者'],
      relationship: '在关系中追求真实和意义，需要情感上的理解。'
    },
    'ENFJ': {
      type: 'ENFJ',
      name: '主人公',
      description: '有魅力鼓舞人心的领袖，有着令听众着迷的能力。',
      traits: ['富有魅力', '乐于助人', '天生的领导者', '善于表达'],
      career: ['教师', '人力资源', '政治家', '培训师'],
      relationship: '关注伴侣的需求，善于营造温暖和谐的关系。'
    },
    'ENFP': {
      type: 'ENFP',
      name: '竞选者',
      description: '热情，有创造力爱社交的自由人，总能找到理由微笑。',
      traits: ['热情洋溢', '富有创造力', '善于社交', '灵活多变'],
      career: ['记者', '公关', '活动策划', '心理咨询师'],
      relationship: '在关系中带来快乐和活力，需要自由和认同。'
    },
    'ISTJ': {
      type: 'ISTJ',
      name: '物流师',
      description: '实际且注重事实的个人，可靠性不容怀疑。',
      traits: ['诚实守信', '注重细节', '责任感强', '传统保守'],
      career: ['会计', '审计', '工程师', '公务员'],
      relationship: '忠诚稳定，用行动表达爱，重视承诺。'
    },
    'ISFJ': {
      type: 'ISFJ',
      name: '守卫者',
      description: '非常专注而温暖的保卫者，时刻准备保护爱着的人们。',
      traits: ['体贴周到', '耐心细致', '忠诚可靠', '谦逊低调'],
      career: ['护士', '教师', '社会工作者', '行政助理'],
      relationship: '无私奉献，关注伴侣的日常需求。'
    },
    'ESTJ': {
      type: 'ESTJ',
      name: '总经理',
      description: '出色的管理者，在管理事情或人的时候无与伦比。',
      traits: ['组织能力强', '务实高效', '直接坦率', '遵守规则'],
      career: ['军官', '法官', '企业管理者', '警察'],
      relationship: '重视稳定和秩序，用实际行动照顾伴侣。'
    },
    'ESFJ': {
      type: 'ESFJ',
      name: '执政官',
      description: '极度关心他人，社交能力强，总是在热心帮忙。',
      traits: ['热心肠', '社交能力强', '传统守旧', '喜欢帮助人'],
      career: ['教师', '护士', '公关', '活动组织'],
      relationship: '温暖体贴，喜欢营造和谐的家庭氛围。'
    },
    'ISTP': {
      type: 'ISTP',
      name: '鉴赏家',
      description: '大胆而实际的实验家，擅长使用各种工具。',
      traits: ['动手能力强', '冷静理性', '灵活应变', '独立自主'],
      career: ['工程师', '机械师', '飞行员', '数据分析'],
      relationship: '需要个人空间，用行动而非言语表达关心。'
    },
    'ISFP': {
      type: 'ISFP',
      name: '探险家',
      description: '灵活有魅力的艺术家，时刻准备着探索和体验新事物。',
      traits: ['艺术气质', '随性自由', '敏感细腻', '活在当下'],
      career: ['设计师', '艺术家', '摄影师', '厨师'],
      relationship: '温柔体贴，用自己的方式表达情感。'
    },
    'ESTP': {
      type: 'ESTP',
      name: '企业家',
      description: '聪明精力充沛善于感知的人，享受生活在边缘的生活。',
      traits: ['冒险精神', '反应敏捷', '务实直接', '适应力强'],
      career: ['销售', '企业家', '运动员', '股票经纪人'],
      relationship: '带来刺激和乐趣，喜欢一起参与活动。'
    },
    'ESFP': {
      type: 'ESFP',
      name: '表演者',
      description: '自然的表演者，生活充满激情充满魅力。',
      traits: ['热情开朗', '乐于助人', '乐观向上', '富有表现力'],
      career: ['演员', '销售', '旅游顾问', '活动策划'],
      relationship: '带来欢乐和活力，喜欢共同体验生活。'
    }
  };

  constructor(private prisma: PrismaService) {
    this.loadQuestions();
  }

  private loadQuestions() {
    try {
      const filePath = path.join(process.cwd(), 'mbti_data.txt');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      this.questions = JSON.parse(fileContent);
    } catch (error) {
      console.error('[MbtiService] Failed to load questions:', error);
      this.questions = [];
    }
  }

  /**
   * 获取所有测试题目
   */
  getQuestions() {
    return this.questions;
  }

  /**
   * 计算 MBTI 类型
   */
  calculateMbti(answers: string[]): { type: string; scores: any } {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    answers.forEach((answer, index) => {
      if (index < this.questions.length) {
        scores[answer as keyof typeof scores]++;
      }
    });

    const type = [
      scores.E >= scores.I ? 'E' : 'I',
      scores.S >= scores.N ? 'S' : 'N',
      scores.T >= scores.F ? 'T' : 'F',
      scores.J >= scores.P ? 'J' : 'P',
    ].join('');

    return { type, scores };
  }

  /**
   * 获取 MBTI 类型描述
   */
  getTypeDescription(type: string): MbtiTypeDescription {
    return this.typeDescriptions[type] || {
      type,
      name: '未知类型',
      description: '暂无描述',
      traits: [],
      career: [],
      relationship: ''
    };
  }

  /**
   * 保存或更新用户的 MBTI 测试结果
   */
  async saveResult(userId: string, data: {
    answers: string[];
    mbtiType: string;
    eScore: number;
    iScore: number;
    sScore: number;
    nScore: number;
    tScore: number;
    fScore: number;
    jScore: number;
    pScore: number;
  }) {
    // 使用 upsert 来更新或创建记录
    return this.prisma.mbtiResult.upsert({
      where: { userId },
      update: {
        mbtiType: data.mbtiType,
        eScore: data.eScore,
        iScore: data.iScore,
        sScore: data.sScore,
        nScore: data.nScore,
        tScore: data.tScore,
        fScore: data.fScore,
        jScore: data.jScore,
        pScore: data.pScore,
        answers: JSON.stringify(data.answers),
      },
      create: {
        userId,
        mbtiType: data.mbtiType,
        eScore: data.eScore,
        iScore: data.iScore,
        sScore: data.sScore,
        nScore: data.nScore,
        tScore: data.tScore,
        fScore: data.fScore,
        jScore: data.jScore,
        pScore: data.pScore,
        answers: JSON.stringify(data.answers),
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    });
  }

  /**
   * 获取用户的 MBTI 测试结果
   */
  async getUserResult(userId: string) {
    const result = await this.prisma.mbtiResult.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    });

    if (!result) {
      return null;
    }

    return {
      ...result,
      answers: JSON.parse(result.answers),
      description: this.getTypeDescription(result.mbtiType),
    };
  }

  /**
   * 获取所有 MBTI 类型描述
   */
  getAllTypes() {
    return Object.values(this.typeDescriptions);
  }
}
