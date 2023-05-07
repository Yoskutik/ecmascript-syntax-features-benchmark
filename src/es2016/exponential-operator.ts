import { run } from '../helpers';

run(
  5_000_000,
  function (i) {
    var a = ((i / 13) % 10_000) ** ((i + 42) % 300);
    a = a % 1984;
    window.__testValue = a ** ((i + 7) % 17);
  },
);
