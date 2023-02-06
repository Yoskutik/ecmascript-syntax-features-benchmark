const path = require('path');
const glob = require('glob');
const fs = require('fs');
const HtmlPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const { createConfigs } = require("./utils");

const files = glob.sync('./src/*/*.ts').filter(it => !it.endsWith('.parsing.ts'));
const entries = files.reduce((acc, file) => {
  acc[file.match(/\/src\/(.+)\.ts/)[1]] = file.replace('.ts', '.parsing.ts');
  return acc;
}, {});

module.exports = createConfigs('parsing', entries);
