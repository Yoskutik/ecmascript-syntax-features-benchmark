const { SingleBar } = require('cli-progress');
const { execSync } = require('child_process');
const glob = require('glob');
const fs = require('fs');

console.time('Parsing build is done');

const files = glob.sync('./src/*/*.ts').filter(it => !it.endsWith('.parsing.ts')).map(it => `./${it}`);

files.forEach(file => {
  const scriptFile = file.match(/([a-z-\d]+)\.ts$/)[1];
  const fileContent = fs.readFileSync(file, { encoding: 'utf-8' });
  const imports = [...new Set(fileContent.match(/import.+;/g))].join('\n');
  const declares = [...new Set(fileContent.match(/declare const.+;/g))];
  const fileContentWithoutImports = fileContent
    .replace(/import.+;/g, '')
    .replace(/declare const.+;/g, '');
  let content = `
  // This file is auto generated!
  ${imports}
  ${declares.join('\n')}
  ${`(function () {${fileContentWithoutImports}})();\n`.repeat(150)}
  `;
  fs.writeFileSync(file.replace('.ts', '.parsing.ts'), content);
});

const progress = new SingleBar({
  format: 'Building [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
});

progress.start(files.length, 0);

files.forEach((file, i) => {
  execSync(`webpack -c configs/parsing.config --env entry=${file}`);
  progress.update(i + 1);
});

progress.stop();

glob.sync('./src/**/*.parsing.ts').forEach(fs.unlinkSync);

console.timeEnd('Parsing build is done');
