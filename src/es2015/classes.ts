import { run } from '../helpers';

let level0Classes;
let level1Classes;
let level2Classes;

run(
  500_000,
  function (i) {
    var Class: any = level2Classes[i % level2Classes.length];
    new Class().method2();
  },
  function (k) {
    level0Classes = Array(10_000).fill(null).map((_, i) => (
      class {
        constructor() {
          window.__testValue = 'class0'.concat(i.toString()).concat(k.toString());
        }

        method0() {
          window.__testValue = 'method0'.concat(i.toString()).concat(k.toString());
        }
      }
    ));

    level1Classes = Array(10_000).fill(null).map((_, i) => (
      class extends level0Classes[i] {
        constructor() {
          super();
          window.__testValue = 'class1'.concat(i.toString()).concat(k.toString());
        }
      }
    ));

    level2Classes = Array(10_000).fill(null).map((_, i) => (
      class extends level1Classes[i] {
        constructor() {
          super();
          window.__testValue = 'class2'.concat(i.toString()).concat(k.toString());
        }

        method2() {
          window.__testValue = 'method2'.concat(i.toString()).concat(k.toString());
          this.method0();
        }
      }
    ));
  }
);
