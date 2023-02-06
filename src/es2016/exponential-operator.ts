import { run } from '../helpers';

run(
  10_000_000,
  function (i) {
    window.__testValue = (i % 20) ** 4;
  },
);
