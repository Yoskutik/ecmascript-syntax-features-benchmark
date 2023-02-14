import { run } from '../helpers';

let obj;

run(
  100,
  function () {
    var { a0, a250, a499, ...a } = obj as any;
    window.__testValue = a;
  },
  function (k) {
    obj = Array(7_500).fill(null).map((_, i) => i).reduce((acc, i) => {
      acc['a' + i] = i + k;
      return acc;
    }, {});
  }
);
