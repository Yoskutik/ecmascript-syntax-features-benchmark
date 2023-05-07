import { run } from '../helpers';

run(
  500_000,
  function (i) {
    const k = i * 2;
    window.__testValue = (
       `${i}.${i + 1}.${i + 2}.${i + 3}.${i + 4}.${i + 5
      }.${k}.${k + 1}.${k + 2}.${k + 3}.${k + 4}.${k + 5
      }.${i}.${i + 1}.${i + 2}.${i + 3}.${i + 4}.${i + 5
      }.${k}.${k + 1}.${k + 2}.${k + 3}.${k + 4}.${k + 5}`
    );
  },
);
