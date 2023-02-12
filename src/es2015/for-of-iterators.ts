import { run } from '../helpers';

let arr;

run(
  50_000,
  function () {
    for (var val of arr) {
      window.__testValue = val;
    }
  },
  function (k) {
    arr = Array(1000).fill(k);
  }
);
