import { run } from '../helpers';

const arr = Array(1000).fill(null).map((_, i) => i);

run(
  50_000,
  function () {
    for (var val of arr) {
      window.__testValue = val;
    }
  },
);
