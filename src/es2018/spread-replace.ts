import { run } from '../helpers';

const obj = Array(500).fill(null).map((_, i) => i).reduce((acc, it) => {
  acc['a' + it] = it;
  return acc;
}, {});

run(
  10_000,
  function () {
    window.__testValue = { ...obj, a250: 1 };
  },
);
