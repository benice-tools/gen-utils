const flatten = require("./flatten");
const mapIn = require("./mapIn");
const mapOut = require("./mapOut");

describe("flatten", () => {
  test("plain generator", () => {
    function* generatorFn() {
      yield 5;
      return yield 10;
    }

    const g = flatten(generatorFn());

    let result = g.next();
    expect(result.done).toBe(false);
    expect(result.value).toBe(5);

    result = g.next();

    expect(result.done).toBe(false);
    expect(result.value).toBe(10);

    result = g.next("passedToNext");

    expect(result.done).toBe(true);
    expect(result.value).toBe("passedToNext");
  });

  test("nested generators", () => {
    function* deepChild() {
      yield 3;
    }

    function* child() {
      yield 2;

      yield deepChild();
    }

    function* generatorFn() {
      yield 1;

      yield child();

      return 10
    }

    const g = flatten(generatorFn());

    result = g.next();
    expect(result.done).toBe(false);
    expect(result.value).toBe(1);

    result = g.next();
    expect(result.done).toBe(false);
    expect(result.value).toBe(2);

    result = g.next();
    expect(result.done).toBe(false);
    expect(result.value).toBe(3);

    result = g.next();
    expect(result.done).toBe(true);
    expect(result.value).toBe(10);
  });

  test("nesting generators return", () => {
    function* child() {
      return yield 2;
    }

    function* generatorFn() {
      yield 1;

      return yield child();
    }

    const g = flatten(generatorFn());

    result = g.next();
    expect(result.done).toBe(false);
    expect(result.value).toBe(1);

    result = g.next(10);
    expect(result.done).toBe(false);
    expect(result.value).toBe(2);

    result = g.next(3);
    expect(result.done).toBe(true);
    expect(result.value).toBe(3);
  });

  test("trow to nested generator", () => {
    function* child() {
      try {
        yield 2;
      } catch (err) {
        return 3;
      }
    }

    function* generatorFn() {
      yield 1;

      return yield child();
    }

    const g = flatten(generatorFn());

    result = g.next();
    expect(result.done).toBe(false);
    expect(result.value).toBe(1);

    result = g.next(10);
    expect(result.done).toBe(false);
    expect(result.value).toBe(2);

    result = g.throw(new Error("Test"));
    expect(result.done).toBe(true);
    expect(result.value).toBe(3);
  });
});

describe("mapIn", () => {
  test("identity", () => {
    function* generatorFn() {
      yield yield 1;
      yield yield 2;
    }

    const g = mapIn(generatorFn(), x => x);

    let result = g.next();
    expect(result.value).toBe(1);
    result = g.next(10);
    expect(result.value).toBe(10);

    result = g.next();
    expect(result.value).toBe(2);
    result = g.next(20);
    expect(result.value).toBe(20);
  });

  test("transform", () => {
    function* generatorFn() {
      yield yield 1;
      yield yield 2;
    }

    const g = mapIn(generatorFn(), x => x*2);

    let result = g.next();
    expect(result.value).toBe(1);
    result = g.next(10);
    expect(result.value).toBe(20);

    result = g.next();
    expect(result.value).toBe(2);
    result = g.next(20);
    expect(result.value).toBe(40);
  });
});

describe("mapOut", () => {
  test("identity", () => {
    function* generatorFn() {
      yield 1;
      return 2;
    }

    const g = mapOut(generatorFn(), x => x);

    let result = g.next();
    expect(result.value).toBe(1);
    result = g.next();
    expect(result.value).toBe(2);
    expect(result.done).toBe(true);
  });

  test("transform", () => {
    function* generatorFn() {
      yield 1;
      return 2;
    }

    const g = mapOut(generatorFn(), ({ done, value }) => ({
      done,
      value: value * 2
    }));

    let result = g.next();
    expect(result.value).toBe(2);
    result = g.next();
    expect(result.value).toBe(4);
    expect(result.done).toBe(true);
  });

  // TODO: test altering done
});
