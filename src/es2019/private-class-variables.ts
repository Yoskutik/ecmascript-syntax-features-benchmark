import { run } from '../helpers';

let classes;

run(
  500_000,
  function (i) {
    new classes[i % classes.length]();
  },
  function () {
    classes = Array(10_000).fill(null).map(() => (
      class {
        // @ts-ignore
        #a = 'a';

        // @ts-ignore
        #b = 'b';

        // @ts-ignore
        #c = this.#a + this.#b;

        constructor() {
          window.__testValue = this.#c;
        }
      }
    ))
  },
);
