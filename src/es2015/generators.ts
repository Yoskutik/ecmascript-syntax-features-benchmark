import { run } from '../helpers';

function* fn() {
  var i = 0;
  while (true) yield i++;
}

const genObj = fn();

run(
  10_000_000,
  function () {
    window.__testValue = genObj.next().value;
  },
);
