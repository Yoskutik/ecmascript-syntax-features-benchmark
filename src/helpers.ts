declare global {
  interface Window {
    __testValue: unknown;
  }

  const BUILD_TYPE: 'execution' | 'parsing';

  const IS_FOR_MOBILE: boolean;
}

const params = new URLSearchParams(location.search);

const endUpRun = (statedAt: Date) => {
  const diff = new Date().getTime() - statedAt.getTime();

  const match = location.href.match(/\/([a-z-]+)\/(es.+)\.html/);

  fetch('/execution', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      sessionId: params.get('sessionId'),
      browser: params.get('browser'),
      method: match[1],
      duration: diff,
      feature: match[2],
    }),
  }).then(() => {
    window.close();
  });
};

export const run = (n: number, cb: (i: number) => void) => {
  if (BUILD_TYPE === 'parsing') {
    cb(0);
    cb(1);
    return;
  }

  if (IS_FOR_MOBILE) {
    n = Math.floor(n / 2);
  }

  const now = new Date();
  for (let i = 0; i < n; i++) {
    cb(i);
  }

  endUpRun(now);
};

export const runAsync = (n: number, cb: (i: number) => Promise<void>) => {
  if (BUILD_TYPE === 'parsing') {
    cb(0);
    cb(1);
    return;
  }

  if (IS_FOR_MOBILE) {
    n = Math.floor(n / 2);
  }

  const now = new Date();
  Promise
    .all(Array(n).fill(null).map((_, i) => cb(i)))
    .then(() => endUpRun(now));
};
