import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Check if users already exist
  const existingUsers = await prisma.user.findMany();
  if (existingUsers.length > 0) {
    console.log('ℹ️  Database already has users, skipping user creation');
    return;
  }

  // Create test users
  const user1 = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: await bcrypt.hash('Test123', 10),
      nickname: '测试用户',
      birthYear: 1995,
      birthMonth: 8,
      birthDay: 15,
      birthHour: 10,
      gender: 'female',
      lunarDate: '一九九五年七二十',
      zodiacSign: '狮子座',
      fiveElements: JSON.stringify({ wood: 3, fire: 2, earth: 1, metal: 1, water: 1 }),
    },
  });
  console.log('✓ Created test user:', user1.email);

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      password: await bcrypt.hash('Test123', 10),
      nickname: '缘分用户',
      birthYear: 1998,
      birthMonth: 3,
      birthDay: 20,
      birthHour: 15,
      gender: 'male',
      lunarDate: '一九九八年二二十二',
      zodiacSign: '双鱼座',
      fiveElements: JSON.stringify({ wood: 2, fire: 1, earth: 3, metal: 1, water: 2 }),
    },
  });
  console.log('✓ Created test user:', user2.email);

  // Create sample prayers
  await prisma.prayer.create({
    data: {
      userId: user1.id,
      content: '希望早日遇到命中注定的那个人',
      targetName: '正缘',
      prayerCount: 5,
    },
  });
  console.log('✓ Created sample prayer');

  // Create sample confessions
  await prisma.confession.create({
    data: {
      userId: user1.id,
      targetName: '暗恋对象',
      content: '其实我喜欢你很久了，不知道你是否也对我有好感？',
      isAnonymous: true,
    },
  });
  console.log('✓ Created sample confession');

  // Create sample treehole posts
  await prisma.treehole.create({
    data: {
      userId: user1.id,
      content: '最近工作压力很大，想找个人倾诉。有没有人也有类似的感受？',
      likes: 3,
      comments: 2,
    },
  });
  console.log('✓ Created sample treehole post');

  // Create sample match
  await prisma.match.create({
    data: {
      userId: user1.id,
      matchedId: user2.id,
      score: 0.85,
    },
  });
  console.log('✓ Created sample match');

  console.log('\n✅ Database seeded successfully!');
  console.log('\nTest credentials:');
  console.log('  Email: test@example.com');
  console.log('  Password: Test123');
  console.log('\n  Email: user2@example.com');
  console.log('  Password: Test123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
