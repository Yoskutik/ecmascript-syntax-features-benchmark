import { run } from '../helpers';

let values = [];

run(
  5_000_000,
  function (i) {
    values.push(() => i);
  },
  function () {
    values = [];
  }
);
