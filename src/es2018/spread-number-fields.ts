import { run } from '../helpers';

let obj;

run(
  10_000,
  function () {
    window.__testValue = { ...obj };
  },
  function (k) {
    obj = Array(500).fill(null).map((_, i) => i).reduce((acc, i) => {
      acc[i] = i + k;
      return acc;
    }, {});
  },
);
