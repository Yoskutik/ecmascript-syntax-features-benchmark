const express = require('express');
const fse = require('fs-extra');
const glob = require('glob');
const {execSync, exec} = require('child_process');
const {SingleBar} = require('cli-progress');
const webdriver = require('webdriverio');
const os = require('os');

const androidBrowsersCapabilities = require('./androidBrowserCapabilities');
const commands = require('./commands.json')[process.platform];
const {args} = require('./arguments');
const {logger} = require('./logger');

const ip = Object.values(os.networkInterfaces())
  .flat()
  .filter((details) => details.family === 'IPv4' && !details.internal)[0].address;

const browsers = args.os === 'android' ? Object.keys(androidBrowsersCapabilities) : Object.keys(commands.start);
const sessionId = `${Math.random()}${Date.now()}`;

let data = {};
let files = glob.sync(`./build/${args.mode}/*/*/*.html`)
  .map(it => it.replace(/^build/, ''))
  .sort((a, b) => a.localeCompare(b));

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
let mobileDriver;

const createMobileDriver = async () => {
  const driver = await webdriver.remote({
    capabilities: androidBrowsersCapabilities[browsers[browsersIndex]],
    logLevel: 'silent',
    path: '/wd/hub',
    port: 4723,
  });

  driver.on("terminate", (reason) => {
    logger.error(`Session terminated with reason: ${reason}`);
  });

  return driver;
};

const runBrowser = async () => {
  const file = files[fileIndex];
  const browser = browsers[browsersIndex];
  const command = commands.start[browser];

  logger.info(`Opens browser: ${browser}, file: ${file}, iter: ${passes}/${args.iterations}`);
  const url = `http://${ip}:${args.port}${file}?browser=${browser}&delay=${args.delay}&sessionId=${sessionId}&_ts=${Date.now()}`;
  clearTimeout(runBrowserTimeout);
  if (args.os === 'android') {
    try {
      mobileDriver = await createMobileDriver();
      logger.info('WebDriverIO session created');
      await mobileDriver.url(url);
      logger.info('URL opened');
    } catch {
      logger.error('Error while creating new WebDriverIO session');
    }
  } else {
    execSync(command.replace('{{URL}}', url));
    logger.info(command.replace('{{URL}}', url));
  }

  // Rerun test after 1.5 minutes if it's for some reason failed
  runBrowserTimeout = setTimeout(runBrowser, 1_000 * 60 * 1.5);
};

const makeIteration = async () => {
  if (passes === 0 || passes >= args.iterations) {
    if (passes >= args.iterations) {
      passes = 0;

      fileIndex++;
      progress.update(fileIndex * args.iterations + passes);
      if (fileIndex === files.length) {
        progress.stop();
        execSync(commands.kill[browsers[browsersIndex]]);
        logger.info(`Previous browser ${browsers[browsersIndex]} was killed`);
        browsersIndex++;
        fileIndex = 0;
      }

      if (browsersIndex === browsers.length) {
        console.timeEnd(`Benchmark in ${args.mode} mode is done`);
        logger.info('Done!');
        process.exit(0);
      }
    }

    if (fileIndex % files.length === 0 && passes === 0) {
      progress = new SingleBar({
        format: `${browsers[browsersIndex].padEnd(8)}[{bar}] {percentage}% | ETA: {eta}s | {value}/{total}`,
      });
      progress.start(files.length * args.iterations, 0);

      try {
        execSync(commands.kill[browsers[browsersIndex]]);
        logger.info(`Current browser ${browsers[browsersIndex]} was killed`);
      } catch (e) {}
      exec(commands.prepare[browsers[browsersIndex]]);
      logger.info(`Current browser ${browsers[browsersIndex]} was prepared`);
    }
  }

  const progressIndex = fileIndex * args.iterations + passes++;
  progressIndex > 0 && progress.update(progressIndex);

  setTimeout(runBrowser, args.delay);
};

const app = express();

app.use(express.json());
app.use(express.static('build'));

app.post(`/${args.mode}`, async (req, res) => {
  const {browser, feature, method, results, duration, sessionId: reqSessionId} = req.body;

  if (sessionId !== reqSessionId) {
    res.status(400);
    res.send('Unknown session');
    logger.error('Got unknown session');
    return;
  }

  data[feature] ||= {};
  data[feature][browser] ||= {};
  data[feature][browser][method] ||= [];
  data[feature][browser][method].push(duration);

  fse.outputFileSync(`results/${args.mode}/results.json`, JSON.stringify(data, undefined, 2));

  res.sendStatus(200);

  if (args.os !== 'android') {
    commands.closeTab?.[browser] && execSync(commands.closeTab?.[browser]);
  } else {
    await mobileDriver.back()
      .then(() => logger.info('Opened tab is closed'))
      .catch(() => logger.error('Couldn\'t close the tab'));
    await mobileDriver.deleteSession()
      .then(() => logger.info('WebDriverIO session is deleted'))
      .catch(() => logger.error('Couldn\'t delete WebDriverIO session'));
  }

  makeIteration();
});

app.listen(args.port, () => {
  console.log(`Running benchmark in ${args.mode} mode on port ${args.port}:`);
  console.time(`Benchmark in ${args.mode} mode is done`);
  makeIteration();
});
