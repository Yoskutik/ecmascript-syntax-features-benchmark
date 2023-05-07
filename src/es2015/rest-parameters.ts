import { run } from '../helpers';

const fns  = Array(20_000).fill(null)
  .reduce((acc) => {
    acc.push(
      function(a, ...rest) {
        window.__testValue = rest;
      },
      function(a, b, ...rest) {
        window.__testValue = rest;
      },
      function(a, b, c, ...rest) {
        window.__testValue = rest;
      },
      function(a, b, c, d, ...rest) {
        window.__testValue = rest;
      },
      function(a, b, c, d, e, ...rest) {
        window.__testValue = rest;
      },
    )
    return acc;
  }, []);

run(
  5_000_000,
  function (i) {
    fns[i % fns.length](i, 2, 3, 4, 5, 6, 7, i, 9, 10, 11, 12, 13, 14, i);
  },
);
