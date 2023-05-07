import { run } from '../helpers';

const obj = Array(7_500).fill(null)
  .map((_, i) => i)
  .reduce((acc, i) => {
    acc[i] = i;
    return acc;
  }, {});

run(
  250,
  function () {
    window.__testValue = { ...obj };
  },
);
