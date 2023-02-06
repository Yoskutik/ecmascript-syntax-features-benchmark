import { run } from '../helpers';

const obj = Array(500).fill(null).map((_, i) => i).reduce((acc, it) => {
  acc['a' + it] = it;
  return acc;
}, {});

const obj2 = { ...obj };
Object.keys(obj2).forEach(key => {
  obj2[key] += 10;
});

run(
  5_000,
  function () {
    window.__testValue = { a250: 1, ...obj, ...obj2 };
  },
);
