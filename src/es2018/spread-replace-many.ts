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
  10_000,
  function () {
    window.__testValue = { ...obj, ...obj2, a250: 1 };
  },
);
