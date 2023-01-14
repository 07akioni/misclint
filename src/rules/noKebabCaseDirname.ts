import { defineRule } from '../defineRule'

export const rule = defineRule(async (_, dirs) => {
  dirs.forEach((dir) => {
    if (dir.includes('-')) {
      console.error('invalid dirname', dir)
    }
  })
})
