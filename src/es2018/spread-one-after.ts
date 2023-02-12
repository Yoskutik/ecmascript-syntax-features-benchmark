import { run } from '../helpers';

let obj;

run(
  10_000,
  function (i, k) {
    window.__testValue = {
      ...obj,
      a0: k,
      a250: k + i,
      a499: k + i + 10,
    };
  },
  function (k) {
    obj = Array(500).fill(null).map((_, i) => i).reduce((acc, it) => {
      acc['a' + it] = it;
      return acc;
    }, {});
  }
);
