import { run } from '../helpers';

type TFn = (...args: string[]) => void;

const fns: TFn[]  = Array(25_000).fill(null)
  .reduce((acc) => {
    acc.push(
      function(
        a = 'a', b = 'b', c = 'c'
      ) {
        window.__testValue = a + b + c;
        return window.__testValue;
      },
      function(
        a = 'a', b = 'b', c = 'c',
        d = 'd', e = 'e', f = 'f',
      ) {
        window.__testValue = b + d + f;
        return window.__testValue;
      },
      function(
        a = 'a', b = 'b', c = 'c',
        d = 'd', e = 'e', f = 'f',
        g = 'g', h = 'h', i = 'i',
      ) {
        window.__testValue = b + e + i;
        return window.__testValue;
      },
      function(
        a = 'a', b = 'b', c = 'c',
        d = 'd', e = 'e', f = 'f',
        g = 'g', h = 'h', i = 'i',
        j = 'j', k = 'k', l = 'l',
      ) {
        window.__testValue = a + h + l;
        return window.__testValue;
      },
    )
    return acc;
  }, []);

run(
  25_000_000,
  function (i) {
    fns[i % fns.length]();
  },
);
