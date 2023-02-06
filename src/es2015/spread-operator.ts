import { run } from '../helpers';

const args = Array(15).fill(null).map((_, i) => i) as
  [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];

let values = [];

function fun(
  a0: number,
  a1: number,
  a2: number,
  a3: number,
  a4: number,
  a5: number,
  a6: number,
  a7: number,
  a8: number,
  a9: number,
  a10: number,
  a11: number,
  a12: number,
  a13: number,
  a14: number,
) {
  values.push(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14);
}

run(
  5_000_000,
  function () {
    fun(...args);
  },
  function () {
    values = [];
  },
);
