<template>
  <view class="container">
    <view class="form">
      <view class="form-item">
        <text class="label">昵称</text>
        <input class="input" v-model="nickname" placeholder="请输入昵称" />
      </view>

      <view class="form-item">
        <text class="label">个人简介</text>
        <textarea class="textarea" v-model="bio" placeholder="介绍一下自己" />
      </view>

      <view class="form-item">
        <text class="label">性别</text>
        <radio-group @change="onGenderChange">
          <label class="radio">
            <radio value="male" :checked="gender === 'male'" />
            <text>男</text>
          </label>
          <label class="radio">
            <radio value="female" :checked="gender === 'female'" />
            <text>女</text>
          </label>
        </radio-group>
      </view>

      <view class="form-item">
        <text class="label">出生日期</text>
        <picker mode="date" :value="birthDate || '1996-01-01'" @change="onDateChange">
          <view class="picker">{{ birthDate || '请选择出生日期' }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">出生时辰</text>
        <picker mode="selector" :range="hours" @change="onHourChange">
          <view class="picker">{{ birthHourIndex !== null ? hours[birthHourIndex] : '请选择出生时辰' }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">出生省份</text>
        <picker mode="selector" :range="provinces" @change="onBirthProvinceChange">
          <view class="picker">{{ birthProvince || '请选择出生省份' }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">现居地省份</text>
        <picker mode="selector" :range="provinces" @change="onCurrentProvinceChange">
          <view class="picker">{{ currentProvince || '请选择现居地省份' }}</view>
        </picker>
      </view>

      <button class="btn" @click="handleSave" :loading="loading">保存修改</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const nickname = ref('')
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
      // 更新store中的用户信息
      userStore.setUserInfo(astrologyResult.user)
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
  padding: 60rpx 40rpx;
  min-height: 100vh;
  background: #f8f9fa;
}

.form {
  .form-item {
    margin-bottom: 40rpx;

    .label {
      display: block;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
      font-weight: bold;
    }

    .input {
      width: 100%;
      height: 88rpx;
      background: white;
      border-radius: 12rpx;
      padding: 0 30rpx;
      font-size: 28rpx;
      border: 1rpx solid #e5e5e5;
    }

    .textarea {
      width: 100%;
      min-height: 160rpx;
      background: white;
      border-radius: 12rpx;
      padding: 20rpx 30rpx;
      font-size: 28rpx;
      border: 1rpx solid #e5e5e5;
    }

    .picker {
      width: 100%;
      height: 88rpx;
      background: white;
      border-radius: 12rpx;
      padding: 0 30rpx;
      font-size: 28rpx;
      border: 1rpx solid #e5e5e5;
      line-height: 88rpx;
    }

    .radio {
      margin-right: 40rpx;
      font-size: 28rpx;
    }
  }

  .btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12rpx;
    font-size: 32rpx;
    margin-top: 40rpx;
    font-weight: bold;
  }
}
</style>
