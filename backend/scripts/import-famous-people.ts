import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// 星座符号到名称的映射
const zodiacSymbolToName: Record<string, string> = {
  '♈': '白羊座',
  '♉': '金牛座',
  '♊': '双子座',
  '♋': '巨蟹座',
  '♌': '狮子座',
  '♍': '处女座',
  '♎': '天秤座',
  '♏': '天蝎座',
  '♐': '射手座',
  '♑': '摩羯座',
  '♒': '水瓶座',
  '♓': '双鱼座',
};

// 分类映射
const categoryMap: Record<string, string> = {
  '🧠 科学 & 技术（20人）': '科学',
  '👑 政治 & 军事（20人）': '政治',
  '💼 商业 & 科技领袖（15人）': '商业',
  '📚 文学 & 哲学（15人）': '文学',
  '🎨 艺术 & 音乐 & 影视（20人）': '艺术',
  '🏆 体育 & 其他领域（18人）': '体育',
};

async function importFamousPeople() {
  const filePath = path.join(__dirname, '../../famous_people.md');
  const content = fs.readFileSync(filePath, 'utf-8');

  const lines = content.split('\n');
  const people: Array<{
    name: string;
    nationality: string;
    birthDate: string;
    zodiacSign: string;
    category: string;
  }> = [];

  let currentCategory = '';

  for (const line of lines) {
    // 检查是否是分类标题行
    const categoryMatch = line.match(/^(🧠|👑|💼|📚|🎨|🏆)/);
    if (categoryMatch) {
      for (const [key, value] of Object.entries(categoryMap)) {
        if (line.includes(key)) {
          currentCategory = value;
          break;
        }
      }
      continue;
    }

    // 解析名人数据行
    // 格式: 1. 艾萨克·牛顿   英国   1643-01-04   ♑ 摩羯
    const personMatch = line.match(/^\d+\.\s+(.+?)\s{2,}(.+?)\s{2,}(.+?)\s{2,}(.+?)\s+(.+)$/);
    if (personMatch && currentCategory) {
      const name = personMatch[1].trim();
      const nationality = personMatch[2].trim();
      const birthDate = personMatch[3].trim();
      const zodiacSymbol = personMatch[4].trim();
      const zodiacName = personMatch[5].trim();

      // 使用星座名称作为主要依据
      let zodiacSign = zodiacName;
      // 如果名称不完整，使用符号映射
      if (!zodiacSign.includes('座')) {
        zodiacSign = zodiacSymbolToName[zodiacSymbol] || zodiacName;
      }

      people.push({
        name,
        nationality,
        birthDate,
        zodiacSign,
        category: currentCategory,
      });
    }
  }

  console.log(`解析到 ${people.length} 位名人`);

  // 清空现有数据并导入
  await prisma.famousPerson.deleteMany({});
  const result = await prisma.famousPerson.createMany({
    data: people,
    skipDuplicates: true,
  });

  console.log(`成功导入 ${result.count} 位名人`);

  // 按星座统计
  const allPeople = await prisma.famousPerson.findMany();
  const stats: Record<string, number> = {};
  allPeople.forEach(p => {
    stats[p.zodiacSign] = (stats[p.zodiacSign] || 0) + 1;
  });

  console.log('\n各星座名人数量:');
  const zodiacOrder = [
    '白羊座', '金牛座', '双子座', '巨蟹座',
    '狮子座', '处女座', '天秤座', '天蝎座',
    '射手座', '摩羯座', '水瓶座', '双鱼座'
  ];
  zodiacOrder.forEach(sign => {
    console.log(`${sign}: ${stats[sign] || 0} 位`);
  });
}

importFamousPeople()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
