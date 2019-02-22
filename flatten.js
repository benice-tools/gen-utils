/*

*/
function* flatten(gen) {
  let result = gen.next();

  while (!result.done) {
    let next;
    try {
      if (result.value && result.value.toString() === "[object Generator]") {
        next = yield* flatten(result.value);
      } else {
        next = yield result.value;
      }
    } catch (err) {
      // propagate error up in stack
      result = gen.throw(err);
      continue;
    }

    result = gen.next(next);
  }

  return result.value;
}

module.exports = flatten;
module.exports.default = flatten;
