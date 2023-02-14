import { run } from '../helpers';

let obj;
let obj2;

run(
  100,
  function (i, k) {
    window.__testValue = {
      a0: k,
      a250: k + i,
      a499: k + i + 10,
      ...obj,
      ...obj2,
    };
  },
  function (k) {
    obj = Array(7_500).fill(null).map((_, i) => i).reduce((acc, it) => {
      acc['a' + it] = it;
      return acc;
    }, {});

    obj2 = { ...obj };
    Object.keys(obj2).forEach(key => {
      obj2[key] += 10;
    });
  },
);
