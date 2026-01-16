// 神职人物分类数据
export const DEITY_CATEGORIES = {
  CATEGORY_1: {
    name: '综合护佑 / 万能型',
    id: 'category_1',
    deities: [
      '如来佛（佛教）',
      '玉皇大帝（道教/民间信仰）',
      '上帝 / 天主（基督教/天主教）',
      '宙斯（希腊神话，众神之王，掌管秩序与命运）',
    ]
  },
  CATEGORY_2: {
    name: '求子 / 护佑孩童',
    id: 'category_2',
    deities: [
      '观音菩萨（佛教，送子观音）',
      '注生娘娘（道教/民间信仰）',
      '碧霞元君（泰山娘娘）（道教，华北地区求子主神）',
      '圣母玛利亚（天主教/东正教，常被祈求保佑母婴平安）',
      '赫拉（希腊神话，婚姻与生育女神）',
    ]
  },
  CATEGORY_3: {
    name: '求财 / 商业兴旺',
    id: 'category_3',
    deities: [
      '财神（赵公明、关公、比干等）（道教/民间信仰）',
      '弥勒佛（布袋和尚形象）（佛教，象征富足欢喜）',
      '土地公（民间信仰，也兼管地方财运）',
      '圣尼古拉（基督教，水手与商人的守护圣人，圣诞老人原型）',
      '墨丘利（Mercury）（罗马神话，商业、旅行与财富之神）',
    ]
  },
  CATEGORY_4: {
    name: '学业 / 功名 / 考试',
    id: 'category_4',
    deities: [
      '文昌帝君（道教，掌管文运功名）',
      '孔子（至圣先师）（儒家，被尊为文教之神）',
      '魁星（民间信仰，主宰文章兴衰）',
      '圣托马斯·阿奎那（天主教，学者主保圣人）',
      '雅典娜（希腊神话，智慧、战略与技艺女神）',
    ]
  },
  CATEGORY_5: {
    name: '姻缘 / 爱情',
    id: 'category_5',
    deities: [
      '月老（道教/民间信仰，掌姻缘红线）',
      '七仙女 / 织女（民间传说，象征忠贞爱情）',
      '维纳斯（Venus）（罗马神话，爱与美之神）',
      '阿佛洛狄忒（Aphrodite）（希腊神话，同维纳斯）',
      '圣瓦伦丁（St. Valentine）（基督教，情人节来源，爱情守护圣人）',
    ]
  },
  CATEGORY_6: {
    name: '健康 / 祛病 / 长寿',
    id: 'category_6',
    deities: [
      '药师佛（佛教，东方净琉璃世界教主，消灾延寿）',
      '孙思邈（药王）（道教/民间信仰）',
      '保生大帝（闽台地区医神）',
      '圣卢克（St. Luke）（基督教，医生与艺术家的主保圣人）',
      '阿斯克勒庇俄斯（Asclepius）（希腊神话，医神，蛇杖象征）',
    ]
  },
  CATEGORY_7: {
    name: '武运 / 忠义 / 护法',
    id: 'category_7',
    deities: [
      '关公（关帝）（道教/民间信仰，武圣、忠义、驱邪、招财）',
      '韦驮菩萨（佛教，护法神）',
      '四大天王（佛教，护世护法）',
      '圣米迦勒（St. Michael）（天主教，天使长，驱魔战神）',
      '阿瑞斯（Ares） / 玛尔斯（Mars）（希腊/罗马战神）',
    ]
  },
  CATEGORY_8: {
    name: '农业 / 丰收 / 风调雨顺',
    id: 'category_8',
    deities: [
      '后稷（中国农神）',
      '龙王（道教/民间信仰，司雨）',
      '妈祖（林默娘）（虽主海事，但沿海农业亦祈其护佑风调）',
      '得墨忒耳（Demeter）（希腊神话，农业与丰收女神）',
      '克瑞斯（Ceres）（罗马神话，同得墨忒耳）',
    ]
  },
  CATEGORY_9: {
    name: '出行 / 航海 / 平安',
    id: 'category_9',
    deities: [
      '妈祖（中国东南沿海海神）',
      '临水夫人（陈靖姑）（闽台地区护产保童，也护出行）',
      '圣埃拉斯谟（St. Elmo）（基督教，水手守护圣人，"圣艾尔摩之火"来源）',
      '波塞冬（Poseidon）（希腊神话，海神——但通常需安抚而非祈求）',
      '雅典娜（智慧女神亦护佑旅人）',
    ]
  },
  CATEGORY_10: {
    name: '占卜 / 命运 / 神谕',
    id: 'category_10',
    deities: [
      '太上老君 / 六壬 / 奇门遁甲诸神（道教术数体系）',
      '伏羲 / 周文王（《易经》象征性始祖）',
      '阿波罗（Apollo）（希腊神话，德尔斐神谕发布者，预言之神）',
      '诺恩三女神（Norns）（北欧神话，编织命运之线）',
    ]
  },
} as const;

// 获取所有分类
export function getAllCategories() {
  return Object.values(DEITY_CATEGORIES);
}

// 根据 ID 获取分类
export function getCategoryById(id: string) {
  return Object.values(DEITY_CATEGORIES).find(cat => cat.id === id);
}

// 获取分类列表（用于选择）
export function getCategoryList() {
  return Object.values(DEITY_CATEGORIES).map(cat => ({
    id: cat.id,
    name: cat.name,
    deityCount: cat.deities.length,
  }));
}
