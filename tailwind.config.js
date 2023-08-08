module.exports = {
  purge: ['./src/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#007BC0',
        secondary: 'var(--color-secondary)',
        loginBg: '#2563EB',
        greyColor: '#64748B',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
