import { runAsync } from '../helpers';

const mss = Array(25).fill(null).map((_, i) => i);

function sleep(ms) {
  return new Promise(
    function (resolve) {
      setTimeout(resolve, ms);
    },
  );
}

const fns = Array(10_000).fill(null).map(() => (
  async function(i) {
    for (let j = 0; j < 15; j++) {
      var res2 = sleep(mss[(i + j * 2) % 25]);
      await sleep(mss[(i + j * 3) % 25]);
      await res2;
    }
  }
));

runAsync(
  10_000,
  function (i) {
    return fns[i % fns.length](i);
  },
);
