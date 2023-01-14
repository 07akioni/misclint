import { defineRule } from '../defineRule'

export const rule = defineRule(async (files) => {
  files.forEach((file) => {
    if (file.includes('-')) {
      console.error('invalid dirname', file)
    }
  })
})
