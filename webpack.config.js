const path = require('path');

module.exports = {
  entry: './query-selector-lite.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};
