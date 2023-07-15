// Node vs browser behavior
var types = {};
if (typeof module === 'undefined') {
    var exports = types;
}

// General functions

function _obj_type(obj) {
    if      (_symbol_Q(obj)) {   return 'symbol'; }
    else if (_list_Q(obj)) {     return 'list'; }
    else if (_vector_Q(obj)) {   return 'vector'; }
    else if (_hash_map_Q(obj)) { return 'hash-map'; }
    else if (_nil_Q(obj)) {      return 'nil'; }
    else if (_true_Q(obj)) {     return 'true'; }
    else if (_false_Q(obj)) {    return 'false'; }
    else if (_atom_Q(obj)) {     return 'atom'; }
    else {
        switch (typeof(obj)) {
        case 'number':   return 'number';
        case 'function': return 'function';
        case 'string': return obj[0] == '\u029e' ? 'keyword' : 'string';
        default: throw new Error("Unknown type '" + typeof(obj) + "'");
        }
    }
}

function _sequential_Q(lst) { return _list_Q(lst) || _vector_Q(lst); }


function _equal_Q (a, b) {
    var ota = _obj_type(a), otb = _obj_type(b);
    if (!(ota === otb || (_sequential_Q(a) && _sequential_Q(b)))) {
        return false;
    }
    switch (ota) {
    case 'symbol': return a.value === b.value;
    case 'list':
    case 'vector':
        if (a.length !== b.length) { return false; }
        for (var i=0; i<a.length; i++) {
            if (! _equal_Q(a[i], b[i])) { return false; }
        }
        return true;
    case 'hash-map':
        if (Object.keys(a).length !== Object.keys(b).length) { return false; }
        for (var k in a) {
            if (! _equal_Q(a[k], b[k])) { return false; }
        }
        return true;
    default:
        return a === b;
    }
}

function _clone (obj) {
    var new_obj;
    switch (_obj_type(obj)) {
    case 'list':
        new_obj = obj.slice(0);
        break;
    case 'vector':
        new_obj = obj.slice(0);
        new_obj.__isvector__ = true;
        break;
    case 'hash-map':
        new_obj = {};
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) { new_obj[k] = obj[k]; }
        }
        break;
    case 'function':
        new_obj = obj.clone();
        break;
    default:
        throw new Error("clone of non-collection: " + _obj_type(obj));
    }
    Object.defineProperty(new_obj, "__meta__", {
        enumerable: false,
        writable: true
    });
    return new_obj;
}


// Scalars
function _nil_Q(a) { return a === null ? true : false; }
function _true_Q(a) { return a === true ? true : false; }
function _false_Q(a) { return a === false ? true : false; }
function _number_Q(obj) { return typeof obj === 'number'; }
function _string_Q(obj) {
    return typeof obj === 'string' && obj[0] !== '\u029e';
}


// Symbols
function Symbol(name) {
    this.value = name;
    return this;
}
Symbol.prototype.toString = function() { return this.value; }
function _symbol(name) { return new Symbol(name); }
function _symbol_Q(obj) { return obj instanceof Symbol; }


// Keywords
function _keyword(obj) {
    if (typeof obj === 'string' && obj[0] === '\u029e') {
        return obj;
    } else {
        return "\u029e" + obj;
    }
}
function _keyword_Q(obj) {
    return typeof obj === 'string' && obj[0] === '\u029e';
}


// Functions
function _function(Eval, Env, ast, env, params) {
    var fn = function() {
        return Eval(ast, new Env(env, params, arguments));
    };
    fn.__meta__ = null;
    fn.__ast__ = ast;
    fn.__gen_env__ = function(args) { return new Env(env, params, args); };
    fn._ismacro_ = false;
    return fn;
}
function _function_Q(obj) { return typeof obj == "function"; }
Function.prototype.clone = function() {
    var that = this;
    var temp = function () { return that.apply(this, arguments); };
    for( key in this ) {
        temp[key] = this[key];
    }
    return temp;
};
function _fn_Q(obj) { return _function_Q(obj) && !obj._ismacro_; }
function _macro_Q(obj) { return _function_Q(obj) && !!obj._ismacro_; }


// Lists
function _list() { return Array.prototype.slice.call(arguments, 0); }
function _list_Q(obj) { return Array.isArray(obj) && !obj.__isvector__; }


// Vectors
function _vector() {
    var v = Array.prototype.slice.call(arguments, 0);
    v.__isvector__ = true;
    return v;
}
function _vector_Q(obj) { return Array.isArray(obj) && !!obj.__isvector__; }



// Hash Maps
function _hash_map() {
    if (arguments.length % 2 === 1) {
        throw new Error("Odd number of hash map arguments");
    }
    var args = [{}].concat(Array.prototype.slice.call(arguments, 0));
    return _assoc_BANG.apply(null, args);
}
function _hash_map_Q(hm) {
    return typeof hm === "object" &&
           !Array.isArray(hm) &&
           !(hm === null) &&
           !(hm instanceof Symbol) &&
           !(hm instanceof Atom);
}
function _assoc_BANG(hm) {
    if (arguments.length % 2 !== 1) {
        throw new Error("Odd number of assoc arguments");
    }
    for (var i=1; i<arguments.length; i+=2) {
        var ktoken = arguments[i],
            vtoken = arguments[i+1];
        if (typeof ktoken !== "string") {
            throw new Error("expected hash-map key string, got: " + (typeof ktoken));
        }
        hm[ktoken] = vtoken;
    }
    return hm;
}
function _dissoc_BANG(hm) {
    for (var i=1; i<arguments.length; i++) {
        var ktoken = arguments[i];
        delete hm[ktoken];
    }
    return hm;
}


// Atoms
function Atom(val) { this.val = val; }
function _atom(val) { return new Atom(val); }
function _atom_Q(atm) { return atm instanceof Atom; }

// Exports
const __obj_type = types._obj_type = _obj_type;
export { __obj_type as _obj_type };
const __sequential_Q = types._sequential_Q = _sequential_Q;
export { __sequential_Q as _sequential_Q };
const __equal_Q = types._equal_Q = _equal_Q;
export { __equal_Q as _equal_Q };
const __clone = types._clone = _clone;
export { __clone as _clone };
const __nil_Q = types._nil_Q = _nil_Q;
export { __nil_Q as _nil_Q };
const __true_Q = types._true_Q = _true_Q;
export { __true_Q as _true_Q };
const __false_Q = types._false_Q = _false_Q;
export { __false_Q as _false_Q };
const __number_Q = types._number_Q = _number_Q;
export { __number_Q as _number_Q };
const __string_Q = types._string_Q = _string_Q;
export { __string_Q as _string_Q };
const __symbol = types._symbol = _symbol;
export { __symbol as _symbol };
const __symbol_Q = types._symbol_Q = _symbol_Q;
export { __symbol_Q as _symbol_Q };
const __keyword = types._keyword = _keyword;
export { __keyword as _keyword };
const __keyword_Q = types._keyword_Q = _keyword_Q;
export { __keyword_Q as _keyword_Q };
const __function = types._function = _function;
export { __function as _function };
const __function_Q = types._function_Q = _function_Q;
export { __function_Q as _function_Q };
const __fn_Q = types._fn_Q = _fn_Q;
export { __fn_Q as _fn_Q };
const __macro_Q = types._macro_Q = _macro_Q;
export { __macro_Q as _macro_Q };
const __list = types._list = _list;
export { __list as _list };
const __list_Q = types._list_Q = _list_Q;
export { __list_Q as _list_Q };
const __vector = types._vector = _vector;
export { __vector as _vector };
const __vector_Q = types._vector_Q = _vector_Q;
export { __vector_Q as _vector_Q };
const __hash_map = types._hash_map = _hash_map;
export { __hash_map as _hash_map };
const __hash_map_Q = types._hash_map_Q = _hash_map_Q;
export { __hash_map_Q as _hash_map_Q };
const __assoc_BANG = types._assoc_BANG = _assoc_BANG;
export { __assoc_BANG as _assoc_BANG };
const __dissoc_BANG = types._dissoc_BANG = _dissoc_BANG;
export { __dissoc_BANG as _dissoc_BANG };
const __atom = types._atom = _atom;
export { __atom as _atom };
const __atom_Q = types._atom_Q = _atom_Q;
export { __atom_Q as _atom_Q };