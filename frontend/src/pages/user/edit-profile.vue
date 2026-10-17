<template>
  <view class="container">
    <!-- 氛围层（星云 + 星野，不可交互） -->
    <view class="sd-nebula" />
    <view class="sd-stars" />

    <view class="content sd-reveal">
      <!-- 头像位 -->
      <view class="avatar-block">
        <view class="avatar-sigil sd-sigil sd-sigil--lg">
          <image
            v-if="userStore.userInfo?.avatar"
            class="avatar-img"
            :src="userStore.userInfo.avatar"
            mode="aspectFill"
          />
          <text v-else>{{ nickname ? nickname.charAt(0) : '☉' }}</text>
        </view>
      </view>

      <!-- 基础资料 -->
      <view class="form-section">
        <text class="section-title">✦ 基础资料</text>

        <view class="form-item">
          <text class="label">昵称</text>
          <input class="input" v-model="nickname" placeholder="请输入昵称" placeholder-style="color: #8d95bd" />
        </view>

        <view class="form-item">
          <text class="label">匿名昵称</text>
          <view class="anonymous-input-wrapper">
            <input class="input anonymous-input" v-model="anonymousNickname" placeholder="用于树洞等场景" placeholder-style="color: #8d95bd" />
            <view class="refresh-btn" @click="refreshAnonymousNickname"><text>☄</text></view>
          </view>
          <text class="hint">点击 ☄ 可随机更换昵称</text>
        </view>
      </view>

      <!-- 个人展示 -->
      <view class="form-section">
        <text class="section-title">✦ 个人展示</text>

        <view class="form-item">
          <text class="label">个人简介</text>
          <textarea class="textarea" v-model="bio" placeholder="介绍一下自己" placeholder-style="color: #8d95bd" />
        </view>

        <view class="form-item">
          <text class="label">性别</text>
          <radio-group class="gender-switch" @change="onGenderChange">
            <label class="gender-option" :class="{ 'is-active': gender === 'male' }">
              <radio class="gender-radio" value="male" :checked="gender === 'male'" color="#4a3813" />
              <text>♂ 男</text>
            </label>
            <label class="gender-option" :class="{ 'is-active': gender === 'female' }">
              <radio class="gender-radio" value="female" :checked="gender === 'female'" color="#4a3813" />
              <text>♀ 女</text>
            </label>
          </radio-group>
        </view>
      </view>

      <!-- 生辰命理 -->
      <view class="form-section">
        <text class="section-title">✦ 生辰命理</text>

        <view class="form-item">
          <text class="label">出生日期</text>
          <picker mode="date" :value="birthDate || '1996-01-01'" @change="onDateChange">
            <view class="picker" :class="{ 'is-placeholder': !birthDate }">
              <text class="picker-value">{{ birthDate || '请选择出生日期' }}</text>
              <text class="picker-arrow">▾</text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">出生时辰</text>
          <picker mode="selector" :range="hours" @change="onHourChange">
            <view class="picker" :class="{ 'is-placeholder': birthHourIndex === null }">
              <text class="picker-value">{{ birthHourIndex !== null ? hours[birthHourIndex] : '请选择出生时辰' }}</text>
              <text class="picker-arrow">▾</text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">出生省份</text>
          <picker mode="selector" :range="provinces" @change="onBirthProvinceChange">
            <view class="picker" :class="{ 'is-placeholder': !birthProvince }">
              <text class="picker-value">{{ birthProvince || '请选择出生省份' }}</text>
              <text class="picker-arrow">▾</text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">现居地省份</text>
          <picker mode="selector" :range="provinces" @change="onCurrentProvinceChange">
            <view class="picker" :class="{ 'is-placeholder': !currentProvince }">
              <text class="picker-value">{{ currentProvince || '请选择现居地省份' }}</text>
              <text class="picker-arrow">▾</text>
            </view>
          </picker>
        </view>
      </view>

      <view class="cta-row">
        <StardButton variant="gold" size="lg" block :loading="loading" @click="handleSave">
          <text>✦ 保存修改</text>
        </StardButton>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'
import StardButton from '@/components/stard-button/stard-button.vue'

const userStore = useUserStore()
const nickname = ref('')
const anonymousNickname = ref('')
const bio = ref('')
const gender = ref('male')
const birthDate = ref('')
const birthYear = ref(0)
const birthMonth = ref(0)
const birthDay = ref(0)
const birthHour = ref<number | null>(null)
const birthHourIndex = ref<number | null>(null)
const birthProvince = ref('')
const currentProvince = ref('')
const loading = ref(false)

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
]

// 随机选择匿名昵称
function refreshAnonymousNickname() {
  const randomIndex = Math.floor(Math.random() * anonymousNicknames.length)
  anonymousNickname.value = anonymousNicknames[randomIndex]
}

const hours = [
  '子时 (23:00-01:00)',
  '丑时 (01:00-03:00)',
  '寅时 (03:00-05:00)',
  '卯时 (05:00-07:00)',
  '辰时 (07:00-09:00)',
  '巳时 (09:00-11:00)',
  '午时 (11:00-13:00)',
  '未时 (13:00-15:00)',
  '申时 (15:00-17:00)',
  '酉时 (17:00-19:00)',
  '戌时 (19:00-21:00)',
  '亥时 (21:00-23:00)'
]

// 中国省级行政区
const provinces = [
  '北京', '天津', '上海', '重庆',
  '河北', '山西', '辽宁', '吉林', '黑龙江',
  '江苏', '浙江', '安徽', '福建', '江西', '山东',
  '河南', '湖北', '湖南', '广东', '海南',
  '四川', '贵州', '云南', '陕西', '甘肃', '青海',
  '台湾', '内蒙古', '广西', '西藏', '宁夏', '新疆',
  '香港', '澳门'
]

onMounted(() => {
  // 加载当前用户信息
  if (userStore.userInfo) {
    const user = userStore.userInfo
    nickname.value = user.nickname || ''
    anonymousNickname.value = user.anonymousNickname || ''
    bio.value = user.bio || ''
    gender.value = user.gender || 'male'

    // 如果用户已有出生日期，设置为已有值
    if (user.birthYear && user.birthMonth && user.birthDay) {
      birthYear.value = user.birthYear
      birthMonth.value = user.birthMonth
      birthDay.value = user.birthDay
      birthDate.value = `${user.birthYear}-${String(user.birthMonth).padStart(2, '0')}-${String(user.birthDay).padStart(2, '0')}`
    }
    // 如果用户已有时辰信息，需要将小时值转换为索引
    if (user.birthHour !== undefined && user.birthHour !== null) {
      birthHour.value = user.birthHour
      // 将小时值转换为索引（与注册页面保持一致）
      const hourMap = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]
      const index = hourMap.indexOf(user.birthHour)
      if (index !== -1) {
        birthHourIndex.value = index
      }
    }
    // 加载省份信息
    birthProvince.value = user.birthProvince || ''
    currentProvince.value = user.currentProvince || '北京'
  }
})

function onGenderChange(e: any) {
  gender.value = e.detail.value
}

function onDateChange(e: any) {
  birthDate.value = e.detail.value
  const [year, month, day] = e.detail.value.split('-')
  birthYear.value = parseInt(year)
  birthMonth.value = parseInt(month)
  birthDay.value = parseInt(day)
}

function onHourChange(e: any) {
  // 存储选中的索引
  birthHourIndex.value = e.detail.value
  // 将时辰索引转换为实际小时数
  const hourMap = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]
  birthHour.value = hourMap[e.detail.value]
}

function onBirthProvinceChange(e: any) {
  birthProvince.value = provinces[e.detail.value]
}

function onCurrentProvinceChange(e: any) {
  currentProvince.value = provinces[e.detail.value]
}

async function handleSave() {
  if (!nickname.value || !nickname.value.trim()) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }

  if (!birthDate.value) {
    uni.showToast({ title: '请选择出生日期', icon: 'none' })
    return
  }

  if (birthHour.value === null) {
    uni.showToast({ title: '请选择出生时辰', icon: 'none' })
    return
  }

  if (!birthProvince.value) {
    uni.showToast({ title: '请选择出生省份', icon: 'none' })
    return
  }

  if (!currentProvince.value) {
    uni.showToast({ title: '请选择现居地省份', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const updateData: any = {
      nickname: nickname.value.trim(),
      anonymousNickname: anonymousNickname.value.trim(),
      bio: bio.value.trim(),
      gender: gender.value,
      birthYear: birthYear.value,
      birthMonth: birthMonth.value,
      birthDay: birthDay.value,
      birthHour: birthHour.value,
      birthProvince: birthProvince.value,
      currentProvince: currentProvince.value
    }

    const res: any = await api.user.update(userStore.userInfo!.id, updateData)
    userStore.setUserInfo(res)

    // 保存成功后自动计算星盘
    try {
      const astrologyResult: any = await api.astrology.calculate(userStore.userInfo!.id)
      // 重新获取完整的用户信息，避免丢失 bio 等字段
      const updatedUser: any = await api.auth.getProfile()
      userStore.setUserInfo(updatedUser.user)
      console.log('星盘计算成功:', astrologyResult)
    } catch (astroError) {
      console.error('星盘计算失败:', astroError)
      // 星盘计算失败不影响保存流程
    }

    uni.showToast({ title: '保存成功', icon: 'success' })

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error: any) {
    let errorMsg = '保存失败，请稍后重试'
    if (error.message) {
      errorMsg = error.message
    } else if (error.data && error.data.message) {
      errorMsg = error.data.message
    }
    uni.showToast({ title: errorMsg, icon: 'none', duration: 3000 })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: $sd-bg;
}

.content {
  position: relative;
  z-index: 1;
  padding: 48rpx 40rpx 48rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 48rpx);
}

// 头像位
.avatar-block {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;

  .avatar-sigil {
    overflow: hidden;

    .avatar-img {
      width: 100%;
      height: 100%;
    }
  }
}

// 表单区块
.form-section {
  @include sd-card-surface();
  padding: 36rpx 32rpx;
  margin-bottom: 28rpx;

  .section-title {
    display: block;
    font-family: $sd-font-display;
    font-size: 30rpx;
    letter-spacing: 3rpx;
    margin-bottom: 30rpx;
    @include sd-gold-text();
  }

  .form-item {
    margin-bottom: 32rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      display: block;
      font-size: 26rpx;
      color: $sd-text-2;
      letter-spacing: 2rpx;
      margin-bottom: 14rpx;
    }

    .input {
      width: 100%;
      height: 88rpx;
      box-sizing: border-box;
      background: $sd-bg-raise;
      border: 1rpx solid $sd-stroke;
      border-radius: $sd-radius;
      padding: 0 28rpx;
      font-size: 28rpx;
      color: $sd-text;
      caret-color: $sd-gold-bright;
    }

    .hint {
      display: block;
      font-size: 22rpx;
      color: $sd-text-3;
      margin-top: 12rpx;
    }

    // 匿名昵称随机按钮：金印章
    .anonymous-input-wrapper {
      display: flex;
      align-items: center;
      gap: 16rpx;

      .anonymous-input {
        flex: 1;
      }

      .refresh-btn {
        @include sd-sigil-base();
        width: 88rpx;
        height: 88rpx;
        font-size: 40rpx;
        flex-shrink: 0;

        &:active {
          transform: scale(0.94);
          opacity: 0.85;
        }
      }
    }

    // 个人简介多行输入
    .textarea {
      width: 100%;
      box-sizing: border-box;
      min-height: 180rpx;
      padding: 20rpx 28rpx;
      background: $sd-bg-raise;
      border: 1rpx solid $sd-stroke;
      border-radius: $sd-radius;
      font-size: 28rpx;
      color: $sd-text;
      caret-color: $sd-gold-bright;
    }

    // 性别选择：胶囊式切换
    .gender-switch {
      display: flex;
      gap: 8rpx;
      padding: 8rpx;
      background: $sd-bg-nav;
      border: 1rpx solid $sd-stroke;
      border-radius: $sd-radius-pill;

      .gender-option {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8rpx;
        padding: 14rpx 0;
        border-radius: $sd-radius-pill;
        font-size: 26rpx;
        color: $sd-text-2;

        &:active {
          opacity: 0.85;
        }

        &.is-active {
          background: $sd-gold-grad;
          color: $sd-gold-ink;
          font-weight: bold;
          box-shadow: $sd-glow-gold;
        }

        .gender-radio {
          transform: scale(0.8);
        }
      }
    }

    // 选择器：输入面 + 尾部箭头
    .picker {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 88rpx;
      padding: 0 28rpx;
      background: $sd-bg-raise;
      border: 1rpx solid $sd-stroke;
      border-radius: $sd-radius;

      .picker-value {
        font-size: 28rpx;
        color: $sd-text;
      }

      .picker-arrow {
        font-size: 22rpx;
        color: $sd-text-3;
      }

      &.is-placeholder .picker-value {
        color: $sd-text-3;
      }
    }
  }
}

// 主 CTA
.cta-row {
  margin-top: 8rpx;
}
</style>
