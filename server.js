const express = require('express');
const fse = require('fs-extra');
const glob = require('glob');
const path = require('path');
const { exec, execSync } = require('child_process');
const { SingleBar } = require('cli-progress');
const { ArgumentParser } = require('argparse');
const browserCommands = require('./browsers-commands.json');
const browserKillCommands = require('./browsers-kill-commands.json');
const { version } = require('./package.json');

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

const args = parser.parse_args();

const files = glob.sync(`./build/${args.mode}/*/*/*.html`).map(it => it.replace(/^\.\/build/, ''));
const maxTestPasses = args.mode === 'execution' ? 1 : 25;
const browsers = Object.keys(browserCommands);
const data = {};

let browsersIndex = 0;
let fileIndex = 0;
let passes = 0;
let progress;
let runBrowserTimeout;

const runBrowser = () => {
  const file = files[fileIndex];
  const browser = browsers[browsersIndex];
  const command = browserCommands[browser];

  clearTimeout(runBrowserTimeout);
  exec(`${command} "http://localhost:${args.port}${file}?browser=${browser}"`);

  // Rerun test after 3 minutes if it's for some reason failed
  runBrowserTimeout = setTimeout(runBrowser, 1_000 * 60 * 3);
};

const makeIteration = () => {
  if (passes === 0 || passes >= maxTestPasses) {
    if (passes >= maxTestPasses) {
      passes = 0;

      fileIndex++;
      progress.update(fileIndex);
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
      progress.start(files.length, 0);
    }
  }

  passes++;
  setTimeout(runBrowser, 250);
};

const app = express();

app.use(express.json());
app.use(express.static('build'));

app.use((req, res, next) => {
  const { browser, feature, method } = req.body;

  if (feature && browser && method) {
    data[feature] ||= {};
    data[feature][browser] ||= {};
    data[feature][browser][method] ||= [];
  }

  next();
})

app.post(`/${args.mode}`, (req, res) => {
  const { browser, feature, method, results, duration } = req.body;

  if (args.mode === 'execution') {
    data[feature][browser][method] = results;
  } else {
    data[feature][browser][method].push(duration);
  }

  fse.outputFileSync(`results/${args.mode}/results.json`, JSON.stringify(data, undefined, 2));

  res.sendStatus(200);

  if (browserKillCommands[browser]) {
    execSync(browserKillCommands[browser]);
  }

  makeIteration();
});

app.listen(args.port, () => {
  console.log(`Running benchmark in ${args.mode} mode on port ${args.port}:`);
  makeIteration();
});
