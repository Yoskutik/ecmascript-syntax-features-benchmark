import { run } from '../helpers';

run(
  1_000_000,
  function (i, k) {
    window.__testValue = {
      ['a'.concat((i % 5000).toString())]: k + i,
      ['a'.concat(((i + 100) % 5000).toString())]: k + i + 1,
      ['a'.concat(((i + 200) % 5000).toString())]: k + i + 2,
      ['a'.concat(((i + 300) % 5000).toString())]: k + i + 3,
      ['a'.concat(((i + 400) % 5000).toString())]: k + i + 4,
      ['a'.concat(((i + 500) % 5000).toString())]: k + i + 5,
    }
  },
)
