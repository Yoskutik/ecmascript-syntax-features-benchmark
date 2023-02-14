import { run } from '../helpers';

let obj;

run(
  250,
  function () {
    window.__testValue = { ...obj };
  },
  function (k) {
    obj = Array(7_500).fill(null).map((_, i) => i).reduce((acc, i) => {
      acc[i] = i + k;
      return acc;
    }, {});
  },
);
