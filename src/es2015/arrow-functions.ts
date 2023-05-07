// import { run } from '../helpers';
//
// let tmp = 0;
//
// const fns = Array(IS_FOR_MOBILE ? 5_000_000 : 10_000_000)
//   .fill(null)
//   .map((_, i) => (
//     ((n: number) => {
//       var a = i + n;
//       tmp += a;
//       return tmp;
//     })
//   ));
//
// run(
//   25_000_000,
//   function (i) {
//     fns[i % fns.length](i);
//   },
// );

import { run } from '../helpers';

let tmp = 0;

const fns = Array(5_000_000)
  .fill(null)
  .map((_, i) => (
    ((n: number) => {
      var a = i + n;
      tmp += a;
      return tmp;
    })
  ));

run(
  35_000_000,
  function (i) {
    fns[i % fns.length](i);
  },
);

