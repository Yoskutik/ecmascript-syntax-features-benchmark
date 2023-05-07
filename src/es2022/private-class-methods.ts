import { run } from '../helpers';

const classes = Array(10_000).fill(null).map(() => (
  class {
    // @ts-ignore
    #methodA(a: number) {
      return a + 1;
    };

    // @ts-ignore
    #methodB(b: number) {
      return b + 2;
    };

    // @ts-ignore
    #methodC(c: number) {
      // @ts-ignore
      return this.#methodA(c + 1, c - 1);
    };

    constructor(i: number) {
      // @ts-ignore
      window.__testValue = this.#methodC(i);
    }
  }
))

run(
  500_000,
  function (i) {
    new classes[i % classes.length](i);
  },
);
