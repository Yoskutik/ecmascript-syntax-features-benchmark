import { run } from '../helpers';

let obj;

run(
  100,
  function (i, k) {
    window.__testValue = {
      ...obj,
      a0: k,
      a3500: k + i,
      a7499: k + i + 10,
    };
  },
  function (k) {
    obj = Array(7_500).fill(null).map((_, i) => i).reduce((acc, it) => {
      acc['a' + it] = it;
      return acc;
    }, {});
  }
);
