import { defineConfig, defineGlobalStyles } from '@pandacss/dev'

const globalCss = defineGlobalStyles({
  html: {
    scrollBehavior: 'smooth',
    _motionReduce: {
      scrollBehavior: 'auto'
    }
  }
})

export default defineConfig({
  // Whether to use css reset
  globalCss,
  preflight: true,
  presets: ['@pandacss/preset-base', '@park-ui/panda-preset'],
  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          primary: { value: '#9337c0' },
          secondary: { value: '#f96300' }
        }
      },
      recipes: {
        button: {
          base: {
            borderRadius: '0.5rem'
          }
        }
      }
    }
  },
  jsxFramework: 'react',
  // The output directory for your css system
  outdir: 'styled-system'
})
