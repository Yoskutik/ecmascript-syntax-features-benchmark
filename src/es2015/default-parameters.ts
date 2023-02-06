import { run } from '../helpers';

function fun(a = 'a', b = 'b', c = 'c', d = 'd', e = 'e', f = 'f', g = 'g', h = 'h', i = 'i', j = 'j', k = 'k') {
  window.__testValue = k;
  window.__testValue = g;
  window.__testValue = a;
  return 1;
}

run(
  20_000_000,
  function () {
    fun();
  },
);
