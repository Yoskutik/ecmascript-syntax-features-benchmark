# EcmaScript Syntax Features Benchmark

This repository is created to measure the affect of EcmaScript
syntax features (e.g. asynchronous or arrow functions) on the
speed of code execution as well as the speed of reading a 
JavaScript file by browser.



## Methodology

There are 2 modes of this benchmark:
1. Execution mode - the measurement of how fast does feature work
in a browser;
2. Parsing mode - the measurement of how fast does browser read
and parse code that contains the feature.


### Collecting data

The benchmark is fully automized. The benchmark sets up a NodeJS
HTTP server for both of the modes. The server is needed to save
the results of each iteration of a test.

In each iteration of the test a feature runs a certain number of
times (e.g. 1 million times for ES2015 Classes or 50 million times
for ES2020 Optional Chaining). This number is selected in such a
way that each iteration lasts approximately the same amount of
time for different features.

_In the execution mode_ the browser opens ones in a private (aka
incognito) mode for **each feature**. Every iteration of the test runs
in the same page for 25 times and measures how long it took (in
milliseconds). After 25 iterations all results are sent to the
server. There's also a delay between iterations.

_In the parsing mode_ the browser opens ones in a private mode
for **each feature and each iteration**. Every iteration measures
how long it took and sends the result to server. The server is
responsible to join these results into an array. There's also a
delay between iterations.


### Data processing

For visualization, the test results of each feature are drawn up
in the form of bar and box plots. The value $1 / median(array)$ was
chosen as a metric for visualization of bar plots.

Box plots are created by formula $1 / array$.

Also, for there are _detailed plots_ for each browser (e.g.
[this one](./results_Darwin-arm64/execution/detailed-per-browser/Chrome.png))
where data is visualized per each iteration for every feature.
Such graphics is used to tell are there any trends in data. The
presence of a trend in such charts means that the test was written
incorrectly or the correct conditions for running the test were
not met.



## Raw results

This benchmark was launched on the following environments:
* MacOS on ARM x64: [execution](./results_Darwin-arm64/execution.md),
  [parsing](./results_Darwin-arm64/parsing.md)
* Windows on AMD x64: [execution](./results_Windows-AMD64/execution.md),
  [parsing](./results_Windows-AMD64/parsing.md)
* Android v. 11: [execution](./results_android-v11/execution.md),
  [parsing](./results_android-v11/parsing.md)



## How to set up

If you want to set the benchmark on your own you should follow the
instruction:
1. Install NodeJS and Python 3;
2. Install required dependencies:
```bash
$ npm install
$ pip3 install -r requirements.txt
```
3. And run one of the commands:
  * `npm run benchmark` - starts benchmark in both modes on your current
  machine;
  * `npm run benchmark:execution` - starts benchmark in the _execution_
  mode on your current machine;
  * `npm run benchmark:parsing` - starts benchmark in the _parsing_ mode
  on your current machine.

If you want to start the benchmark in the _execution_ mode on an Android
phone you should also:
1. Turn on the Developer mode on the phone;
2. Install Appium on the phone;
3. Install Appium server on your machine;
4. Install Android SDK;
5. Connect the phone to your machine;
6. Run `npm run benchmark:execution:android` command.

If you interested in further research, you can explore other commands
in **package.json**, or the manual of the HTTP server:

```bash
$ node server/server.js -h
```