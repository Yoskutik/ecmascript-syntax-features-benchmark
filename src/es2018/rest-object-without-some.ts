import { run } from '../helpers';

const obj = Array(7_500).fill(null)
  .map((_, i) => i)
  .reduce((acc, i) => {
    acc['a' + i] = i;
    return acc;
  }, {});

run(
  200,
  function () {
    var { a0, a100, a250, a500, a2000, a10000, a20000, ...a } = obj as any;
    window.__testValue = a;
  },
);
