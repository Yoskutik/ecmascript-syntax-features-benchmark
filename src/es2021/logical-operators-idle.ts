import { run } from '../helpers';

run(
  25_000_000,
  function (i) {
    window.__testValue ||= '||';
    window.__testValue ??= '??';
    window.__testValue = undefined;
    window.__testValue &&= '&&';
  },
);
