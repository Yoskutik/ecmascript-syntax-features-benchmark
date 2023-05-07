import { run } from '../helpers';

interface Instance0 {
  method0(): void;
}

interface Instance1 extends Instance0 {}

interface Instance2 extends Instance1 {
  method2(): void;
}

type Constructable<T> = new (...args: any[]) => T;

const count = 10_000;

const level0Classes: Constructable<Instance0>[] = Array(count).fill(null).map((_, i) => (
  class {
    constructor() {
      window.__testValue = 'class0' + i;
    }

    method0() {
      window.__testValue = 'method0' + i;
    }
  }
));

const level1Classes: Constructable<Instance1>[] = Array(count).fill(null).map((_, i) => (
  class extends level0Classes[i] {
    constructor() {
      super();
      window.__testValue = 'class1' + i;
    }
  }
));

const level2Classes: Constructable<Instance2>[] = Array(count).fill(null).map((_, i) => (
  class extends level1Classes[i] {
    constructor() {
      super();
      window.__testValue = 'class2' + i;
    }

    method2() {
      window.__testValue = 'method2' + i;
      this.method0();
    }
  }
));

run(
  500_000,
  function (i) {
    var Class = level2Classes[i % level2Classes.length];
    new Class().method2();
  },
);
