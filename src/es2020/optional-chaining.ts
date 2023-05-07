import { run } from '../helpers';

const obj: any = {};

let currentObj = obj;
Array(300).fill(null).forEach(() => {
  currentObj.a = {};
  currentObj = obj.a;
});

const values = [obj, {}];

run(
  15_000_000,
  function (i) {
    var tmpObj = values[i % 2];
    for (var j = 0; j < i % 10; j++) {
      tmpObj = tmpObj?.a?.a?.a?.a?.a;
    }
    window.__testValue = tmpObj;
  },
);
