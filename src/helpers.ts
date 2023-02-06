declare const BUILD_TYPE: 'execution' | 'parsing';

declare global {
  interface Window {
    __testValue: unknown;
  }
}

const TEST_ITERATIONS_NUMBER = 25;
const TEST_DELAY_BETWEEN_ITERATIONS = 500;

const endUpRun = (
  statedAt: Date,
  results: number[],
  iteration: number,
  runSingle: () => void,
  onTestEnd?: () => void,
) => {
  const diff = new Date().getTime() - statedAt.getTime();
  results.push(diff);
  onTestEnd && onTestEnd();

  if (iteration < TEST_ITERATIONS_NUMBER) {
    setTimeout(runSingle, TEST_DELAY_BETWEEN_ITERATIONS);
  } else {
    const [, method, feature] = location.href.match(/\/([a-z-]+)\/(es.+)\.html/);

    fetch('/execution', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        browser: new URL(location.href).searchParams.get('browser'),
        method,
        results,
        feature,
      }),
    }).then(() => {
      window.close();
    });
  }
};

export const run = (n: number, cb: (i: number) => void, onTestEnd?: () => void) => {
  if (BUILD_TYPE === 'parsing') {
    cb(0);
    cb(1);
    return;
  }

  const results = [];

  let k = 0;
  const runSingle = () => {
    k++;

    const now = new Date();
    console.time('Done');
    for (let i = 0; i < n; i++) {
      cb(i);
    }
    console.timeEnd('Done');
    endUpRun(now, results, k, runSingle, onTestEnd);
  };

  setTimeout(runSingle, TEST_DELAY_BETWEEN_ITERATIONS);
};

export const runAsync = (n: number, cb: (i: number) => Promise<void>, onTestEnd?: () => void) => {
  if (BUILD_TYPE === 'parsing') {
    cb(0);
    cb(1);
    return;
  }

  const results = [];

  let k = 0;
  const runSingle = () => {
    k++;
    const now = new Date();

    Promise
      .all(Array(n).fill(null).map((_, i) => cb(i)))
      .then(() => {
        endUpRun(now, results, k, runSingle, onTestEnd);
      });
  };

  setTimeout(runSingle, TEST_DELAY_BETWEEN_ITERATIONS);
};
