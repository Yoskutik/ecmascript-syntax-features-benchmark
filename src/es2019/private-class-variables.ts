import { run } from '../helpers';

class Class {
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

run(
  1_000_000,
  function () {
    new Class();
  },
);
