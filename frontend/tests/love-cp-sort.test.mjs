import test from 'node:test'
import assert from 'node:assert/strict'
import { sortCompatibilityByScoreDesc } from '../src/utils/love-cp.js'

test('爱情配合度按得分从高到低排序', () => {
  const input = [
    { zodiac: '双子座', score: 66 },
    { zodiac: '狮子座', score: 99 },
    { zodiac: '巨蟹座', score: 24 },
    { zodiac: '天秤座', score: 83 }
  ]

  const result = sortCompatibilityByScoreDesc(input)

  assert.deepEqual(
    result.map((item) => item.score),
    [99, 83, 66, 24]
  )
})

test('爱情配合度排序不修改原始数组', () => {
  const input = [
    { zodiac: '白羊座', score: 74 },
    { zodiac: '金牛座', score: 52 },
    { zodiac: '双子座', score: 66 }
  ]

  const originalScores = input.map((item) => item.score)

  sortCompatibilityByScoreDesc(input)

  assert.deepEqual(input.map((item) => item.score), originalScores)
})
