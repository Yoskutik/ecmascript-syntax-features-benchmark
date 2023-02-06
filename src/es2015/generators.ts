import { run } from '../helpers';

function* fun(i) {
  while (true) yield i;
}

const myGenObj = fun(10);

run(
  50_000_000,
  function () {
    window.__testValue = myGenObj.next().value;
  },
);
