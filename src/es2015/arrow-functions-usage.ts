import { run } from '../helpers';

const functions = [];

for (let i = 0; i < 5_000_000; i++) {
  functions.push(() => i);
}

let returnValues = [];

run(
  35_000_000,
  function (i) {
    returnValues.push(functions[i % 5_000_000]());
  },
  function () {
    returnValues = []
  },
);
