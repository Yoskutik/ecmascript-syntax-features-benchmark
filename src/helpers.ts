declare const BUILD_TYPE: 'execution' | 'parsing';

declare global {
  interface Window {
    __testValue: unknown;
  }
}

const TEST_ITERATIONS_NUMBER = 25;

const params = new URLSearchParams(location.search);
const delay_between_iterations = +(params.get('delay') || 250);

const endUpRun = (
  statedAt: Date,
  results: number[],
  iteration: number,
  runSingle: () => void,
  init?: (i: number) => void,
) => {
  const diff = new Date().getTime() - statedAt.getTime();
  results.push(diff);
  init && init(iteration);

  if (iteration < TEST_ITERATIONS_NUMBER) {
    setTimeout(runSingle, delay_between_iterations);
  } else {
    const [, method, feature] = location.href.match(/\/([a-z-]+)\/(es.+)\.html/);

    fetch('/execution', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        browser: params.get('browser'),
        method,
        results,
        feature,
      }),
    }).then(() => {
      window.close();
    });
  }
};

export const run = (n: number, cb: (i: number, k: number) => void, init?: (i: number) => void) => {
  if (BUILD_TYPE === 'parsing') {
    cb(0, 0);
    cb(1, 1);
    return;
  }

  const results = [];

  let k = 0;
  init && init(k);
  const runSingle = () => {
    k++;

    const now = new Date();
    for (let i = 0; i < n; i++) {
      cb(i, k);
    }
    window.__testValue = window.__testValue;
    endUpRun(now, results, k, runSingle, init);
  };

  setTimeout(runSingle, delay_between_iterations);
};

export const runAsync = (n: number, cb: (i: number) => Promise<void>, init?: (i: number) => void) => {
  if (BUILD_TYPE === 'parsing') {
    cb(0);
    cb(1);
    return;
  }

  const results = [];

  let k = 0;
  init && init(k);
  const runSingle = () => {
    k++;
    const now = new Date();

    Promise
      .all(Array(n).fill(null).map((_, i) => cb(i)))
      .then(() => {
        endUpRun(now, results, k, runSingle, init);
      });
  };

  setTimeout(runSingle, delay_between_iterations);
};
