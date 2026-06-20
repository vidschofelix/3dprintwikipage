import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

// Extension point for future custom components (printer comparison
// tables, BOM lists, etc.). Keep this thin until we need it.
export default {
  extends: DefaultTheme,
} satisfies Theme
