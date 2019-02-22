// map generator inputs
function* mapIn(
  gen,
  callback
) {
  let result = gen.next();

  while (!result.done) {
    let yielded;

    try {
      yielded = yield result.value;
    } catch (e) {
      result = gen.throw(e); // propagate error up in stack
      continue;
    }

    result = gen.next(
      callback(yielded)
    );
  }

  return result;
}

module.exports = mapIn;
module.exports.default = mapIn;
