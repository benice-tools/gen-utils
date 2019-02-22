// maps generator outs
function* mapOut(
  gen,
  callback
) {
  let result = callback(gen.next());

  while (!result.done) {
    let yielded;

    try {
      yielded = yield result.value;
    } catch (e) {
      // map result if error is caught
      result = callback(gen.throw(e));
      continue;
    }

    result = callback(gen.next(yielded));
  }

  return result.value;
}

module.exports = mapOut;
module.exports.default = mapOut;
