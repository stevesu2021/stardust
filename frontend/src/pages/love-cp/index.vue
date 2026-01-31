<template>
  <view class="love-cp-container">
    <!-- 头部背景 -->
    <view class="header-bg">
      <text class="header-title">💕 十二星座恋爱CP</text>
      <text class="header-subtitle">探索你的星座与最佳配对</text>
    </view>

    <!-- 星座选择Tabs -->
    <scroll-view class="zodiac-tabs" scroll-x scroll-with-animation>
      <view class="tabs-wrapper">
        <view
          v-for="(zodiac, index) in zodiacSigns"
          :key="zodiac.key"
          class="tab-item"
          :class="{ active: currentZodiac === zodiac.key }"
          @click="switchZodiac(zodiac.key)"
        >
          <text class="tab-icon">{{ zodiac.icon }}</text>
          <text class="tab-name">{{ zodiac.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <view class="content-wrapper">
        <!-- 最佳配对 -->
        <view class="best-matches-card">
          <view class="card-header">
            <text class="card-title">💘 谁最适合和{{ currentZodiacName }}谈恋爱</text>
          </view>
          <view class="matches-list">
            <view
              v-for="(match, index) in currentZodiacData.bestMatches"
              :key="index"
              class="match-item"
              :class="'rank-' + (index + 1)"
            >
              <view class="rank-badge">{{ index + 1 }}</view>
              <view class="match-info">
                <text class="match-zodiac">{{ match.zodiac }}</text>
                <text class="match-desc">{{ match.description }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 配合度详情 -->
        <view class="compatibility-card">
          <view class="card-header">
            <text class="card-title">📊 {{ currentZodiacName }}与每个星座的爱情配合度</text>
          </view>
          <view class="compatibility-list">
            <view
              v-for="(item, index) in currentZodiacData.compatibility"
              :key="index"
              class="compatibility-item"
              :class="getCompatibilityClass(item.score)"
            >
              <view class="compatibility-left">
                <text class="compatibility-zodiac">{{ item.zodiac }}</text>
                <text class="compatibility-desc">{{ item.description }}</text>
              </view>
              <view class="compatibility-right">
                <view class="score-bar">
                  <view
                    class="score-fill"
                    :style="{ width: item.score + '%', background: getScoreColor(item.score) }"
                  ></view>
                </view>
                <text class="score-text" :style="{ color: getScoreColor(item.score) }">
                  {{ item.score }}%
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 星座列表
const zodiacSigns = [
  { key: 'aries', name: '白羊座', icon: '♈' },
  { key: 'taurus', name: '金牛座', icon: '♉' },
  { key: 'gemini', name: '双子座', icon: '♊' },
  { key: 'cancer', name: '巨蟹座', icon: '♋' },
  { key: 'leo', name: '狮子座', icon: '♌' },
  { key: 'virgo', name: '处女座', icon: '♍' },
  { key: 'libra', name: '天秤座', icon: '♎' },
  { key: 'scorpio', name: '天蝎座', icon: '♏' },
  { key: 'sagittarius', name: '射手座', icon: '♐' },
  { key: 'capricorn', name: '摩羯座', icon: '♑' },
  { key: 'aquarius', name: '水瓶座', icon: '♒' },
  { key: 'pisces', name: '双鱼座', icon: '♓' }
]

// 星座配对数据
const zodiacData: Record<string, any> = {
  aries: {
    bestMatches: [
      { zodiac: '狮子座', description: '他/她是燃烧你热情的火苗，你们很适合' },
      { zodiac: '射手座', description: '你和他/她约会时会特别快乐' },
      { zodiac: '天秤座', description: '虽然讨厌他/她的地方很多，但彼此却深深吸引' }
    ],
    compatibility: [
      { zodiac: '白羊座', description: '个性相契，但彼此不要太好胜。', score: 74 },
      { zodiac: '金牛座', description: '若他/她耐心够的话，或许你能打开他/她的心。', score: 52 },
      { zodiac: '双子座', description: '关系和谐，但你的热情有时会是他/她的负担。', score: 66 },
      { zodiac: '巨蟹座', description: '你们的兴趣和想法截然不同，若交往你会很痛苦。', score: 24 },
      { zodiac: '狮子座', description: '最佳拍档，可享受一段浪漫的恋情。', score: 99 },
      { zodiac: '处女座', description: '理想派的他/她，总不能满足你的恋情。', score: 47 },
      { zodiac: '天秤座', description: '彼此可以互相学习，适合谈恋爱。', score: 83 },
      { zodiac: '天蝎座', description: '当你点燃他/她的热情时，他/她的心早已冷却。', score: 40 },
      { zodiac: '射手座', description: '一拍即合，像两团热情的火焰。', score: 90 },
      { zodiac: '摩羯座', description: '好强的你和保守的他/她是争执不断。', score: 47 },
      { zodiac: '水瓶座', description: '若你想成为他/她的情人，你得多温柔些。', score: 61 },
      { zodiac: '双鱼座', description: '反而你要保护他/她，最后你会受不了。', score: 47 }
    ]
  },
  taurus: {
    bestMatches: [
      { zodiac: '处女座', description: '和他/她无所不谈，感觉像多年的朋友' },
      { zodiac: '摩羯座', description: '他/她让你很有安全感，是值得信赖的人' },
      { zodiac: '天蝎座', description: '高深莫测的他/她，对你有股致命的吸引力' }
    ],
    compatibility: [
      { zodiac: '白羊座', description: '总觉得自己无法跟上他/她的脚步。', score: 59 },
      { zodiac: '金牛座', description: '个性相契，但要发展成恋情颇费时间。', score: 77 },
      { zodiac: '双子座', description: '你会为他/她的见异思迁而痛苦。', score: 51 },
      { zodiac: '巨蟹座', description: '可从普通朋友开始，但总难理解他/她复杂的心。', score: 68 },
      { zodiac: '狮子座', description: '太温和的你，是会被他/她欺负的。', score: 26 },
      { zodiac: '处女座', description: '佳偶一对，可能会步入礼堂。', score: 96 },
      { zodiac: '天秤座', description: '向往真爱的你，抓不住他/她飘移的心。', score: 45 },
      { zodiac: '天蝎座', description: '若能让一步，应该是好伴侣。', score: 87 },
      { zodiac: '射手座', description: '射手座的他/她，热情来的快去的也快。', score: 42 },
      { zodiac: '摩羯座', description: '你们是好朋友，也是最佳情侣。', score: 93 },
      { zodiac: '水瓶座', description: '脑筋灵活的他/她，受不了你的慢吞吞。', score: 31 },
      { zodiac: '双鱼座', description: '多情的他/她会被你吸引，但他/她依赖性太重。', score: 64 }
    ]
  },
  gemini: {
    bestMatches: [
      { zodiac: '水瓶座', description: '彼此不谈，在他/她自己可以扮演最真的自己' },
      { zodiac: '天秤座', description: '跟他/她走在一起，让你很有面子' },
      { zodiac: '射手座', description: '他/她会教你很多新鲜的事，让你乐歪了' }
    ],
    compatibility: [
      { zodiac: '白羊座', description: '他/她只能当玩伴，若在一起会起争吵。', score: 60 },
      { zodiac: '金牛座', description: '他/她会受不了你的迟钝，彼此难以相处。', score: 56 },
      { zodiac: '双子座', description: '就像朋友般的交往，彼此都不够专情。', score: 73 },
      { zodiac: '巨蟹座', description: '他/她的包容力吸引了你，但也仅于此。', score: 51 },
      { zodiac: '狮子座', description: '你可以控制他/她的人，也可能成为他/她的情人。', score: 65 },
      { zodiac: '处女座', description: '对于凡事认真的他/她，你的爱意是难长久的。', score: 28 },
      { zodiac: '天秤座', description: '这是最佳的组合，流行的事物是共通的话题。', score: 93 },
      { zodiac: '天蝎座', description: '天蝎座的他/她，认为你不够专情。', score: 47 },
      { zodiac: '射手座', description: '保证你俩天天过的刺激，可以化解你的寂寞。', score: 82 },
      { zodiac: '摩羯座', description: '两个人是貌合神离，两人还是分离吧。', score: 41 },
      { zodiac: '水瓶座', description: '最佳的结合，可以先从朋友做起。', score: 96 },
      { zodiac: '双鱼座', description: '你无法满足他/她依赖的要求，迟早会分开。', score: 34 }
    ]
  },
  cancer: {
    bestMatches: [
      { zodiac: '双鱼座', description: '他/她总是那么温柔的对待你' },
      { zodiac: '天蝎座', description: '和他/她在一起，不须言语就能传达爱意' },
      { zodiac: '摩羯座', description: '他/她是值得尊敬的人，可以一起学习' }
    ],
    compatibility: [
      { zodiac: '白羊座', description: '积极的他/她受不了你的被动个性。', score: 38 },
      { zodiac: '金牛座', description: '彼此有情，但因都消极，恐怕难有进展。', score: 61 },
      { zodiac: '双子座', description: '你的温柔只会让他/她为所欲为。', score: 55 },
      { zodiac: '巨蟹座', description: '相处融洽，但容易以自己的缺点去要求别人。', score: 79 },
      { zodiac: '狮子座', description: '你觉得他/她让你有安全感，但受不了他/她的跋扈。', score: 52 },
      { zodiac: '处女座', description: '由朋友而成情人，但交往中切忌出轨。', score: 67 },
      { zodiac: '天秤座', description: '为了吸引他/她，常要注重打扮，使你疲于应付。', score: 20 },
      { zodiac: '天蝎座', description: '个性相投，要随时表示对他/她的专情。', score: 90 },
      { zodiac: '射手座', description: '你的过度要求，会让他/她逃之夭夭。', score: 46 },
      { zodiac: '摩羯座', description: '他/她是你的依赖，但彼此的价值观似乎有差异。', score: 89 },
      { zodiac: '水瓶座', description: '在他/她面前总是无法表达自己的意见，而感压抑。', score: 43 },
      { zodiac: '双鱼座', description: '最完美的组合，彼此是对方的终身伴侣。', score: 99 }
    ]
  },
  leo: {
    bestMatches: [
      { zodiac: '射手座', description: '对于他/她的热情话题，你会招架不住' },
      { zodiac: '白羊座', description: '对于你的热情，他/她会加倍奉还' },
      { zodiac: '水瓶座', description: '觉得和他/她在一起充满新鲜感' }
    ],
    compatibility: [
      { zodiac: '白羊座', description: '彼此皆是热情如火，但双亲的反对总是绊脚石。', score: 91 },
      { zodiac: '金牛座', description: '你们两的价值观不同，在一起会很痛苦。', score: 36 },
      { zodiac: '双子座', description: '等你表现出认真的态度，他/她会离你而去。', score: 62 },
      { zodiac: '巨蟹座', description: '你会被他/她的专情有所感动，但受不了他/她的啰唆。', score: 56 },
      { zodiac: '狮子座', description: '由约会中慢慢进展，但常有争吵。', score: 71 },
      { zodiac: '处女座', description: '总是由你主动，但小心伤到他/她自尊。', score: 50 },
      { zodiac: '天秤座', description: '你甘心被他/她牵着走，感到快乐。', score: 67 },
      { zodiac: '天蝎座', description: '你无法打开他/她的心，两人似乎无交集。', score: 23 },
      { zodiac: '射手座', description: '跟他/她在一起天天都是快乐的。', score: 98 },
      { zodiac: '摩羯座', description: '你们俩的结合，只是为了性罢了。', score: 49 },
      { zodiac: '水瓶座', description: '能感到彼此的魅力，很有可能深入交往。', score: 85 },
      { zodiac: '双鱼座', description: '长受他/她的情绪影响，易让你失去耐心。', score: 44 }
    ]
  },
  virgo: {
    bestMatches: [
      { zodiac: '摩羯座', description: '他/她能指正你的错误，而不让你讨厌' },
      { zodiac: '金牛座', description: '在他/她面前你无须装饰' },
      { zodiac: '双鱼座', description: '不知道哪里好就被深深吸引着' }
    ],
    compatibility: [
      { zodiac: '白羊座', description: '彼此的行动无法配合，会渐行渐远。', score: 42 },
      { zodiac: '金牛座', description: '他/她会让你感到安心，犹如避风港。', score: 94 },
      { zodiac: '双子座', description: '对于善变的他/她，你抓不住他/她的心。', score: 30 },
      { zodiac: '巨蟹座', description: '你俩在一起会觉得很自在。', score: 63 },
      { zodiac: '狮子座', description: '他/她的激情会让你招架不住。', score: 57 },
      { zodiac: '处女座', description: '由谈话中增进了解，可以增加感情的系绊。', score: 74 },
      { zodiac: '天秤座', description: '博爱的他/她会让你很有安全感。', score: 52 },
      { zodiac: '天蝎座', description: '彼此有着很深的信赖，但难打入他/她的心。', score: 66 },
      { zodiac: '射手座', description: '就算勉强在一起，迟早要分开。', score: 29 },
      { zodiac: '摩羯座', description: '他/她指引着你，可以说是你人生的伴侣。', score: 96 },
      { zodiac: '水瓶座', description: '你的浪漫无法吸引他/她的注意。', score: 48 },
      { zodiac: '双鱼座', description: '虽然彼此常闹意见，但越闹感情越好。', score: 81 }
    ]
  },
  libra: {
    bestMatches: [
      { zodiac: '双子座', description: '他/她的聪明与机灵，深深的吸引你' },
      { zodiac: '水瓶座', description: '他/她的柔情，会打动你心' },
      { zodiac: '白羊座', description: '看似冲动的他/她，却能给你启示' }
    ],
    compatibility: [
      { zodiac: '白羊座', description: '两个人相处时很自然，就好象好朋友。', score: 81 },
      { zodiac: '金牛座', description: '你会觉得他/她太无趣，连约会也觉无聊。', score: 43 },
      { zodiac: '双子座', description: '他/她交友广阔，让你日子多采多姿。', score: 97 },
      { zodiac: '巨蟹座', description: '彼此无法满足对方，也不知如何相处。', score: 38 },
      { zodiac: '狮子座', description: '彼此像是相处融洽，但总不习惯他/她的霸道。', score: 64 },
      { zodiac: '处女座', description: '适合淡淡的交往，或许哪一天他/她会感动。', score: 55 },
      { zodiac: '天秤座', description: '想法相似，但在一起常会吵嘴。', score: 75 },
      { zodiac: '天蝎座', description: '他/她的性感令你怦然心动，但别相似如胶。', score: 51 },
      { zodiac: '射手座', description: '保持朋友关系就好，否则会常吵嘴。', score: 69 },
      { zodiac: '摩羯座', description: '他/她总爱以自己的标准要求别人。', score: 21 },
      { zodiac: '水瓶座', description: '相处愉快无负担，可由约会中培养爱苗。', score: 92 },
      { zodiac: '双鱼座', description: '他/她的依赖与不负责任，会成为你的负担。', score: 46 }
    ]
  },
  scorpio: {
    bestMatches: [
      { zodiac: '巨蟹座', description: '有他/她在旁边就觉得温馨与安全' },
      { zodiac: '双鱼座', description: '他/她总是那么了解你，和他/她在一起很快乐' },
      { zodiac: '金牛座', description: '虽然他/她有一点愚蠢，但却不讨厌' }
    ],
    compatibility: [
      { zodiac: '白羊座', description: '个性单纯的他/她，是无法了解你内心的复杂。', score: 49 },
      { zodiac: '金牛座', description: '他/她虽然迟缓，却能燃烧你的热情。', score: 84 },
      { zodiac: '双子座', description: '要求真爱的你与游戏人间的他/她，是无交集的。', score: 40 },
      { zodiac: '巨蟹座', description: '巨蟹座的他/她能给你最专情的爱。', score: 96 },
      { zodiac: '狮子座', description: '你似乎不太能体会到那狮子座的魅力。', score: 32 },
      { zodiac: '处女座', description: '虽然心中彼此有意，但需要你的主动才行。', score: 61 },
      { zodiac: '天秤座', description: '爱玩的他/她令你很没安全感。', score: 57 },
      { zodiac: '天蝎座', description: '必须要花很长的时间，才能打开对方的心。', score: 72 },
      { zodiac: '射手座', description: '他/她是快乐的泉源，彼此维持朋友的关系既可。', score: 53 },
      { zodiac: '摩羯座', description: '俩人的关系易因环境而改变。', score: 68 },
      { zodiac: '水瓶座', description: '你虽接受他/她的生活态度，彼此没有进展。', score: 25 },
      { zodiac: '双鱼座', description: '他/她接受你的全部，并温柔的呵护你。', score: 94 }
    ]
  },
  sagittarius: {
    bestMatches: [
      { zodiac: '白羊座', description: '一见面就留下美好的印象' },
      { zodiac: '狮子座', description: '跟他/她约会是你最快乐的事' },
      { zodiac: '双子座', description: '抵挡不住他/她的魅力，深深为他/她着迷' }
    ],
    compatibility: [
      { zodiac: '白羊座', description: '相遇的那一刻彼此就深深的吸引。', score: 97 },
      { zodiac: '金牛座', description: '俩人的行动，总是无法配合。', score: 46 },
      { zodiac: '双子座', description: '觉得彼此是最佳的情侣，在一起很快乐。', score: 88 },
      { zodiac: '巨蟹座', description: '因同情而和他/她交往，但终究个性不合。', score: 44 },
      { zodiac: '狮子座', description: '约会的相契度高，应该是快乐的情侣。', score: 92 },
      { zodiac: '处女座', description: '你会受不了他/她斤斤计较的态度。', score: 35 },
      { zodiac: '天秤座', description: '可当好朋友，直来直往的你，不习惯他/她的圆滑。', score: 60 },
      { zodiac: '天蝎座', description: '他/她自尊心很高，难以打开他/她的心扉。', score: 56 },
      { zodiac: '射手座', description: '虽然同星座彼此很了解，但会因小事而闹翻。', score: 77 },
      { zodiac: '摩羯座', description: '他/她是良师，但因彼此的生活观的不同而疏远。', score: 51 },
      { zodiac: '水瓶座', description: '彼此都崇尚自由，难免都有点随性。', score: 69 },
      { zodiac: '双鱼座', description: '你做事果断，他/她拖拖拉拉，彼此根本合不来。', score: 23 }
    ]
  },
  capricorn: {
    bestMatches: [
      { zodiac: '处女座', description: '你要什么，他/她就依你，彼此相亲相爱' },
      { zodiac: '金牛座', description: '他/她是个守信值得信赖的人' },
      { zodiac: '巨蟹座', description: '想法虽然有点不同，但他/她总能包容你' }
    ],
    compatibility: [
      { zodiac: '白羊座', description: '两个人皆好胜，动不动就起冲突。', score: 22 },
      { zodiac: '金牛座', description: '你喜欢诚实的他/她，他/她也因你的坚强而受吸引。', score: 94 },
      { zodiac: '双子座', description: '你觉得他/她聪明，但他/她却不能忍受你的严肃。', score: 49 },
      { zodiac: '巨蟹座', description: '摩羯座代表父亲，巨蟹座是母亲，是好结合。', score: 83 },
      { zodiac: '狮子座', description: '他/她整天忙着课外活动，感情难有进展。', score: 41 },
      { zodiac: '处女座', description: '是最了解自己的人，而你是他/她的指引。', score: 95 },
      { zodiac: '天秤座', description: '和一味追求流行的他/她交往，累的人是你。', score: 37 },
      { zodiac: '天蝎座', description: '感情好，但他/她的占有欲会阻挠你的进展。', score: 63 },
      { zodiac: '射手座', description: '你欣赏他/她的乐观，但不喜欢他/她莽撞的态度。', score: 58 },
      { zodiac: '摩羯座', description: '彼此可当对方的切磋对象，共同勉励。', score: 71 },
      { zodiac: '水瓶座', description: '你总是猜不透他/她的内心，只是表面在交往。', score: 54 },
      { zodiac: '双鱼座', description: '温柔体贴的他/她，是温暖你的良方。', score: 66 }
    ]
  },
  aquarius: {
    bestMatches: [
      { zodiac: '天秤座', description: '他/她的态度从容有礼，而且举止优雅' },
      { zodiac: '双子座', description: '他/她是你的开心果，有他/她在就笑不断' },
      { zodiac: '狮子座', description: '一见他/她趾高气昂的模样，你也与有荣焉' }
    ],
    compatibility: [
      { zodiac: '白羊座', description: '彼此的个性干脆，容易相处。', score: 67 },
      { zodiac: '金牛座', description: '金牛座强烈的独占欲，让你想逃。', score: 27 },
      { zodiac: '双子座', description: '不论走到哪里，你们的感情都很好。', score: 92 },
      { zodiac: '巨蟹座', description: '彼此的价值观不同，所以相处的时间不多。', score: 45 },
      { zodiac: '狮子座', description: '他/她的想法勾起你的兴趣，彼此交往愉快。', score: 86 },
      { zodiac: '处女座', description: '他/她爱说教，这一点令你受不了。', score: 42 },
      { zodiac: '天秤座', description: '他/她能带你体会真正的人生乐趣，并相互扶持。', score: 98 },
      { zodiac: '天蝎座', description: '碰到城府深的他/她，你只好投降。', score: 31 },
      { zodiac: '射手座', description: '相处愉快，但他/她的热情似乎无法满足你。', score: 64 },
      { zodiac: '摩羯座', description: '凡事你都依赖他/她，交往实不能抱着游戏心态。', score: 59 },
      { zodiac: '水瓶座', description: '彼此是对方的最佳情人，通常会先当朋友。', score: 78 },
      { zodiac: '双鱼座', description: '可一起去唱歌，以培养彼此的感情。', score: 53 }
    ]
  },
  pisces: {
    bestMatches: [
      { zodiac: '天蝎座', description: '他/她虽然容易生气，但很有爱心' },
      { zodiac: '巨蟹座', description: '他/她在你低潮时，会永远鼓励你' },
      { zodiac: '处女座', description: '他/她思虑谨慎，可彼此互相照顾' }
    ],
    compatibility: [
      { zodiac: '白羊座', description: '你喜欢充满活力的他/她，但又受不了他/她的任性。', score: 67 },
      { zodiac: '金牛座', description: '个性相契，常一起出游，但对他/她期望别太高。', score: 27 },
      { zodiac: '双子座', description: '专情的他/她和善变的你，不可能成为情侣。', score: 45 },
      { zodiac: '巨蟹座', description: '不管身在何处，都有他/她在一旁保护你。', score: 92 },
      { zodiac: '狮子座', description: '开朗的他/她，不喜欢你的多愁善感。', score: 86 },
      { zodiac: '处女座', description: '他/她会教导你许多做人的道理，是你的良师。', score: 42 },
      { zodiac: '天秤座', description: '干脆的他/她和认真的你，是活在不同世界的人。', score: 98 },
      { zodiac: '天蝎座', description: '严肃又温柔的他/她，是支持你的力量。', score: 31 },
      { zodiac: '射手座', description: '两个人都很任性，不至于争吵，彼此无好感。', score: 64 },
      { zodiac: '摩羯座', description: '他/她就像你的咨询师，但会因他/她的严肃而争执。', score: 59 },
      { zodiac: '水瓶座', description: '博爱的他/她和你的价值观有偏差，故容易疏远。', score: 78 },
      { zodiac: '双鱼座', description: '很了解彼此的个性，但容易影响彼此的情绪。', score: 53 }
    ]
  }
}

const currentZodiac = ref('aries')

// 当前星座名称
const currentZodiacName = computed(() => {
  const zodiac = zodiacSigns.find(z => z.key === currentZodiac.value)
  return zodiac?.name || ''
})

// 当前星座数据
const currentZodiacData = computed(() => {
  return zodiacData[currentZodiac.value] || { bestMatches: [], compatibility: [] }
})

// 切换星座
function switchZodiac(key: string) {
  currentZodiac.value = key
}

// 根据分数获取颜色
function getScoreColor(score: number): string {
  if (score >= 90) return '#FF4757'
  if (score >= 80) return '#FF6B81'
  if (score >= 70) return '#FFA502'
  if (score >= 60) return '#FFD32A'
  if (score >= 50) return '#7BED9F'
  if (score >= 40) return '#70A1FF'
  return '#A4B0BE'
}

// 根据分数获取样式类
function getCompatibilityClass(score: number): string {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'fair'
  if (score >= 60) return 'average'
  return 'poor'
}
</script>

<style lang="scss" scoped>
.love-cp-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFE5EC 0%, #FFF5F7 100%);
}

// 头部背景
.header-bg {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%);
  padding: 40rpx 30rpx 50rpx;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200rpx;
    height: 200rpx;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 150rpx;
    height: 150rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  .header-title {
    display: block;
    font-size: 44rpx;
    font-weight: bold;
    color: white;
    margin-bottom: 12rpx;
    position: relative;
    z-index: 1;
  }

  .header-subtitle {
    display: block;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
    position: relative;
    z-index: 1;
  }
}

// 星座Tabs
.zodiac-tabs {
  background: white;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
  white-space: nowrap;

  .tabs-wrapper {
    display: inline-flex;
    padding: 0 10rpx;

    .tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16rpx 20rpx;
      margin: 0 6rpx;
      border-radius: 16rpx;
      transition: all 0.3s;
      min-width: 100rpx;

      &.active {
        background: linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%);

        .tab-icon,
        .tab-name {
          color: white;
        }
      }

      .tab-icon {
        font-size: 36rpx;
        color: #666;
        margin-bottom: 6rpx;
      }

      .tab-name {
        font-size: 22rpx;
        color: #666;
      }
    }
  }
}

// 内容滚动区域
.content-scroll {
  height: calc(100vh - 280rpx);
}

.content-wrapper {
  padding: 20rpx;
}

// 最佳配对卡片
.best-matches-card {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 30rpx rgba(255, 107, 157, 0.15);

  .card-header {
    margin-bottom: 24rpx;

    .card-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .matches-list {
    .match-item {
      display: flex;
      align-items: center;
      padding: 24rpx;
      background: linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%);
      border-radius: 16rpx;
      margin-bottom: 16rpx;

      &:last-child {
        margin-bottom: 0;
      }

      &.rank-1 {
        background: linear-gradient(135deg, #FFD6E8 0%, #FFAFCC 100%);
        border: 2rpx solid #FF8FB1;
      }

      &.rank-2 {
        background: linear-gradient(135deg, #FFE5EC 0%, #FFD6E8 100%);
      }

      .rank-badge {
        width: 50rpx;
        height: 50rpx;
        border-radius: 50%;
        background: linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        font-weight: bold;
        margin-right: 20rpx;
        flex-shrink: 0;
      }

      .match-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;

        .match-zodiac {
          font-size: 30rpx;
          font-weight: bold;
          color: #FF6B9D;
        }

        .match-desc {
          font-size: 24rpx;
          color: #666;
          line-height: 1.5;
        }
      }
    }
  }
}

// 配合度卡片
.compatibility-card {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(255, 107, 157, 0.15);

  .card-header {
    margin-bottom: 24rpx;

    .card-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .compatibility-list {
    .compatibility-item {
      display: flex;
      align-items: center;
      padding: 20rpx;
      background: #F8F9FA;
      border-radius: 16rpx;
      margin-bottom: 12rpx;

      &.excellent {
        background: linear-gradient(135deg, #FFF0F3 0%, #FFE5EC 100%);
      }

      &.good {
        background: linear-gradient(135deg, #FFF5F7 0%, #FFF0F3 100%);
      }

      .compatibility-left {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6rpx;

        .compatibility-zodiac {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
        }

        .compatibility-desc {
          font-size: 22rpx;
          color: #999;
          line-height: 1.4;
        }
      }

      .compatibility-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8rpx;
        margin-left: 20rpx;

        .score-bar {
          width: 100rpx;
          height: 12rpx;
          background: #E8E8E8;
          border-radius: 6rpx;
          overflow: hidden;

          .score-fill {
            height: 100%;
            border-radius: 6rpx;
            transition: width 0.5s ease;
          }
        }

        .score-text {
          font-size: 24rpx;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
