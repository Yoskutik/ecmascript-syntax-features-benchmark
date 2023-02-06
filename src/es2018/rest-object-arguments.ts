import { run } from '../helpers';

const obj = Array(500).fill(null).map((_, i) => i).reduce((acc, it) => {
  acc['a' + it] = it;
  return acc;
}, {});

function fn({ a250, ...x }: any) {
  return x;
}

run(
  10_000,
  function () {
    window.__testValue = fn(obj);
  },
);
