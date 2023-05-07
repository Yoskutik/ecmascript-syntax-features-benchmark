import { run } from '../helpers';

const values = [undefined, 'defined'];

run(
  15_000_000,
  function (i) {
    var tv = values[i % 2];
    for (var j = 0; j < i % 10; j++) {
      tv = tv ?? tv ?? tv ?? tv ?? tv;
    }
    window.__testValue = tv;
  },
);
