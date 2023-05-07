import { run } from '../helpers';

const obj = Array(7_500).fill(null)
  .map((_, i) => i)
  .reduce((acc, i) => {
    acc['a' + i] = i;
    return acc;
  }, {});

run(
  250,
  function () {
    var { ...a } = obj;
    window.__testValue = a;
  },
);
