var Namespace = require('./namespace').Namespace
  , specialforms = require('./clojure/specialforms')
  , tokens = require('./tokens')
  ;

exports.evaluate = evaluate;

function evaluate (exprs, context) {
  context = context || Namespace.current;

  return exprs.map(function (e) { return evaluateExpression(e, context); }).slice(-1)[0];
}

function evaluateExpression (expr, context) {
  switch (expr.kind) {
    case 'number':
      return +expr.value;
    case 'string':
      return expr.value;
    case 'identifier':
      return lookupIdentifier(expr.value, context);
    case 'vector':
      return expr.value.map(function (e) { return evaluateExpression(e, context);});
    case 'call':
      return evaluateCall(expr, context.extend());
  }
}

function evaluateCall (expr, context) {
  var func = evaluateExpression(expr.value[0], context)
    , args = expr.value.slice(1)
    ;

  if (!func.macro) {
    args = args.map(function (a) { return evaluateExpression(a, context);});
  }

  return func.apply(context, args);
}

function lookupIdentifier (name, context) {
  var identifier
    , lookups = [
      lookupLiteralIdentifier
    , lookupSpecialForm
    , lookupContextIdentifier
    , lookupWindowIdentifier
    , lookupGlobalIdentifier
    , throwUnableToResolve
    ];

  lookups.find(function (lookup) {
    return (identifier = lookup.call(this, name, context)) !== undefined;
  });

  return identifier;
}

function lookupLiteralIdentifier (name) {
  if (name === 'true') return true;
  if (name === 'false') return false;
  if (name === 'nil') return null;
}

function lookupSpecialForm (name ) {
  var form = specialforms[name];

  if (typeof form === 'function') {
    return form;
  }
}

function lookupContextIdentifier (name, context) {
  if (context.get(name) !== undefined) {
    return context.get(name);
  }
}

function lookupWindowIdentifier (name) {
  if (typeof window !== 'undefined' && window[name] !== undefined) {
    return function () {
      return window[name].apply(window, arguments);
    };
  }
}

function lookupGlobalIdentifier (name) {
  if (typeof global !== 'undefined' && global[name] !== undefined) {
    return function () {
      return global[name].apply(global, arguments);
    };
  }
}

function throwUnableToResolve (name) {
  throw new Error('Unable to resolve symbol: ' + name + ' in this context');
}

Array.prototype.map = Array.prototype.map || function (f) {
  var i
    , result = []
    ;

  for (i = 0; i < this.length; ++i) {
    result.push(f(this[i]));
  }

  return result;
};

Array.prototype.find = Array.prototype.find || function (f) {
  var i
    ;

  for (i = 0; i < this.length; ++i) {
    if (f(this[i])) {
      return this[i];
    }
  }
};
