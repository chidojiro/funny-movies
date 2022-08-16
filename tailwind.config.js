module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        h5: '16px',
        h4: '18px',
        h3: '20px',
        h2: '24px',
        h1: '28px',
      },
      colors: ({ theme }) => ({
        primary: theme.colors.indigo[500],
        danger: theme.colors.red[500],
      }),
    },
  },
  plugins: [],
};
