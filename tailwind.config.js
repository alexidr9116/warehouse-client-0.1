const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: [
    "./src/**/*.{js,jsx,tx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
    container:{
      center:true,
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    styled: true,
    // themes: true,
    themes: [
      {
        mytheme: {
          "primary": "#570DF8",
          "secondary": "#44403c",
          "accent": "#3ABFF8",
          "neutral": "#3ABFF8",
          "base-100": "#FFFFFF",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#eab308",
          "error": "#ef4444",
        },
      }
      , 'dark'],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
}
