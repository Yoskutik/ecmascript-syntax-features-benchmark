import { run } from '../helpers';

class Class1 {
  constructor() {
    window.__testValue = 'Class1';
  }

  method1() {
    window.__testValue = 'method1';
  }
}

class Class2 extends Class1 {
  constructor() {
    super();
    window.__testValue = 'Class2';
  }

  method2() {
    super.method1();
  }
}

class Class3 extends Class2 {
  constructor() {
    super();
    window.__testValue = 'Class3';
  }

  method3() {
    super.method2();
    window.__testValue = 'method3';
  }
}

class Class4 extends Class3 {
  constructor() {
    super();
    window.__testValue = 'Class4';
  }
}

run(
  1_000_000,
  function () {
    new Class4().method3();
  }
);
