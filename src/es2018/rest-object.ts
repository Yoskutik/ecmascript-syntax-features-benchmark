import { run } from '../helpers';

let obj;

run(
  10_000,
  function () {
    var { ...a } = obj;
    window.__testValue = a;
  },
  function (k) {
    obj = Array(500).fill(null).map((_, i) => i).reduce((acc, i) => {
      acc['a' + i] = i + k;
      return acc;
    }, {});
  }
);
