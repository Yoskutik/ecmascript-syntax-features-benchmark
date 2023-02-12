import { run } from '../helpers';

let fns;

run(
  5_000_000,
  function (i) {
    fns[i % fns.length](i, 2, 3, 4, 5, 6, 7, i, 9, 10, 11, 12, 13, 14, i);
  },
  function () {
    fns = Array(100_000).fill(null).map(() => (
      function(a, ...rest) {
        window.__testValue = rest;
      }
    ))
  },
);
