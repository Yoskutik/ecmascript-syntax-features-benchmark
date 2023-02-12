import { runAsync } from '../helpers';

let fns;

runAsync(
  10_000,
  function (i) {
    return fns[i % fns.length](i);
  },
  function () {
    const mss = Array(25).fill(null).map((_, i) => i);

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    fns = Array(10_000).fill(null).map(() => (
      async function(i) {
        for (let j = 0; j < 15; j++) {
          await sleep(mss[(i + j * 3) % 25]);
        }
      }
    ));
  },
);
