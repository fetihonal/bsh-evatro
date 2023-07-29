module.exports = {
  purge: ['./src/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        loginBg: '#2563EB',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
