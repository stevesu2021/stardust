import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 候选匿名昵称列表
const anonymousNicknames = [
  '卖火箭的小韭菜',
  '骑共享单车的悟空',
  '在逃迪士尼在编公主',
  '会写代码的煎饼果子',
  '拿退休金的赛博朋克',
  '被AI炒鱿鱼的老板',
  '用Excel算命的大师',
  '偷WiFi的锦鲤本鲤',
  '熬夜冠军但起不来床',
  '元宇宙种菜老农民',
  '花果山驻京办主任',
  '五指山下送外卖的猴',
  '会跳广场舞的北极熊',
  '爱发朋友圈的树懒',
  '拥有房贷的流浪猫',
  '想考编制的咸鱼',
  '在CBD遛弯的土拨鼠',
  '泡面加蛋就是满汉全席',
  '工资月光但梦想很亮',
  '一边躺平一边焦虑',
  '想辞职但不敢点发送',
  '吃土也要买盲盒的人',
  '把梦想存进余额宝',
  '用表情包谈恋爱的社恐',
  '地球观察员007号',
  '银河系摸鱼特派员',
  '宇宙和平鸽（但会骂人）',
  '平行宇宙的我正在暴富',
  '时间管理失败大师',
  '快乐废柴联盟会长'
];

// Fisher-Yates 洗牌算法
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function assignAnonymousNicknames() {
  console.log('开始为历史用户分配匿名昵称...');

  // 获取所有没有匿名昵称的用户
  const usersWithoutNickname = await prisma.user.findMany({
    where: {
      anonymousNickname: null,
    },
    select: {
      id: true,
      nickname: true,
    },
  });

  console.log(`找到 ${usersWithoutNickname.length} 个需要分配匿名昵称的用户`);

  if (usersWithoutNickname.length === 0) {
    console.log('所有用户都已有匿名昵称，无需分配');
    return;
  }

  // 打乱昵称列表以确保随机性
  const shuffledNicknames = shuffleArray(anonymousNicknames);

  // 为每个用户分配一个随机昵称
  let updateCount = 0;
  for (const user of usersWithoutNickname) {
    // 如果用户数量超过昵称列表数量，循环使用
    const nickname = shuffledNicknames[updateCount % shuffledNicknames.length];

    await prisma.user.update({
      where: { id: user.id },
      data: { anonymousNickname: nickname },
    });

    console.log(`用户 ${user.nickname || user.id} -> ${nickname}`);
    updateCount++;
  }

  console.log(`完成！已为 ${updateCount} 个用户分配匿名昵称`);
}

assignAnonymousNicknames()
  .then(() => {
    console.log('脚本执行完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('脚本执行失败:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
