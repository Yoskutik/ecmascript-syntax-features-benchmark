import { run } from '../helpers';

let obj;

run(
  100,
  function (i, k) {
    window.__testValue = {
      a0: k,
      a250: k + i,
      a499: k + i + 10,
      ...obj,
    };
  },
  function (k) {
    obj = Array(7_500).fill(null).map((_, i) => i).reduce((acc, i) => {
      acc['a' + i] = i + k;
      return acc;
    }, {});
  },
);
