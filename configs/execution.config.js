const { createConfigs } = require('./utils');
const glob = require("glob");

const files = glob.sync('./src/*/*.ts').filter(it => !it.endsWith('.parsing.ts'));
const entries = files.reduce((acc, file) => {
  acc[file.match(/\/src\/(.+)\.ts/)[1]] = file;
  return acc;
}, {});

module.exports = createConfigs('execution', entries);
