import { run } from '../helpers';

run(
  25_000_000,
  function (i, k) {
    window.__testValue = ((i / 13 + k / 7) % 10_000) ** ((i + 42) % 300);
  },
);
