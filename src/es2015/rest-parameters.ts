import { run } from '../helpers';

function fun(a, ...rest) {
  window.__testValue = rest;
}

run(
  5_000_000,
  function () {
    fun(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
  },
);
