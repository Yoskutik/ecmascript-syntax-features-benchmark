import { run } from '../helpers';

let fns;

run(
  20_000_000,
  function (i) {
    fns[i % fns.length]();
  },
  function () {
    fns = Array(100_000).fill(null).map(() => (
      function(a = 'a', b = 'b', c = 'c', d = 'd', e = 'e', f = 'f', g = 'g', h = 'h', i = 'i', j = 'j', k = 'k') {
        window.__testValue = k;
        window.__testValue = g;
        window.__testValue = a;
        return window.__testValue;
      }
    ));
  },
);
