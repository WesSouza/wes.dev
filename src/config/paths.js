const { join, resolve } = require('path');

const base = resolve(__dirname, '../..');

const paths = {
  base,
  src: join(base, 'src'),
  scriptsSrc: join(base, 'src/scripts'),
  scriptsDest: join(base, 'assets'),
  stylesSrc: join(base, 'src/styles'),
  stylesDest: join(base, 'assets'),
};

module.exports = paths;
