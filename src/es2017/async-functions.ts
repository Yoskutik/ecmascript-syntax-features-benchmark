import { runAsync } from '../helpers';

const mss = Array(25).fill(null).map((_, i) => i);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

runAsync(
  10_000,
  async function single(i) {
    for (let j = 0; j < 7; j++) {
      await sleep(mss[(i + j * 3) % 25]);
    }
  }
);
