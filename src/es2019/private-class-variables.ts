import { run } from '../helpers';

const classes = Array(10_000).fill(null).map(() => (
  class {
    // @ts-ignore
    #a = 'a';

    // @ts-ignore
    #b = 'b';

    // @ts-ignore
    #c = this.#a + this.#b;

    constructor() {
      // @ts-ignore
      window.__testValue = this.#c;
    }
  }
))

run(
  500_000,
  function (i) {
    new classes[i % classes.length]();
  },
);
