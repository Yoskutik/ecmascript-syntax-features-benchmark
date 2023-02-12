import { run } from '../helpers';

let args: [
  number, number, number, number, number, number, number,
  number, number, number, number, number, number, number,
][];
let fns;

run(
  5_000_000,
  function (i) {
    fns[i % fns.length](i, ...args[i % args.length]);
  },
  function () {
    args = Array(100_000).fill(null).map(() => (
      Array(14).fill(null).map((_, i) => i) as [
        number, number, number, number, number, number, number,
        number, number, number, number, number, number, number,
      ]
    ));

    fns = Array(100_000).fill(null).map(() => (
      function(
        a0: number, a1: number, a2: number,
        a3: number, a4: number, a5: number,
        a6: number, a7: number, a8: number,
        a9: number, a10: number, a11: number,
        a12: number, a13: number, a14: number,
      ) {
        window.__testValue = a0;
        window.__testValue = a5;
        window.__testValue = a10;
        window.__testValue = a14;
      }
    ));
  },
);
