const { execSync } = require('child_process');
const glob = require('glob');
const fs = require('fs');

const files = glob.sync('./src/*/*.ts').filter(it => !it.endsWith('.parsing.ts'));

files.forEach(file => {
  const scriptFile = file.match(/([a-z-\d]+)\.ts$/)[1];
  const fileContent = fs.readFileSync(file, { encoding: 'utf-8' });
  const imports = fileContent.match(/^import.+/g).join('\n');
  const fileContentWithoutImports = fileContent.replace(/^import.+/g, '');
  let content = `
  // This file is auto generated!
  ${imports}
  ${`(() => {${fileContentWithoutImports}})();\n`.repeat(50)}
  `;
  fs.writeFileSync(file.replace('.ts', '.parsing.ts'), content);
});

execSync('webpack -c configs/parsing.config', { stdio: 'inherit' });

glob.sync('./src/**/*.parsing.ts').forEach(fs.unlinkSync);
