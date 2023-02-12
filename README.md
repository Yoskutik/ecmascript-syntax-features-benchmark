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

Features that was tested:
* ES2015:
  * Arrow Functions - test for how fast a function can be
  declared (es2015/arrow-functions-declaration) and used
  (es2015/arrow-functions-usage)
  * Classes - 


### Data processing

For visualization, the test results of each feature are drawn up
in the form of bar and box plots.

The value $1 / Q1(array)$ was chosen as a metric for visualization of
bar plots, where $Q1(array)$ is value of a lower quantile of the data
array. $Q1(array)$ is chosen because it shows how long it took to
complete the task at the moments when the processor was least busy
with other tasks. $Q1(array)$ is chosen instead of $min(array)$
in case a statistical outlier occurs in the data due to browser
optimization. $1 / Q1(array)$ shows the speed of a task execution
instead of duration, so such plots are easier to analyze.

Box plots are created by $1 / array$. And the reason is the same.

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



## Results

These results are relevant as of February 2023.

The results are differ from browser to browser. Which is why we can't
just say, in which build asynchronous functions work faster or slower.
But we can tell which assembly generates the fastest code if it is the
fastest in all browsers.

Below you can see a table that shows which build is the fastest (**F**)
and which is the slowest (**S**) for each of the features. If the
feature does not have the fastest and/or the slowest build, it means
that speed measurements vary in browsers.


### MacOS on ARM x64

#### Execution mode 

|                           | Modern | TypeScript | SWC    | Babel  |
|---------------------------|--------|------------|--------|--------|
| es2015/arrow-functions    | **ES** |            |        |        |
| es2015/classes            |        |            | **ES** | **ES** |
| es2015/default-parameters | **ES** | **EF**     |        |        |
| es2015/for-of-iterators   |        | **EF**     |        | **ES** |
| es2015/generators         |        |            |        |        |
| es2015/rest-parameters    | **EF** | **ES**     |        |        |
| es2015/spread-operator    |        | **EF**     | **ES** | **ES** |
| es2015/template-literals  | **EF** |            |        |        |
| es2016/template-literals  | **ES** |            |        |        |
| es2017/async-functions    | **EF** | **ES**     |        |        |
| es2018/async-functions    | **EF** | **ES**     |        |        |
| es2020/optional-chaining  | **EF** |            |        |        |

Results for `es2015/arrow-function-declaration`, `es2015/for-of-iterators`
and `es2018/private-class-variables` are vary.

### Windows on AMD x64