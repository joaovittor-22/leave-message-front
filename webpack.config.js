const Dotenv = require('dotenv-webpack');

module.exports = {
  target:'node',
  plugins: [
    new Dotenv()
  ],
  resolve: {
    fallback: {
      crypto: false
    },
  },
};
