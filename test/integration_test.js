var reader = require('../src/reader')
  , evaluator = require('../src/evaluator')
  ;

describe('Clojure JS', function () {
  it('should execute simple expression', function () {
    evaluator.evaluate(reader.parse('(+ 1 1)')).should.equal(2);
  });

  it('should execute nested expression', function () {
    evaluator.evaluate(reader.parse('(+ 1 (* 2 3)')).should.equal(7);
  });

  it('should execute core functions', function () {
    evaluator.evaluate(reader.parse('(odd? 13)')).should.equal(true);
    evaluator.evaluate(reader.parse('(even? 13)')).should.equal(false);
  });

  it('should execute anonymous functions', function () {
    var f1 = evaluator.evaluate(reader.parse('(fn [a b] (+ a b))'));

    f1(1, 2).should.equal(3);

    var f2 = evaluator.evaluate(reader.parse('(fn [a] (fn [b] (+ a b)))'));

    f2(1)(2).should.equal(3);
  });
});
