import { run } from '../helpers';

let obj;
let obj2;

run(
  100,
  function (i, k) {
    window.__testValue = {
      ...obj,
      ...obj2,
      a0: k,
      a1500: k + i,
      a3749: k + i + 10,
    };
  },
  function (k) {
    obj = Array(7_500).fill(null).map((_, i) => i).reduce((acc, i) => {
      acc['a' + i] = i + k;
      return acc;
    }, {});

    obj2 = { ...obj };
    Object.keys(obj2).forEach(key => {
      obj2[key] += 10;
    });
  },
);
