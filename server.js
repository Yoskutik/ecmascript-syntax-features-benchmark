const express = require('express');
const fse = require('fs-extra');
const glob = require('glob');
const path = require('path');
const { exec, execSync } = require('child_process');
const { SingleBar } = require('cli-progress');
const { ArgumentParser } = require('argparse');
const { version } = require('./package.json');
const commands = require('./commands.json')[process.platform];

const parser = new ArgumentParser({
  description: 'EcmaScript Syntax Features Benchmark',
});

parser.add_argument('-v', '--version', {
  action: 'version',
  version,
});
parser.add_argument('-m', '--mode', {
  choices: ['execution', 'parsing'],
  help: 'benchmark mode',
  required: true,
});
parser.add_argument('-p', '--port', {
  help: 'port to run benchmark at',
  default: 8080,
  type: Number,
});
parser.add_argument('-d', '--delay', {
  help: 'delay between test iterations',
  default: 250,
  type: Number,
});
parser.add_argument('--update-method', {
  help: 'methods to update in already generated results.json file',
  action: 'append',
});
parser.add_argument('--update-feature', {
  help: 'methods to update in already generated results.json file',
  action: 'append',
});

const args = parser.parse_args();

const maxTestPasses = args.mode === 'execution' ? 1 : 25;
const browsers = Object.keys(commands.start);

let files = glob.sync(`./build/${args.mode}/*/*/*.html`).map(it => it.replace(/^\.\/build/, ''));
let data = {};

if (args.update_method) {
  data = fse.readJsonSync(`results/${args.mode}/results.json`);

  Object.keys(data).forEach(feature => {
    Object.keys(data[feature]).forEach(browsers => {
      args.update_method.forEach(method => {
        data[feature][browsers][method] = [];
      });
    });
  });

  files = files.filter(file => args.update_method.some(method => file.includes(method)));
}

if (args.update_feature) {
  data = fse.readJsonSync(`results/${args.mode}/results.json`);

  args.update_feature.forEach(feature => {
    Object.keys(data[feature]).forEach(browser => {
      Object.keys(data[feature][browser]).forEach(method => {
        data[feature][browser][method] = [];
      });
    });
  });

  files = files.filter(file => args.update_feature.some(method => file.includes(method)));
}

let browsersIndex = 0;
let fileIndex = 0;
let passes = 0;
let progress;
let runBrowserTimeout;

const runBrowser = () => {
  const file = files[fileIndex];
  const browser = browsers[browsersIndex];
  const command = commands.start[browser];

  clearTimeout(runBrowserTimeout);
  exec(`${command} "http://localhost:${args.port}${file}?browser=${browser}&delay=${args.delay}"`);

  // Rerun test after 3 minutes if it's for some reason failed
  runBrowserTimeout = setTimeout(runBrowser, 1_000 * 60 * 3);
};

const makeIteration = () => {
  if (passes === 0 || passes >= maxTestPasses) {
    if (passes >= maxTestPasses) {
      passes = 0;

      fileIndex++;
      progress.update(fileIndex * maxTestPasses + passes);
      if (fileIndex === files.length) {
        progress.stop();
        browsersIndex++;
        fileIndex = 0;
      }

      if (browsersIndex === browsers.length) {
        console.log(`Benchmark in ${args.mode} mode is done.`);
        process.exit(0);
      }
    }

    if (fileIndex % files.length === 0 && passes === 0) {
      progress = new SingleBar({
        format: `${browsers[browsersIndex].padEnd(8)}[{bar}] {percentage}% | ETA: {eta}s | {value}/{total}`,
      });
      progress.start(files.length * maxTestPasses, 0);
    }
  }

  const progressIndex = fileIndex * maxTestPasses + passes++;
  progressIndex > 0 && progress.update(progressIndex);

  setTimeout(runBrowser, args.delay);
};

const app = express();

app.use(express.json());
app.use(express.static('build'));

app.post(`/${args.mode}`, (req, res) => {
  const { browser, feature, method, results, duration } = req.body;

  data[feature] ||= {};
  data[feature][browser] ||= {};

  if (args.mode === 'execution') {
    data[feature][browser][method] = results;
  } else {
    data[feature][browser][method] ||= [];
    data[feature][browser][method].push(duration);
  }

  fse.outputFileSync(`results/${args.mode}/results.json`, JSON.stringify(data, undefined, 2));

  res.sendStatus(200);

  if (commands.kill?.[browser]) {
    execSync(commands.kill[browser]);
  }

  makeIteration();
});

app.listen(args.port, () => {
  console.log(`Running benchmark in ${args.mode} mode on port ${args.port}:`);
  makeIteration();
});
