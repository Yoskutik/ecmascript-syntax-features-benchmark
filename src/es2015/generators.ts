import { run } from '../helpers';

let myGenObj;

run(
  10_000_000,
  function () {
    window.__testValue = myGenObj.next().value;
  },
  function (k) {
    function* fun(i) {
      while (true) yield i;
    }

    myGenObj = fun(k);
  }
);
