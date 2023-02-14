import { run } from '../helpers';

let fns: ((n: number) => number)[];

run(
  30_000_000,
  function (i) {
    window.__testValue = fns[i % fns.length](i);
  },
  function(k) {
    fns = Array(10_000_000).fill(null).map((_, i) => (
      (n: number) => i + n + k
    ));
  }
);
