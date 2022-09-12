/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/event-lite/event-lite.js":
/*!***********************************************!*\
  !*** ./node_modules/event-lite/event-lite.js ***!
  \***********************************************/
/***/ ((module) => {

/**
 * event-lite.js - Light-weight EventEmitter (less than 1KB when gzipped)
 *
 * @copyright Yusuke Kawasaki
 * @license MIT
 * @constructor
 * @see https://github.com/kawanet/event-lite
 * @see http://kawanet.github.io/event-lite/EventLite.html
 * @example
 * var EventLite = require("event-lite");
 *
 * function MyClass() {...}             // your class
 *
 * EventLite.mixin(MyClass.prototype);  // import event methods
 *
 * var obj = new MyClass();
 * obj.on("foo", function() {...});     // add event listener
 * obj.once("bar", function() {...});   // add one-time event listener
 * obj.emit("foo");                     // dispatch event
 * obj.emit("bar");                     // dispatch another event
 * obj.off("foo");                      // remove event listener
 */

function EventLite() {
  if (!(this instanceof EventLite)) return new EventLite();
}

(function(EventLite) {
  // export the class for node.js
  if (true) module.exports = EventLite;

  // property name to hold listeners
  var LISTENERS = "listeners";

  // methods to export
  var methods = {
    on: on,
    once: once,
    off: off,
    emit: emit
  };

  // mixin to self
  mixin(EventLite.prototype);

  // export mixin function
  EventLite.mixin = mixin;

  /**
   * Import on(), once(), off() and emit() methods into target object.
   *
   * @function EventLite.mixin
   * @param target {Prototype}
   */

  function mixin(target) {
    for (var key in methods) {
      target[key] = methods[key];
    }
    return target;
  }

  /**
   * Add an event listener.
   *
   * @function EventLite.prototype.on
   * @param type {string}
   * @param func {Function}
   * @returns {EventLite} Self for method chaining
   */

  function on(type, func) {
    getListeners(this, type).push(func);
    return this;
  }

  /**
   * Add one-time event listener.
   *
   * @function EventLite.prototype.once
   * @param type {string}
   * @param func {Function}
   * @returns {EventLite} Self for method chaining
   */

  function once(type, func) {
    var that = this;
    wrap.originalListener = func;
    getListeners(that, type).push(wrap);
    return that;

    function wrap() {
      off.call(that, type, wrap);
      func.apply(this, arguments);
    }
  }

  /**
   * Remove an event listener.
   *
   * @function EventLite.prototype.off
   * @param [type] {string}
   * @param [func] {Function}
   * @returns {EventLite} Self for method chaining
   */

  function off(type, func) {
    var that = this;
    var listners;
    if (!arguments.length) {
      delete that[LISTENERS];
    } else if (!func) {
      listners = that[LISTENERS];
      if (listners) {
        delete listners[type];
        if (!Object.keys(listners).length) return off.call(that);
      }
    } else {
      listners = getListeners(that, type, true);
      if (listners) {
        listners = listners.filter(ne);
        if (!listners.length) return off.call(that, type);
        that[LISTENERS][type] = listners;
      }
    }
    return that;

    function ne(test) {
      return test !== func && test.originalListener !== func;
    }
  }

  /**
   * Dispatch (trigger) an event.
   *
   * @function EventLite.prototype.emit
   * @param type {string}
   * @param [value] {*}
   * @returns {boolean} True when a listener received the event
   */

  function emit(type, value) {
    var that = this;
    var listeners = getListeners(that, type, true);
    if (!listeners) return false;
    var arglen = arguments.length;
    if (arglen === 1) {
      listeners.forEach(zeroarg);
    } else if (arglen === 2) {
      listeners.forEach(onearg);
    } else {
      var args = Array.prototype.slice.call(arguments, 1);
      listeners.forEach(moreargs);
    }
    return !!listeners.length;

    function zeroarg(func) {
      func.call(that);
    }

    function onearg(func) {
      func.call(that, value);
    }

    function moreargs(func) {
      func.apply(that, args);
    }
  }

  /**
   * @ignore
   */

  function getListeners(that, type, readonly) {
    if (readonly && !that[LISTENERS]) return;
    var listeners = that[LISTENERS] || (that[LISTENERS] = {});
    return listeners[type] || (listeners[type] = []);
  }

})(EventLite);


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/int64-buffer/int64-buffer.js":
/*!***************************************************!*\
  !*** ./node_modules/int64-buffer/int64-buffer.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports) {

// int64-buffer.js

/*jshint -W018 */ // Confusing use of '!'.
/*jshint -W030 */ // Expected an assignment or function call and instead saw an expression.
/*jshint -W093 */ // Did you mean to return a conditional instead of an assignment?

var Uint64BE, Int64BE, Uint64LE, Int64LE;

!function(exports) {
  // constants

  var UNDEFINED = "undefined";
  var BUFFER = (UNDEFINED !== typeof Buffer) && Buffer;
  var UINT8ARRAY = (UNDEFINED !== typeof Uint8Array) && Uint8Array;
  var ARRAYBUFFER = (UNDEFINED !== typeof ArrayBuffer) && ArrayBuffer;
  var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
  var isArray = Array.isArray || _isArray;
  var BIT32 = 4294967296;
  var BIT24 = 16777216;

  // storage class

  var storage; // Array;

  // generate classes

  Uint64BE = factory("Uint64BE", true, true);
  Int64BE = factory("Int64BE", true, false);
  Uint64LE = factory("Uint64LE", false, true);
  Int64LE = factory("Int64LE", false, false);

  // class factory

  function factory(name, bigendian, unsigned) {
    var posH = bigendian ? 0 : 4;
    var posL = bigendian ? 4 : 0;
    var pos0 = bigendian ? 0 : 3;
    var pos1 = bigendian ? 1 : 2;
    var pos2 = bigendian ? 2 : 1;
    var pos3 = bigendian ? 3 : 0;
    var fromPositive = bigendian ? fromPositiveBE : fromPositiveLE;
    var fromNegative = bigendian ? fromNegativeBE : fromNegativeLE;
    var proto = Int64.prototype;
    var isName = "is" + name;
    var _isInt64 = "_" + isName;

    // properties
    proto.buffer = void 0;
    proto.offset = 0;
    proto[_isInt64] = true;

    // methods
    proto.toNumber = toNumber;
    proto.toString = toString;
    proto.toJSON = toNumber;
    proto.toArray = toArray;

    // add .toBuffer() method only when Buffer available
    if (BUFFER) proto.toBuffer = toBuffer;

    // add .toArrayBuffer() method only when Uint8Array available
    if (UINT8ARRAY) proto.toArrayBuffer = toArrayBuffer;

    // isUint64BE, isInt64BE
    Int64[isName] = isInt64;

    // CommonJS
    exports[name] = Int64;

    return Int64;

    // constructor
    function Int64(buffer, offset, value, raddix) {
      if (!(this instanceof Int64)) return new Int64(buffer, offset, value, raddix);
      return init(this, buffer, offset, value, raddix);
    }

    // isUint64BE, isInt64BE
    function isInt64(b) {
      return !!(b && b[_isInt64]);
    }

    // initializer
    function init(that, buffer, offset, value, raddix) {
      if (UINT8ARRAY && ARRAYBUFFER) {
        if (buffer instanceof ARRAYBUFFER) buffer = new UINT8ARRAY(buffer);
        if (value instanceof ARRAYBUFFER) value = new UINT8ARRAY(value);
      }

      // Int64BE() style
      if (!buffer && !offset && !value && !storage) {
        // shortcut to initialize with zero
        that.buffer = newArray(ZERO, 0);
        return;
      }

      // Int64BE(value, raddix) style
      if (!isValidBuffer(buffer, offset)) {
        var _storage = storage || Array;
        raddix = offset;
        value = buffer;
        offset = 0;
        buffer = new _storage(8);
      }

      that.buffer = buffer;
      that.offset = offset |= 0;

      // Int64BE(buffer, offset) style
      if (UNDEFINED === typeof value) return;

      // Int64BE(buffer, offset, value, raddix) style
      if ("string" === typeof value) {
        fromString(buffer, offset, value, raddix || 10);
      } else if (isValidBuffer(value, raddix)) {
        fromArray(buffer, offset, value, raddix);
      } else if ("number" === typeof raddix) {
        writeInt32(buffer, offset + posH, value); // high
        writeInt32(buffer, offset + posL, raddix); // low
      } else if (value > 0) {
        fromPositive(buffer, offset, value); // positive
      } else if (value < 0) {
        fromNegative(buffer, offset, value); // negative
      } else {
        fromArray(buffer, offset, ZERO, 0); // zero, NaN and others
      }
    }

    function fromString(buffer, offset, str, raddix) {
      var pos = 0;
      var len = str.length;
      var high = 0;
      var low = 0;
      if (str[0] === "-") pos++;
      var sign = pos;
      while (pos < len) {
        var chr = parseInt(str[pos++], raddix);
        if (!(chr >= 0)) break; // NaN
        low = low * raddix + chr;
        high = high * raddix + Math.floor(low / BIT32);
        low %= BIT32;
      }
      if (sign) {
        high = ~high;
        if (low) {
          low = BIT32 - low;
        } else {
          high++;
        }
      }
      writeInt32(buffer, offset + posH, high);
      writeInt32(buffer, offset + posL, low);
    }

    function toNumber() {
      var buffer = this.buffer;
      var offset = this.offset;
      var high = readInt32(buffer, offset + posH);
      var low = readInt32(buffer, offset + posL);
      if (!unsigned) high |= 0; // a trick to get signed
      return high ? (high * BIT32 + low) : low;
    }

    function toString(radix) {
      var buffer = this.buffer;
      var offset = this.offset;
      var high = readInt32(buffer, offset + posH);
      var low = readInt32(buffer, offset + posL);
      var str = "";
      var sign = !unsigned && (high & 0x80000000);
      if (sign) {
        high = ~high;
        low = BIT32 - low;
      }
      radix = radix || 10;
      while (1) {
        var mod = (high % radix) * BIT32 + low;
        high = Math.floor(high / radix);
        low = Math.floor(mod / radix);
        str = (mod % radix).toString(radix) + str;
        if (!high && !low) break;
      }
      if (sign) {
        str = "-" + str;
      }
      return str;
    }

    function writeInt32(buffer, offset, value) {
      buffer[offset + pos3] = value & 255;
      value = value >> 8;
      buffer[offset + pos2] = value & 255;
      value = value >> 8;
      buffer[offset + pos1] = value & 255;
      value = value >> 8;
      buffer[offset + pos0] = value & 255;
    }

    function readInt32(buffer, offset) {
      return (buffer[offset + pos0] * BIT24) +
        (buffer[offset + pos1] << 16) +
        (buffer[offset + pos2] << 8) +
        buffer[offset + pos3];
    }
  }

  function toArray(raw) {
    var buffer = this.buffer;
    var offset = this.offset;
    storage = null; // Array
    if (raw !== false && offset === 0 && buffer.length === 8 && isArray(buffer)) return buffer;
    return newArray(buffer, offset);
  }

  function toBuffer(raw) {
    var buffer = this.buffer;
    var offset = this.offset;
    storage = BUFFER;
    if (raw !== false && offset === 0 && buffer.length === 8 && Buffer.isBuffer(buffer)) return buffer;
    var dest = new BUFFER(8);
    fromArray(dest, 0, buffer, offset);
    return dest;
  }

  function toArrayBuffer(raw) {
    var buffer = this.buffer;
    var offset = this.offset;
    var arrbuf = buffer.buffer;
    storage = UINT8ARRAY;
    if (raw !== false && offset === 0 && (arrbuf instanceof ARRAYBUFFER) && arrbuf.byteLength === 8) return arrbuf;
    var dest = new UINT8ARRAY(8);
    fromArray(dest, 0, buffer, offset);
    return dest.buffer;
  }

  function isValidBuffer(buffer, offset) {
    var len = buffer && buffer.length;
    offset |= 0;
    return len && (offset + 8 <= len) && ("string" !== typeof buffer[offset]);
  }

  function fromArray(destbuf, destoff, srcbuf, srcoff) {
    destoff |= 0;
    srcoff |= 0;
    for (var i = 0; i < 8; i++) {
      destbuf[destoff++] = srcbuf[srcoff++] & 255;
    }
  }

  function newArray(buffer, offset) {
    return Array.prototype.slice.call(buffer, offset, offset + 8);
  }

  function fromPositiveBE(buffer, offset, value) {
    var pos = offset + 8;
    while (pos > offset) {
      buffer[--pos] = value & 255;
      value /= 256;
    }
  }

  function fromNegativeBE(buffer, offset, value) {
    var pos = offset + 8;
    value++;
    while (pos > offset) {
      buffer[--pos] = ((-value) & 255) ^ 255;
      value /= 256;
    }
  }

  function fromPositiveLE(buffer, offset, value) {
    var end = offset + 8;
    while (offset < end) {
      buffer[offset++] = value & 255;
      value /= 256;
    }
  }

  function fromNegativeLE(buffer, offset, value) {
    var end = offset + 8;
    value++;
    while (offset < end) {
      buffer[offset++] = ((-value) & 255) ^ 255;
      value /= 256;
    }
  }

  // https://github.com/retrofox/is-array
  function _isArray(val) {
    return !!val && "[object Array]" == Object.prototype.toString.call(val);
  }

}( true && typeof exports.nodeName !== 'string' ? exports : (this || {}));


/***/ }),

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/***/ ((module) => {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/browser.js":
/*!**************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/browser.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// browser.js

exports.encode = __webpack_require__(/*! ./encode */ "./node_modules/msgpack-lite/lib/encode.js").encode;
exports.decode = __webpack_require__(/*! ./decode */ "./node_modules/msgpack-lite/lib/decode.js").decode;

exports.Encoder = __webpack_require__(/*! ./encoder */ "./node_modules/msgpack-lite/lib/encoder.js").Encoder;
exports.Decoder = __webpack_require__(/*! ./decoder */ "./node_modules/msgpack-lite/lib/decoder.js").Decoder;

exports.createCodec = __webpack_require__(/*! ./ext */ "./node_modules/msgpack-lite/lib/ext.js").createCodec;
exports.codec = __webpack_require__(/*! ./codec */ "./node_modules/msgpack-lite/lib/codec.js").codec;


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/buffer-global.js":
/*!********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/buffer-global.js ***!
  \********************************************************/
/***/ (function(module) {

/* globals Buffer */

module.exports =
  c(("undefined" !== typeof Buffer) && Buffer) ||
  c(this.Buffer) ||
  c(("undefined" !== typeof window) && window.Buffer) ||
  this.Buffer;

function c(B) {
  return B && B.isBuffer && B;
}

/***/ }),

/***/ "./node_modules/msgpack-lite/lib/buffer-lite.js":
/*!******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/buffer-lite.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

// buffer-lite.js

var MAXBUFLEN = 8192;

exports.copy = copy;
exports.toString = toString;
exports.write = write;

/**
 * Buffer.prototype.write()
 *
 * @param string {String}
 * @param [offset] {Number}
 * @returns {Number}
 */

function write(string, offset) {
  var buffer = this;
  var index = offset || (offset |= 0);
  var length = string.length;
  var chr = 0;
  var i = 0;
  while (i < length) {
    chr = string.charCodeAt(i++);

    if (chr < 128) {
      buffer[index++] = chr;
    } else if (chr < 0x800) {
      // 2 bytes
      buffer[index++] = 0xC0 | (chr >>> 6);
      buffer[index++] = 0x80 | (chr & 0x3F);
    } else if (chr < 0xD800 || chr > 0xDFFF) {
      // 3 bytes
      buffer[index++] = 0xE0 | (chr  >>> 12);
      buffer[index++] = 0x80 | ((chr >>> 6)  & 0x3F);
      buffer[index++] = 0x80 | (chr          & 0x3F);
    } else {
      // 4 bytes - surrogate pair
      chr = (((chr - 0xD800) << 10) | (string.charCodeAt(i++) - 0xDC00)) + 0x10000;
      buffer[index++] = 0xF0 | (chr >>> 18);
      buffer[index++] = 0x80 | ((chr >>> 12) & 0x3F);
      buffer[index++] = 0x80 | ((chr >>> 6)  & 0x3F);
      buffer[index++] = 0x80 | (chr          & 0x3F);
    }
  }
  return index - offset;
}

/**
 * Buffer.prototype.toString()
 *
 * @param [encoding] {String} ignored
 * @param [start] {Number}
 * @param [end] {Number}
 * @returns {String}
 */

function toString(encoding, start, end) {
  var buffer = this;
  var index = start|0;
  if (!end) end = buffer.length;
  var string = '';
  var chr = 0;

  while (index < end) {
    chr = buffer[index++];
    if (chr < 128) {
      string += String.fromCharCode(chr);
      continue;
    }

    if ((chr & 0xE0) === 0xC0) {
      // 2 bytes
      chr = (chr & 0x1F) << 6 |
            (buffer[index++] & 0x3F);

    } else if ((chr & 0xF0) === 0xE0) {
      // 3 bytes
      chr = (chr & 0x0F)             << 12 |
            (buffer[index++] & 0x3F) << 6  |
            (buffer[index++] & 0x3F);

    } else if ((chr & 0xF8) === 0xF0) {
      // 4 bytes
      chr = (chr & 0x07)             << 18 |
            (buffer[index++] & 0x3F) << 12 |
            (buffer[index++] & 0x3F) << 6  |
            (buffer[index++] & 0x3F);
    }

    if (chr >= 0x010000) {
      // A surrogate pair
      chr -= 0x010000;

      string += String.fromCharCode((chr >>> 10) + 0xD800, (chr & 0x3FF) + 0xDC00);
    } else {
      string += String.fromCharCode(chr);
    }
  }

  return string;
}

/**
 * Buffer.prototype.copy()
 *
 * @param target {Buffer}
 * @param [targetStart] {Number}
 * @param [start] {Number}
 * @param [end] {Number}
 * @returns {number}
 */

function copy(target, targetStart, start, end) {
  var i;
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (!targetStart) targetStart = 0;
  var len = end - start;

  if (target === this && start < targetStart && targetStart < end) {
    // descending
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    // ascending
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start];
    }
  }

  return len;
}


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/bufferish-array.js":
/*!**********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/bufferish-array.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// bufferish-array.js

var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");

var exports = module.exports = alloc(0);

exports.alloc = alloc;
exports.concat = Bufferish.concat;
exports.from = from;

/**
 * @param size {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

function alloc(size) {
  return new Array(size);
}

/**
 * @param value {Array|ArrayBuffer|Buffer|String}
 * @returns {Array}
 */

function from(value) {
  if (!Bufferish.isBuffer(value) && Bufferish.isView(value)) {
    // TypedArray to Uint8Array
    value = Bufferish.Uint8Array.from(value);
  } else if (Bufferish.isArrayBuffer(value)) {
    // ArrayBuffer to Uint8Array
    value = new Uint8Array(value);
  } else if (typeof value === "string") {
    // String to Array
    return Bufferish.from.call(exports, value);
  } else if (typeof value === "number") {
    throw new TypeError('"value" argument must not be a number');
  }

  // Array-like to Array
  return Array.prototype.slice.call(value);
}


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/bufferish-buffer.js":
/*!***********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/bufferish-buffer.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// bufferish-buffer.js

var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");
var Buffer = Bufferish.global;

var exports = module.exports = Bufferish.hasBuffer ? alloc(0) : [];

exports.alloc = Bufferish.hasBuffer && Buffer.alloc || alloc;
exports.concat = Bufferish.concat;
exports.from = from;

/**
 * @param size {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

function alloc(size) {
  return new Buffer(size);
}

/**
 * @param value {Array|ArrayBuffer|Buffer|String}
 * @returns {Buffer}
 */

function from(value) {
  if (!Bufferish.isBuffer(value) && Bufferish.isView(value)) {
    // TypedArray to Uint8Array
    value = Bufferish.Uint8Array.from(value);
  } else if (Bufferish.isArrayBuffer(value)) {
    // ArrayBuffer to Uint8Array
    value = new Uint8Array(value);
  } else if (typeof value === "string") {
    // String to Buffer
    return Bufferish.from.call(exports, value);
  } else if (typeof value === "number") {
    throw new TypeError('"value" argument must not be a number');
  }

  // Array-like to Buffer
  if (Buffer.from && Buffer.from.length !== 1) {
    return Buffer.from(value); // node v6+
  } else {
    return new Buffer(value); // node v4
  }
}


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/bufferish-proto.js":
/*!**********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/bufferish-proto.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// bufferish-proto.js

/* jshint eqnull:true */

var BufferLite = __webpack_require__(/*! ./buffer-lite */ "./node_modules/msgpack-lite/lib/buffer-lite.js");

exports.copy = copy;
exports.slice = slice;
exports.toString = toString;
exports.write = gen("write");

var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");
var Buffer = Bufferish.global;

var isBufferShim = Bufferish.hasBuffer && ("TYPED_ARRAY_SUPPORT" in Buffer);
var brokenTypedArray = isBufferShim && !Buffer.TYPED_ARRAY_SUPPORT;

/**
 * @param target {Buffer|Uint8Array|Array}
 * @param [targetStart] {Number}
 * @param [start] {Number}
 * @param [end] {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

function copy(target, targetStart, start, end) {
  var thisIsBuffer = Bufferish.isBuffer(this);
  var targetIsBuffer = Bufferish.isBuffer(target);
  if (thisIsBuffer && targetIsBuffer) {
    // Buffer to Buffer
    return this.copy(target, targetStart, start, end);
  } else if (!brokenTypedArray && !thisIsBuffer && !targetIsBuffer &&
    Bufferish.isView(this) && Bufferish.isView(target)) {
    // Uint8Array to Uint8Array (except for minor some browsers)
    var buffer = (start || end != null) ? slice.call(this, start, end) : this;
    target.set(buffer, targetStart);
    return buffer.length;
  } else {
    // other cases
    return BufferLite.copy.call(this, target, targetStart, start, end);
  }
}

/**
 * @param [start] {Number}
 * @param [end] {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

function slice(start, end) {
  // for Buffer, Uint8Array (except for minor some browsers) and Array
  var f = this.slice || (!brokenTypedArray && this.subarray);
  if (f) return f.call(this, start, end);

  // Uint8Array (for minor some browsers)
  var target = Bufferish.alloc.call(this, end - start);
  copy.call(this, target, 0, start, end);
  return target;
}

/**
 * Buffer.prototype.toString()
 *
 * @param [encoding] {String} ignored
 * @param [start] {Number}
 * @param [end] {Number}
 * @returns {String}
 */

function toString(encoding, start, end) {
  var f = (!isBufferShim && Bufferish.isBuffer(this)) ? this.toString : BufferLite.toString;
  return f.apply(this, arguments);
}

/**
 * @private
 */

function gen(method) {
  return wrap;

  function wrap() {
    var f = this[method] || BufferLite[method];
    return f.apply(this, arguments);
  }
}


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/bufferish-uint8array.js":
/*!***************************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/bufferish-uint8array.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// bufferish-uint8array.js

var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");

var exports = module.exports = Bufferish.hasArrayBuffer ? alloc(0) : [];

exports.alloc = alloc;
exports.concat = Bufferish.concat;
exports.from = from;

/**
 * @param size {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

function alloc(size) {
  return new Uint8Array(size);
}

/**
 * @param value {Array|ArrayBuffer|Buffer|String}
 * @returns {Uint8Array}
 */

function from(value) {
  if (Bufferish.isView(value)) {
    // TypedArray to ArrayBuffer
    var byteOffset = value.byteOffset;
    var byteLength = value.byteLength;
    value = value.buffer;
    if (value.byteLength !== byteLength) {
      if (value.slice) {
        value = value.slice(byteOffset, byteOffset + byteLength);
      } else {
        // Android 4.1 does not have ArrayBuffer.prototype.slice
        value = new Uint8Array(value);
        if (value.byteLength !== byteLength) {
          // TypedArray to ArrayBuffer to Uint8Array to Array
          value = Array.prototype.slice.call(value, byteOffset, byteOffset + byteLength);
        }
      }
    }
  } else if (typeof value === "string") {
    // String to Uint8Array
    return Bufferish.from.call(exports, value);
  } else if (typeof value === "number") {
    throw new TypeError('"value" argument must not be a number');
  }

  return new Uint8Array(value);
}


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/bufferish.js":
/*!****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/bufferish.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// bufferish.js

var Buffer = exports.global = __webpack_require__(/*! ./buffer-global */ "./node_modules/msgpack-lite/lib/buffer-global.js");
var hasBuffer = exports.hasBuffer = Buffer && !!Buffer.isBuffer;
var hasArrayBuffer = exports.hasArrayBuffer = ("undefined" !== typeof ArrayBuffer);

var isArray = exports.isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js");
exports.isArrayBuffer = hasArrayBuffer ? isArrayBuffer : _false;
var isBuffer = exports.isBuffer = hasBuffer ? Buffer.isBuffer : _false;
var isView = exports.isView = hasArrayBuffer ? (ArrayBuffer.isView || _is("ArrayBuffer", "buffer")) : _false;

exports.alloc = alloc;
exports.concat = concat;
exports.from = from;

var BufferArray = exports.Array = __webpack_require__(/*! ./bufferish-array */ "./node_modules/msgpack-lite/lib/bufferish-array.js");
var BufferBuffer = exports.Buffer = __webpack_require__(/*! ./bufferish-buffer */ "./node_modules/msgpack-lite/lib/bufferish-buffer.js");
var BufferUint8Array = exports.Uint8Array = __webpack_require__(/*! ./bufferish-uint8array */ "./node_modules/msgpack-lite/lib/bufferish-uint8array.js");
var BufferProto = exports.prototype = __webpack_require__(/*! ./bufferish-proto */ "./node_modules/msgpack-lite/lib/bufferish-proto.js");

/**
 * @param value {Array|ArrayBuffer|Buffer|String}
 * @returns {Buffer|Uint8Array|Array}
 */

function from(value) {
  if (typeof value === "string") {
    return fromString.call(this, value);
  } else {
    return auto(this).from(value);
  }
}

/**
 * @param size {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

function alloc(size) {
  return auto(this).alloc(size);
}

/**
 * @param list {Array} array of (Buffer|Uint8Array|Array)s
 * @param [length]
 * @returns {Buffer|Uint8Array|Array}
 */

function concat(list, length) {
  if (!length) {
    length = 0;
    Array.prototype.forEach.call(list, dryrun);
  }
  var ref = (this !== exports) && this || list[0];
  var result = alloc.call(ref, length);
  var offset = 0;
  Array.prototype.forEach.call(list, append);
  return result;

  function dryrun(buffer) {
    length += buffer.length;
  }

  function append(buffer) {
    offset += BufferProto.copy.call(buffer, result, offset);
  }
}

var _isArrayBuffer = _is("ArrayBuffer");

function isArrayBuffer(value) {
  return (value instanceof ArrayBuffer) || _isArrayBuffer(value);
}

/**
 * @private
 */

function fromString(value) {
  var expected = value.length * 3;
  var that = alloc.call(this, expected);
  var actual = BufferProto.write.call(that, value);
  if (expected !== actual) {
    that = BufferProto.slice.call(that, 0, actual);
  }
  return that;
}

function auto(that) {
  return isBuffer(that) ? BufferBuffer
    : isView(that) ? BufferUint8Array
    : isArray(that) ? BufferArray
    : hasBuffer ? BufferBuffer
    : hasArrayBuffer ? BufferUint8Array
    : BufferArray;
}

function _false() {
  return false;
}

function _is(name, key) {
  /* jshint eqnull:true */
  name = "[object " + name + "]";
  return function(value) {
    return (value != null) && {}.toString.call(key ? value[key] : value) === name;
  };
}

/***/ }),

/***/ "./node_modules/msgpack-lite/lib/codec-base.js":
/*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/codec-base.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// codec-base.js

var IS_ARRAY = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js");

exports.createCodec = createCodec;
exports.install = install;
exports.filter = filter;

var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");

function Codec(options) {
  if (!(this instanceof Codec)) return new Codec(options);
  this.options = options;
  this.init();
}

Codec.prototype.init = function() {
  var options = this.options;

  if (options && options.uint8array) {
    this.bufferish = Bufferish.Uint8Array;
  }

  return this;
};

function install(props) {
  for (var key in props) {
    Codec.prototype[key] = add(Codec.prototype[key], props[key]);
  }
}

function add(a, b) {
  return (a && b) ? ab : (a || b);

  function ab() {
    a.apply(this, arguments);
    return b.apply(this, arguments);
  }
}

function join(filters) {
  filters = filters.slice();

  return function(value) {
    return filters.reduce(iterator, value);
  };

  function iterator(value, filter) {
    return filter(value);
  }
}

function filter(filter) {
  return IS_ARRAY(filter) ? join(filter) : filter;
}

// @public
// msgpack.createCodec()

function createCodec(options) {
  return new Codec(options);
}

// default shared codec

exports.preset = createCodec({preset: true});


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/codec.js":
/*!************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/codec.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// codec.js

// load both interfaces
__webpack_require__(/*! ./read-core */ "./node_modules/msgpack-lite/lib/read-core.js");
__webpack_require__(/*! ./write-core */ "./node_modules/msgpack-lite/lib/write-core.js");

// @public
// msgpack.codec.preset

exports.codec = {
  preset: __webpack_require__(/*! ./codec-base */ "./node_modules/msgpack-lite/lib/codec-base.js").preset
};


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/decode-buffer.js":
/*!********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/decode-buffer.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// decode-buffer.js

exports.DecodeBuffer = DecodeBuffer;

var preset = __webpack_require__(/*! ./read-core */ "./node_modules/msgpack-lite/lib/read-core.js").preset;

var FlexDecoder = __webpack_require__(/*! ./flex-buffer */ "./node_modules/msgpack-lite/lib/flex-buffer.js").FlexDecoder;

FlexDecoder.mixin(DecodeBuffer.prototype);

function DecodeBuffer(options) {
  if (!(this instanceof DecodeBuffer)) return new DecodeBuffer(options);

  if (options) {
    this.options = options;
    if (options.codec) {
      var codec = this.codec = options.codec;
      if (codec.bufferish) this.bufferish = codec.bufferish;
    }
  }
}

DecodeBuffer.prototype.codec = preset;

DecodeBuffer.prototype.fetch = function() {
  return this.codec.decode(this);
};


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/decode.js":
/*!*************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/decode.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// decode.js

exports.decode = decode;

var DecodeBuffer = __webpack_require__(/*! ./decode-buffer */ "./node_modules/msgpack-lite/lib/decode-buffer.js").DecodeBuffer;

function decode(input, options) {
  var decoder = new DecodeBuffer(options);
  decoder.write(input);
  return decoder.read();
}

/***/ }),

/***/ "./node_modules/msgpack-lite/lib/decoder.js":
/*!**************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/decoder.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// decoder.js

exports.Decoder = Decoder;

var EventLite = __webpack_require__(/*! event-lite */ "./node_modules/event-lite/event-lite.js");
var DecodeBuffer = __webpack_require__(/*! ./decode-buffer */ "./node_modules/msgpack-lite/lib/decode-buffer.js").DecodeBuffer;

function Decoder(options) {
  if (!(this instanceof Decoder)) return new Decoder(options);
  DecodeBuffer.call(this, options);
}

Decoder.prototype = new DecodeBuffer();

EventLite.mixin(Decoder.prototype);

Decoder.prototype.decode = function(chunk) {
  if (arguments.length) this.write(chunk);
  this.flush();
};

Decoder.prototype.push = function(chunk) {
  this.emit("data", chunk);
};

Decoder.prototype.end = function(chunk) {
  this.decode(chunk);
  this.emit("end");
};


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/encode-buffer.js":
/*!********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/encode-buffer.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// encode-buffer.js

exports.EncodeBuffer = EncodeBuffer;

var preset = __webpack_require__(/*! ./write-core */ "./node_modules/msgpack-lite/lib/write-core.js").preset;

var FlexEncoder = __webpack_require__(/*! ./flex-buffer */ "./node_modules/msgpack-lite/lib/flex-buffer.js").FlexEncoder;

FlexEncoder.mixin(EncodeBuffer.prototype);

function EncodeBuffer(options) {
  if (!(this instanceof EncodeBuffer)) return new EncodeBuffer(options);

  if (options) {
    this.options = options;
    if (options.codec) {
      var codec = this.codec = options.codec;
      if (codec.bufferish) this.bufferish = codec.bufferish;
    }
  }
}

EncodeBuffer.prototype.codec = preset;

EncodeBuffer.prototype.write = function(input) {
  this.codec.encode(this, input);
};


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/encode.js":
/*!*************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/encode.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// encode.js

exports.encode = encode;

var EncodeBuffer = __webpack_require__(/*! ./encode-buffer */ "./node_modules/msgpack-lite/lib/encode-buffer.js").EncodeBuffer;

function encode(input, options) {
  var encoder = new EncodeBuffer(options);
  encoder.write(input);
  return encoder.read();
}


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/encoder.js":
/*!**************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/encoder.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// encoder.js

exports.Encoder = Encoder;

var EventLite = __webpack_require__(/*! event-lite */ "./node_modules/event-lite/event-lite.js");
var EncodeBuffer = __webpack_require__(/*! ./encode-buffer */ "./node_modules/msgpack-lite/lib/encode-buffer.js").EncodeBuffer;

function Encoder(options) {
  if (!(this instanceof Encoder)) return new Encoder(options);
  EncodeBuffer.call(this, options);
}

Encoder.prototype = new EncodeBuffer();

EventLite.mixin(Encoder.prototype);

Encoder.prototype.encode = function(chunk) {
  this.write(chunk);
  this.emit("data", this.read());
};

Encoder.prototype.end = function(chunk) {
  if (arguments.length) this.encode(chunk);
  this.flush();
  this.emit("end");
};


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/ext-buffer.js":
/*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/ext-buffer.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// ext-buffer.js

exports.ExtBuffer = ExtBuffer;

var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");

function ExtBuffer(buffer, type) {
  if (!(this instanceof ExtBuffer)) return new ExtBuffer(buffer, type);
  this.buffer = Bufferish.from(buffer);
  this.type = type;
}


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/ext-packer.js":
/*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/ext-packer.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// ext-packer.js

exports.setExtPackers = setExtPackers;

var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");
var Buffer = Bufferish.global;
var packTypedArray = Bufferish.Uint8Array.from;
var _encode;

var ERROR_COLUMNS = {name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1};

function setExtPackers(codec) {
  codec.addExtPacker(0x0E, Error, [packError, encode]);
  codec.addExtPacker(0x01, EvalError, [packError, encode]);
  codec.addExtPacker(0x02, RangeError, [packError, encode]);
  codec.addExtPacker(0x03, ReferenceError, [packError, encode]);
  codec.addExtPacker(0x04, SyntaxError, [packError, encode]);
  codec.addExtPacker(0x05, TypeError, [packError, encode]);
  codec.addExtPacker(0x06, URIError, [packError, encode]);

  codec.addExtPacker(0x0A, RegExp, [packRegExp, encode]);
  codec.addExtPacker(0x0B, Boolean, [packValueOf, encode]);
  codec.addExtPacker(0x0C, String, [packValueOf, encode]);
  codec.addExtPacker(0x0D, Date, [Number, encode]);
  codec.addExtPacker(0x0F, Number, [packValueOf, encode]);

  if ("undefined" !== typeof Uint8Array) {
    codec.addExtPacker(0x11, Int8Array, packTypedArray);
    codec.addExtPacker(0x12, Uint8Array, packTypedArray);
    codec.addExtPacker(0x13, Int16Array, packTypedArray);
    codec.addExtPacker(0x14, Uint16Array, packTypedArray);
    codec.addExtPacker(0x15, Int32Array, packTypedArray);
    codec.addExtPacker(0x16, Uint32Array, packTypedArray);
    codec.addExtPacker(0x17, Float32Array, packTypedArray);

    // PhantomJS/1.9.7 doesn't have Float64Array
    if ("undefined" !== typeof Float64Array) {
      codec.addExtPacker(0x18, Float64Array, packTypedArray);
    }

    // IE10 doesn't have Uint8ClampedArray
    if ("undefined" !== typeof Uint8ClampedArray) {
      codec.addExtPacker(0x19, Uint8ClampedArray, packTypedArray);
    }

    codec.addExtPacker(0x1A, ArrayBuffer, packTypedArray);
    codec.addExtPacker(0x1D, DataView, packTypedArray);
  }

  if (Bufferish.hasBuffer) {
    codec.addExtPacker(0x1B, Buffer, Bufferish.from);
  }
}

function encode(input) {
  if (!_encode) _encode = __webpack_require__(/*! ./encode */ "./node_modules/msgpack-lite/lib/encode.js").encode; // lazy load
  return _encode(input);
}

function packValueOf(value) {
  return (value).valueOf();
}

function packRegExp(value) {
  value = RegExp.prototype.toString.call(value).split("/");
  value.shift();
  var out = [value.pop()];
  out.unshift(value.join("/"));
  return out;
}

function packError(value) {
  var out = {};
  for (var key in ERROR_COLUMNS) {
    out[key] = value[key];
  }
  return out;
}


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/ext-unpacker.js":
/*!*******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/ext-unpacker.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// ext-unpacker.js

exports.setExtUnpackers = setExtUnpackers;

var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");
var Buffer = Bufferish.global;
var _decode;

var ERROR_COLUMNS = {name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1};

function setExtUnpackers(codec) {
  codec.addExtUnpacker(0x0E, [decode, unpackError(Error)]);
  codec.addExtUnpacker(0x01, [decode, unpackError(EvalError)]);
  codec.addExtUnpacker(0x02, [decode, unpackError(RangeError)]);
  codec.addExtUnpacker(0x03, [decode, unpackError(ReferenceError)]);
  codec.addExtUnpacker(0x04, [decode, unpackError(SyntaxError)]);
  codec.addExtUnpacker(0x05, [decode, unpackError(TypeError)]);
  codec.addExtUnpacker(0x06, [decode, unpackError(URIError)]);

  codec.addExtUnpacker(0x0A, [decode, unpackRegExp]);
  codec.addExtUnpacker(0x0B, [decode, unpackClass(Boolean)]);
  codec.addExtUnpacker(0x0C, [decode, unpackClass(String)]);
  codec.addExtUnpacker(0x0D, [decode, unpackClass(Date)]);
  codec.addExtUnpacker(0x0F, [decode, unpackClass(Number)]);

  if ("undefined" !== typeof Uint8Array) {
    codec.addExtUnpacker(0x11, unpackClass(Int8Array));
    codec.addExtUnpacker(0x12, unpackClass(Uint8Array));
    codec.addExtUnpacker(0x13, [unpackArrayBuffer, unpackClass(Int16Array)]);
    codec.addExtUnpacker(0x14, [unpackArrayBuffer, unpackClass(Uint16Array)]);
    codec.addExtUnpacker(0x15, [unpackArrayBuffer, unpackClass(Int32Array)]);
    codec.addExtUnpacker(0x16, [unpackArrayBuffer, unpackClass(Uint32Array)]);
    codec.addExtUnpacker(0x17, [unpackArrayBuffer, unpackClass(Float32Array)]);

    // PhantomJS/1.9.7 doesn't have Float64Array
    if ("undefined" !== typeof Float64Array) {
      codec.addExtUnpacker(0x18, [unpackArrayBuffer, unpackClass(Float64Array)]);
    }

    // IE10 doesn't have Uint8ClampedArray
    if ("undefined" !== typeof Uint8ClampedArray) {
      codec.addExtUnpacker(0x19, unpackClass(Uint8ClampedArray));
    }

    codec.addExtUnpacker(0x1A, unpackArrayBuffer);
    codec.addExtUnpacker(0x1D, [unpackArrayBuffer, unpackClass(DataView)]);
  }

  if (Bufferish.hasBuffer) {
    codec.addExtUnpacker(0x1B, unpackClass(Buffer));
  }
}

function decode(input) {
  if (!_decode) _decode = __webpack_require__(/*! ./decode */ "./node_modules/msgpack-lite/lib/decode.js").decode; // lazy load
  return _decode(input);
}

function unpackRegExp(value) {
  return RegExp.apply(null, value);
}

function unpackError(Class) {
  return function(value) {
    var out = new Class();
    for (var key in ERROR_COLUMNS) {
      out[key] = value[key];
    }
    return out;
  };
}

function unpackClass(Class) {
  return function(value) {
    return new Class(value);
  };
}

function unpackArrayBuffer(value) {
  return (new Uint8Array(value)).buffer;
}


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/ext.js":
/*!**********************************************!*\
  !*** ./node_modules/msgpack-lite/lib/ext.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// ext.js

// load both interfaces
__webpack_require__(/*! ./read-core */ "./node_modules/msgpack-lite/lib/read-core.js");
__webpack_require__(/*! ./write-core */ "./node_modules/msgpack-lite/lib/write-core.js");

exports.createCodec = __webpack_require__(/*! ./codec-base */ "./node_modules/msgpack-lite/lib/codec-base.js").createCodec;


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/flex-buffer.js":
/*!******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/flex-buffer.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// flex-buffer.js

exports.FlexDecoder = FlexDecoder;
exports.FlexEncoder = FlexEncoder;

var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");

var MIN_BUFFER_SIZE = 2048;
var MAX_BUFFER_SIZE = 65536;
var BUFFER_SHORTAGE = "BUFFER_SHORTAGE";

function FlexDecoder() {
  if (!(this instanceof FlexDecoder)) return new FlexDecoder();
}

function FlexEncoder() {
  if (!(this instanceof FlexEncoder)) return new FlexEncoder();
}

FlexDecoder.mixin = mixinFactory(getDecoderMethods());
FlexDecoder.mixin(FlexDecoder.prototype);

FlexEncoder.mixin = mixinFactory(getEncoderMethods());
FlexEncoder.mixin(FlexEncoder.prototype);

function getDecoderMethods() {
  return {
    bufferish: Bufferish,
    write: write,
    fetch: fetch,
    flush: flush,
    push: push,
    pull: pull,
    read: read,
    reserve: reserve,
    offset: 0
  };

  function write(chunk) {
    var prev = this.offset ? Bufferish.prototype.slice.call(this.buffer, this.offset) : this.buffer;
    this.buffer = prev ? (chunk ? this.bufferish.concat([prev, chunk]) : prev) : chunk;
    this.offset = 0;
  }

  function flush() {
    while (this.offset < this.buffer.length) {
      var start = this.offset;
      var value;
      try {
        value = this.fetch();
      } catch (e) {
        if (e && e.message != BUFFER_SHORTAGE) throw e;
        // rollback
        this.offset = start;
        break;
      }
      this.push(value);
    }
  }

  function reserve(length) {
    var start = this.offset;
    var end = start + length;
    if (end > this.buffer.length) throw new Error(BUFFER_SHORTAGE);
    this.offset = end;
    return start;
  }
}

function getEncoderMethods() {
  return {
    bufferish: Bufferish,
    write: write,
    fetch: fetch,
    flush: flush,
    push: push,
    pull: pull,
    read: read,
    reserve: reserve,
    send: send,
    maxBufferSize: MAX_BUFFER_SIZE,
    minBufferSize: MIN_BUFFER_SIZE,
    offset: 0,
    start: 0
  };

  function fetch() {
    var start = this.start;
    if (start < this.offset) {
      var end = this.start = this.offset;
      return Bufferish.prototype.slice.call(this.buffer, start, end);
    }
  }

  function flush() {
    while (this.start < this.offset) {
      var value = this.fetch();
      if (value) this.push(value);
    }
  }

  function pull() {
    var buffers = this.buffers || (this.buffers = []);
    var chunk = buffers.length > 1 ? this.bufferish.concat(buffers) : buffers[0];
    buffers.length = 0; // buffer exhausted
    return chunk;
  }

  function reserve(length) {
    var req = length | 0;

    if (this.buffer) {
      var size = this.buffer.length;
      var start = this.offset | 0;
      var end = start + req;

      // is it long enough?
      if (end < size) {
        this.offset = end;
        return start;
      }

      // flush current buffer
      this.flush();

      // resize it to 2x current length
      length = Math.max(length, Math.min(size * 2, this.maxBufferSize));
    }

    // minimum buffer size
    length = Math.max(length, this.minBufferSize);

    // allocate new buffer
    this.buffer = this.bufferish.alloc(length);
    this.start = 0;
    this.offset = req;
    return 0;
  }

  function send(buffer) {
    var length = buffer.length;
    if (length > this.minBufferSize) {
      this.flush();
      this.push(buffer);
    } else {
      var offset = this.reserve(length);
      Bufferish.prototype.copy.call(buffer, this.buffer, offset);
    }
  }
}

// common methods

function write() {
  throw new Error("method not implemented: write()");
}

function fetch() {
  throw new Error("method not implemented: fetch()");
}

function read() {
  var length = this.buffers && this.buffers.length;

  // fetch the first result
  if (!length) return this.fetch();

  // flush current buffer
  this.flush();

  // read from the results
  return this.pull();
}

function push(chunk) {
  var buffers = this.buffers || (this.buffers = []);
  buffers.push(chunk);
}

function pull() {
  var buffers = this.buffers || (this.buffers = []);
  return buffers.shift();
}

function mixinFactory(source) {
  return mixin;

  function mixin(target) {
    for (var key in source) {
      target[key] = source[key];
    }
    return target;
  }
}


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/read-core.js":
/*!****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/read-core.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// read-core.js

var ExtBuffer = __webpack_require__(/*! ./ext-buffer */ "./node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer;
var ExtUnpacker = __webpack_require__(/*! ./ext-unpacker */ "./node_modules/msgpack-lite/lib/ext-unpacker.js");
var readUint8 = __webpack_require__(/*! ./read-format */ "./node_modules/msgpack-lite/lib/read-format.js").readUint8;
var ReadToken = __webpack_require__(/*! ./read-token */ "./node_modules/msgpack-lite/lib/read-token.js");
var CodecBase = __webpack_require__(/*! ./codec-base */ "./node_modules/msgpack-lite/lib/codec-base.js");

CodecBase.install({
  addExtUnpacker: addExtUnpacker,
  getExtUnpacker: getExtUnpacker,
  init: init
});

exports.preset = init.call(CodecBase.preset);

function getDecoder(options) {
  var readToken = ReadToken.getReadToken(options);
  return decode;

  function decode(decoder) {
    var type = readUint8(decoder);
    var func = readToken[type];
    if (!func) throw new Error("Invalid type: " + (type ? ("0x" + type.toString(16)) : type));
    return func(decoder);
  }
}

function init() {
  var options = this.options;
  this.decode = getDecoder(options);

  if (options && options.preset) {
    ExtUnpacker.setExtUnpackers(this);
  }

  return this;
}

function addExtUnpacker(etype, unpacker) {
  var unpackers = this.extUnpackers || (this.extUnpackers = []);
  unpackers[etype] = CodecBase.filter(unpacker);
}

function getExtUnpacker(type) {
  var unpackers = this.extUnpackers || (this.extUnpackers = []);
  return unpackers[type] || extUnpacker;

  function extUnpacker(buffer) {
    return new ExtBuffer(buffer, type);
  }
}


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/read-format.js":
/*!******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/read-format.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// read-format.js

var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js");
var Int64Buffer = __webpack_require__(/*! int64-buffer */ "./node_modules/int64-buffer/int64-buffer.js");
var Uint64BE = Int64Buffer.Uint64BE;
var Int64BE = Int64Buffer.Int64BE;

exports.getReadFormat = getReadFormat;
exports.readUint8 = uint8;

var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");
var BufferProto = __webpack_require__(/*! ./bufferish-proto */ "./node_modules/msgpack-lite/lib/bufferish-proto.js");

var HAS_MAP = ("undefined" !== typeof Map);
var NO_ASSERT = true;

function getReadFormat(options) {
  var binarraybuffer = Bufferish.hasArrayBuffer && options && options.binarraybuffer;
  var int64 = options && options.int64;
  var usemap = HAS_MAP && options && options.usemap;

  var readFormat = {
    map: (usemap ? map_to_map : map_to_obj),
    array: array,
    str: str,
    bin: (binarraybuffer ? bin_arraybuffer : bin_buffer),
    ext: ext,
    uint8: uint8,
    uint16: uint16,
    uint32: uint32,
    uint64: read(8, int64 ? readUInt64BE_int64 : readUInt64BE),
    int8: int8,
    int16: int16,
    int32: int32,
    int64: read(8, int64 ? readInt64BE_int64 : readInt64BE),
    float32: read(4, readFloatBE),
    float64: read(8, readDoubleBE)
  };

  return readFormat;
}

function map_to_obj(decoder, len) {
  var value = {};
  var i;
  var k = new Array(len);
  var v = new Array(len);

  var decode = decoder.codec.decode;
  for (i = 0; i < len; i++) {
    k[i] = decode(decoder);
    v[i] = decode(decoder);
  }
  for (i = 0; i < len; i++) {
    value[k[i]] = v[i];
  }
  return value;
}

function map_to_map(decoder, len) {
  var value = new Map();
  var i;
  var k = new Array(len);
  var v = new Array(len);

  var decode = decoder.codec.decode;
  for (i = 0; i < len; i++) {
    k[i] = decode(decoder);
    v[i] = decode(decoder);
  }
  for (i = 0; i < len; i++) {
    value.set(k[i], v[i]);
  }
  return value;
}

function array(decoder, len) {
  var value = new Array(len);
  var decode = decoder.codec.decode;
  for (var i = 0; i < len; i++) {
    value[i] = decode(decoder);
  }
  return value;
}

function str(decoder, len) {
  var start = decoder.reserve(len);
  var end = start + len;
  return BufferProto.toString.call(decoder.buffer, "utf-8", start, end);
}

function bin_buffer(decoder, len) {
  var start = decoder.reserve(len);
  var end = start + len;
  var buf = BufferProto.slice.call(decoder.buffer, start, end);
  return Bufferish.from(buf);
}

function bin_arraybuffer(decoder, len) {
  var start = decoder.reserve(len);
  var end = start + len;
  var buf = BufferProto.slice.call(decoder.buffer, start, end);
  return Bufferish.Uint8Array.from(buf).buffer;
}

function ext(decoder, len) {
  var start = decoder.reserve(len+1);
  var type = decoder.buffer[start++];
  var end = start + len;
  var unpack = decoder.codec.getExtUnpacker(type);
  if (!unpack) throw new Error("Invalid ext type: " + (type ? ("0x" + type.toString(16)) : type));
  var buf = BufferProto.slice.call(decoder.buffer, start, end);
  return unpack(buf);
}

function uint8(decoder) {
  var start = decoder.reserve(1);
  return decoder.buffer[start];
}

function int8(decoder) {
  var start = decoder.reserve(1);
  var value = decoder.buffer[start];
  return (value & 0x80) ? value - 0x100 : value;
}

function uint16(decoder) {
  var start = decoder.reserve(2);
  var buffer = decoder.buffer;
  return (buffer[start++] << 8) | buffer[start];
}

function int16(decoder) {
  var start = decoder.reserve(2);
  var buffer = decoder.buffer;
  var value = (buffer[start++] << 8) | buffer[start];
  return (value & 0x8000) ? value - 0x10000 : value;
}

function uint32(decoder) {
  var start = decoder.reserve(4);
  var buffer = decoder.buffer;
  return (buffer[start++] * 16777216) + (buffer[start++] << 16) + (buffer[start++] << 8) + buffer[start];
}

function int32(decoder) {
  var start = decoder.reserve(4);
  var buffer = decoder.buffer;
  return (buffer[start++] << 24) | (buffer[start++] << 16) | (buffer[start++] << 8) | buffer[start];
}

function read(len, method) {
  return function(decoder) {
    var start = decoder.reserve(len);
    return method.call(decoder.buffer, start, NO_ASSERT);
  };
}

function readUInt64BE(start) {
  return new Uint64BE(this, start).toNumber();
}

function readInt64BE(start) {
  return new Int64BE(this, start).toNumber();
}

function readUInt64BE_int64(start) {
  return new Uint64BE(this, start);
}

function readInt64BE_int64(start) {
  return new Int64BE(this, start);
}

function readFloatBE(start) {
  return ieee754.read(this, start, false, 23, 4);
}

function readDoubleBE(start) {
  return ieee754.read(this, start, false, 52, 8);
}

/***/ }),

/***/ "./node_modules/msgpack-lite/lib/read-token.js":
/*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/read-token.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// read-token.js

var ReadFormat = __webpack_require__(/*! ./read-format */ "./node_modules/msgpack-lite/lib/read-format.js");

exports.getReadToken = getReadToken;

function getReadToken(options) {
  var format = ReadFormat.getReadFormat(options);

  if (options && options.useraw) {
    return init_useraw(format);
  } else {
    return init_token(format);
  }
}

function init_token(format) {
  var i;
  var token = new Array(256);

  // positive fixint -- 0x00 - 0x7f
  for (i = 0x00; i <= 0x7f; i++) {
    token[i] = constant(i);
  }

  // fixmap -- 0x80 - 0x8f
  for (i = 0x80; i <= 0x8f; i++) {
    token[i] = fix(i - 0x80, format.map);
  }

  // fixarray -- 0x90 - 0x9f
  for (i = 0x90; i <= 0x9f; i++) {
    token[i] = fix(i - 0x90, format.array);
  }

  // fixstr -- 0xa0 - 0xbf
  for (i = 0xa0; i <= 0xbf; i++) {
    token[i] = fix(i - 0xa0, format.str);
  }

  // nil -- 0xc0
  token[0xc0] = constant(null);

  // (never used) -- 0xc1
  token[0xc1] = null;

  // false -- 0xc2
  // true -- 0xc3
  token[0xc2] = constant(false);
  token[0xc3] = constant(true);

  // bin 8 -- 0xc4
  // bin 16 -- 0xc5
  // bin 32 -- 0xc6
  token[0xc4] = flex(format.uint8, format.bin);
  token[0xc5] = flex(format.uint16, format.bin);
  token[0xc6] = flex(format.uint32, format.bin);

  // ext 8 -- 0xc7
  // ext 16 -- 0xc8
  // ext 32 -- 0xc9
  token[0xc7] = flex(format.uint8, format.ext);
  token[0xc8] = flex(format.uint16, format.ext);
  token[0xc9] = flex(format.uint32, format.ext);

  // float 32 -- 0xca
  // float 64 -- 0xcb
  token[0xca] = format.float32;
  token[0xcb] = format.float64;

  // uint 8 -- 0xcc
  // uint 16 -- 0xcd
  // uint 32 -- 0xce
  // uint 64 -- 0xcf
  token[0xcc] = format.uint8;
  token[0xcd] = format.uint16;
  token[0xce] = format.uint32;
  token[0xcf] = format.uint64;

  // int 8 -- 0xd0
  // int 16 -- 0xd1
  // int 32 -- 0xd2
  // int 64 -- 0xd3
  token[0xd0] = format.int8;
  token[0xd1] = format.int16;
  token[0xd2] = format.int32;
  token[0xd3] = format.int64;

  // fixext 1 -- 0xd4
  // fixext 2 -- 0xd5
  // fixext 4 -- 0xd6
  // fixext 8 -- 0xd7
  // fixext 16 -- 0xd8
  token[0xd4] = fix(1, format.ext);
  token[0xd5] = fix(2, format.ext);
  token[0xd6] = fix(4, format.ext);
  token[0xd7] = fix(8, format.ext);
  token[0xd8] = fix(16, format.ext);

  // str 8 -- 0xd9
  // str 16 -- 0xda
  // str 32 -- 0xdb
  token[0xd9] = flex(format.uint8, format.str);
  token[0xda] = flex(format.uint16, format.str);
  token[0xdb] = flex(format.uint32, format.str);

  // array 16 -- 0xdc
  // array 32 -- 0xdd
  token[0xdc] = flex(format.uint16, format.array);
  token[0xdd] = flex(format.uint32, format.array);

  // map 16 -- 0xde
  // map 32 -- 0xdf
  token[0xde] = flex(format.uint16, format.map);
  token[0xdf] = flex(format.uint32, format.map);

  // negative fixint -- 0xe0 - 0xff
  for (i = 0xe0; i <= 0xff; i++) {
    token[i] = constant(i - 0x100);
  }

  return token;
}

function init_useraw(format) {
  var i;
  var token = init_token(format).slice();

  // raw 8 -- 0xd9
  // raw 16 -- 0xda
  // raw 32 -- 0xdb
  token[0xd9] = token[0xc4];
  token[0xda] = token[0xc5];
  token[0xdb] = token[0xc6];

  // fixraw -- 0xa0 - 0xbf
  for (i = 0xa0; i <= 0xbf; i++) {
    token[i] = fix(i - 0xa0, format.bin);
  }

  return token;
}

function constant(value) {
  return function() {
    return value;
  };
}

function flex(lenFunc, decodeFunc) {
  return function(decoder) {
    var len = lenFunc(decoder);
    return decodeFunc(decoder, len);
  };
}

function fix(len, method) {
  return function(decoder) {
    return method(decoder, len);
  };
}


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/write-core.js":
/*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/write-core.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// write-core.js

var ExtBuffer = __webpack_require__(/*! ./ext-buffer */ "./node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer;
var ExtPacker = __webpack_require__(/*! ./ext-packer */ "./node_modules/msgpack-lite/lib/ext-packer.js");
var WriteType = __webpack_require__(/*! ./write-type */ "./node_modules/msgpack-lite/lib/write-type.js");
var CodecBase = __webpack_require__(/*! ./codec-base */ "./node_modules/msgpack-lite/lib/codec-base.js");

CodecBase.install({
  addExtPacker: addExtPacker,
  getExtPacker: getExtPacker,
  init: init
});

exports.preset = init.call(CodecBase.preset);

function getEncoder(options) {
  var writeType = WriteType.getWriteType(options);
  return encode;

  function encode(encoder, value) {
    var func = writeType[typeof value];
    if (!func) throw new Error("Unsupported type \"" + (typeof value) + "\": " + value);
    func(encoder, value);
  }
}

function init() {
  var options = this.options;
  this.encode = getEncoder(options);

  if (options && options.preset) {
    ExtPacker.setExtPackers(this);
  }

  return this;
}

function addExtPacker(etype, Class, packer) {
  packer = CodecBase.filter(packer);
  var name = Class.name;
  if (name && name !== "Object") {
    var packers = this.extPackers || (this.extPackers = {});
    packers[name] = extPacker;
  } else {
    // fallback for IE
    var list = this.extEncoderList || (this.extEncoderList = []);
    list.unshift([Class, extPacker]);
  }

  function extPacker(value) {
    if (packer) value = packer(value);
    return new ExtBuffer(value, etype);
  }
}

function getExtPacker(value) {
  var packers = this.extPackers || (this.extPackers = {});
  var c = value.constructor;
  var e = c && c.name && packers[c.name];
  if (e) return e;

  // fallback for IE
  var list = this.extEncoderList || (this.extEncoderList = []);
  var len = list.length;
  for (var i = 0; i < len; i++) {
    var pair = list[i];
    if (c === pair[0]) return pair[1];
  }
}


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/write-token.js":
/*!******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/write-token.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// write-token.js

var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js");
var Int64Buffer = __webpack_require__(/*! int64-buffer */ "./node_modules/int64-buffer/int64-buffer.js");
var Uint64BE = Int64Buffer.Uint64BE;
var Int64BE = Int64Buffer.Int64BE;

var uint8 = __webpack_require__(/*! ./write-uint8 */ "./node_modules/msgpack-lite/lib/write-uint8.js").uint8;
var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");
var Buffer = Bufferish.global;
var IS_BUFFER_SHIM = Bufferish.hasBuffer && ("TYPED_ARRAY_SUPPORT" in Buffer);
var NO_TYPED_ARRAY = IS_BUFFER_SHIM && !Buffer.TYPED_ARRAY_SUPPORT;
var Buffer_prototype = Bufferish.hasBuffer && Buffer.prototype || {};

exports.getWriteToken = getWriteToken;

function getWriteToken(options) {
  if (options && options.uint8array) {
    return init_uint8array();
  } else if (NO_TYPED_ARRAY || (Bufferish.hasBuffer && options && options.safe)) {
    return init_safe();
  } else {
    return init_token();
  }
}

function init_uint8array() {
  var token = init_token();

  // float 32 -- 0xca
  // float 64 -- 0xcb
  token[0xca] = writeN(0xca, 4, writeFloatBE);
  token[0xcb] = writeN(0xcb, 8, writeDoubleBE);

  return token;
}

// Node.js and browsers with TypedArray

function init_token() {
  // (immediate values)
  // positive fixint -- 0x00 - 0x7f
  // nil -- 0xc0
  // false -- 0xc2
  // true -- 0xc3
  // negative fixint -- 0xe0 - 0xff
  var token = uint8.slice();

  // bin 8 -- 0xc4
  // bin 16 -- 0xc5
  // bin 32 -- 0xc6
  token[0xc4] = write1(0xc4);
  token[0xc5] = write2(0xc5);
  token[0xc6] = write4(0xc6);

  // ext 8 -- 0xc7
  // ext 16 -- 0xc8
  // ext 32 -- 0xc9
  token[0xc7] = write1(0xc7);
  token[0xc8] = write2(0xc8);
  token[0xc9] = write4(0xc9);

  // float 32 -- 0xca
  // float 64 -- 0xcb
  token[0xca] = writeN(0xca, 4, (Buffer_prototype.writeFloatBE || writeFloatBE), true);
  token[0xcb] = writeN(0xcb, 8, (Buffer_prototype.writeDoubleBE || writeDoubleBE), true);

  // uint 8 -- 0xcc
  // uint 16 -- 0xcd
  // uint 32 -- 0xce
  // uint 64 -- 0xcf
  token[0xcc] = write1(0xcc);
  token[0xcd] = write2(0xcd);
  token[0xce] = write4(0xce);
  token[0xcf] = writeN(0xcf, 8, writeUInt64BE);

  // int 8 -- 0xd0
  // int 16 -- 0xd1
  // int 32 -- 0xd2
  // int 64 -- 0xd3
  token[0xd0] = write1(0xd0);
  token[0xd1] = write2(0xd1);
  token[0xd2] = write4(0xd2);
  token[0xd3] = writeN(0xd3, 8, writeInt64BE);

  // str 8 -- 0xd9
  // str 16 -- 0xda
  // str 32 -- 0xdb
  token[0xd9] = write1(0xd9);
  token[0xda] = write2(0xda);
  token[0xdb] = write4(0xdb);

  // array 16 -- 0xdc
  // array 32 -- 0xdd
  token[0xdc] = write2(0xdc);
  token[0xdd] = write4(0xdd);

  // map 16 -- 0xde
  // map 32 -- 0xdf
  token[0xde] = write2(0xde);
  token[0xdf] = write4(0xdf);

  return token;
}

// safe mode: for old browsers and who needs asserts

function init_safe() {
  // (immediate values)
  // positive fixint -- 0x00 - 0x7f
  // nil -- 0xc0
  // false -- 0xc2
  // true -- 0xc3
  // negative fixint -- 0xe0 - 0xff
  var token = uint8.slice();

  // bin 8 -- 0xc4
  // bin 16 -- 0xc5
  // bin 32 -- 0xc6
  token[0xc4] = writeN(0xc4, 1, Buffer.prototype.writeUInt8);
  token[0xc5] = writeN(0xc5, 2, Buffer.prototype.writeUInt16BE);
  token[0xc6] = writeN(0xc6, 4, Buffer.prototype.writeUInt32BE);

  // ext 8 -- 0xc7
  // ext 16 -- 0xc8
  // ext 32 -- 0xc9
  token[0xc7] = writeN(0xc7, 1, Buffer.prototype.writeUInt8);
  token[0xc8] = writeN(0xc8, 2, Buffer.prototype.writeUInt16BE);
  token[0xc9] = writeN(0xc9, 4, Buffer.prototype.writeUInt32BE);

  // float 32 -- 0xca
  // float 64 -- 0xcb
  token[0xca] = writeN(0xca, 4, Buffer.prototype.writeFloatBE);
  token[0xcb] = writeN(0xcb, 8, Buffer.prototype.writeDoubleBE);

  // uint 8 -- 0xcc
  // uint 16 -- 0xcd
  // uint 32 -- 0xce
  // uint 64 -- 0xcf
  token[0xcc] = writeN(0xcc, 1, Buffer.prototype.writeUInt8);
  token[0xcd] = writeN(0xcd, 2, Buffer.prototype.writeUInt16BE);
  token[0xce] = writeN(0xce, 4, Buffer.prototype.writeUInt32BE);
  token[0xcf] = writeN(0xcf, 8, writeUInt64BE);

  // int 8 -- 0xd0
  // int 16 -- 0xd1
  // int 32 -- 0xd2
  // int 64 -- 0xd3
  token[0xd0] = writeN(0xd0, 1, Buffer.prototype.writeInt8);
  token[0xd1] = writeN(0xd1, 2, Buffer.prototype.writeInt16BE);
  token[0xd2] = writeN(0xd2, 4, Buffer.prototype.writeInt32BE);
  token[0xd3] = writeN(0xd3, 8, writeInt64BE);

  // str 8 -- 0xd9
  // str 16 -- 0xda
  // str 32 -- 0xdb
  token[0xd9] = writeN(0xd9, 1, Buffer.prototype.writeUInt8);
  token[0xda] = writeN(0xda, 2, Buffer.prototype.writeUInt16BE);
  token[0xdb] = writeN(0xdb, 4, Buffer.prototype.writeUInt32BE);

  // array 16 -- 0xdc
  // array 32 -- 0xdd
  token[0xdc] = writeN(0xdc, 2, Buffer.prototype.writeUInt16BE);
  token[0xdd] = writeN(0xdd, 4, Buffer.prototype.writeUInt32BE);

  // map 16 -- 0xde
  // map 32 -- 0xdf
  token[0xde] = writeN(0xde, 2, Buffer.prototype.writeUInt16BE);
  token[0xdf] = writeN(0xdf, 4, Buffer.prototype.writeUInt32BE);

  return token;
}

function write1(type) {
  return function(encoder, value) {
    var offset = encoder.reserve(2);
    var buffer = encoder.buffer;
    buffer[offset++] = type;
    buffer[offset] = value;
  };
}

function write2(type) {
  return function(encoder, value) {
    var offset = encoder.reserve(3);
    var buffer = encoder.buffer;
    buffer[offset++] = type;
    buffer[offset++] = value >>> 8;
    buffer[offset] = value;
  };
}

function write4(type) {
  return function(encoder, value) {
    var offset = encoder.reserve(5);
    var buffer = encoder.buffer;
    buffer[offset++] = type;
    buffer[offset++] = value >>> 24;
    buffer[offset++] = value >>> 16;
    buffer[offset++] = value >>> 8;
    buffer[offset] = value;
  };
}

function writeN(type, len, method, noAssert) {
  return function(encoder, value) {
    var offset = encoder.reserve(len + 1);
    encoder.buffer[offset++] = type;
    method.call(encoder.buffer, value, offset, noAssert);
  };
}

function writeUInt64BE(value, offset) {
  new Uint64BE(this, offset, value);
}

function writeInt64BE(value, offset) {
  new Int64BE(this, offset, value);
}

function writeFloatBE(value, offset) {
  ieee754.write(this, value, offset, false, 23, 4);
}

function writeDoubleBE(value, offset) {
  ieee754.write(this, value, offset, false, 52, 8);
}


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/write-type.js":
/*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/write-type.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// write-type.js

var IS_ARRAY = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js");
var Int64Buffer = __webpack_require__(/*! int64-buffer */ "./node_modules/int64-buffer/int64-buffer.js");
var Uint64BE = Int64Buffer.Uint64BE;
var Int64BE = Int64Buffer.Int64BE;

var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");
var BufferProto = __webpack_require__(/*! ./bufferish-proto */ "./node_modules/msgpack-lite/lib/bufferish-proto.js");
var WriteToken = __webpack_require__(/*! ./write-token */ "./node_modules/msgpack-lite/lib/write-token.js");
var uint8 = __webpack_require__(/*! ./write-uint8 */ "./node_modules/msgpack-lite/lib/write-uint8.js").uint8;
var ExtBuffer = __webpack_require__(/*! ./ext-buffer */ "./node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer;

var HAS_UINT8ARRAY = ("undefined" !== typeof Uint8Array);
var HAS_MAP = ("undefined" !== typeof Map);

var extmap = [];
extmap[1] = 0xd4;
extmap[2] = 0xd5;
extmap[4] = 0xd6;
extmap[8] = 0xd7;
extmap[16] = 0xd8;

exports.getWriteType = getWriteType;

function getWriteType(options) {
  var token = WriteToken.getWriteToken(options);
  var useraw = options && options.useraw;
  var binarraybuffer = HAS_UINT8ARRAY && options && options.binarraybuffer;
  var isBuffer = binarraybuffer ? Bufferish.isArrayBuffer : Bufferish.isBuffer;
  var bin = binarraybuffer ? bin_arraybuffer : bin_buffer;
  var usemap = HAS_MAP && options && options.usemap;
  var map = usemap ? map_to_map : obj_to_map;

  var writeType = {
    "boolean": bool,
    "function": nil,
    "number": number,
    "object": (useraw ? object_raw : object),
    "string": _string(useraw ? raw_head_size : str_head_size),
    "symbol": nil,
    "undefined": nil
  };

  return writeType;

  // false -- 0xc2
  // true -- 0xc3
  function bool(encoder, value) {
    var type = value ? 0xc3 : 0xc2;
    token[type](encoder, value);
  }

  function number(encoder, value) {
    var ivalue = value | 0;
    var type;
    if (value !== ivalue) {
      // float 64 -- 0xcb
      type = 0xcb;
      token[type](encoder, value);
      return;
    } else if (-0x20 <= ivalue && ivalue <= 0x7F) {
      // positive fixint -- 0x00 - 0x7f
      // negative fixint -- 0xe0 - 0xff
      type = ivalue & 0xFF;
    } else if (0 <= ivalue) {
      // uint 8 -- 0xcc
      // uint 16 -- 0xcd
      // uint 32 -- 0xce
      type = (ivalue <= 0xFF) ? 0xcc : (ivalue <= 0xFFFF) ? 0xcd : 0xce;
    } else {
      // int 8 -- 0xd0
      // int 16 -- 0xd1
      // int 32 -- 0xd2
      type = (-0x80 <= ivalue) ? 0xd0 : (-0x8000 <= ivalue) ? 0xd1 : 0xd2;
    }
    token[type](encoder, ivalue);
  }

  // uint 64 -- 0xcf
  function uint64(encoder, value) {
    var type = 0xcf;
    token[type](encoder, value.toArray());
  }

  // int 64 -- 0xd3
  function int64(encoder, value) {
    var type = 0xd3;
    token[type](encoder, value.toArray());
  }

  // str 8 -- 0xd9
  // str 16 -- 0xda
  // str 32 -- 0xdb
  // fixstr -- 0xa0 - 0xbf
  function str_head_size(length) {
    return (length < 32) ? 1 : (length <= 0xFF) ? 2 : (length <= 0xFFFF) ? 3 : 5;
  }

  // raw 16 -- 0xda
  // raw 32 -- 0xdb
  // fixraw -- 0xa0 - 0xbf
  function raw_head_size(length) {
    return (length < 32) ? 1 : (length <= 0xFFFF) ? 3 : 5;
  }

  function _string(head_size) {
    return string;

    function string(encoder, value) {
      // prepare buffer
      var length = value.length;
      var maxsize = 5 + length * 3;
      encoder.offset = encoder.reserve(maxsize);
      var buffer = encoder.buffer;

      // expected header size
      var expected = head_size(length);

      // expected start point
      var start = encoder.offset + expected;

      // write string
      length = BufferProto.write.call(buffer, value, start);

      // actual header size
      var actual = head_size(length);

      // move content when needed
      if (expected !== actual) {
        var targetStart = start + actual - expected;
        var end = start + length;
        BufferProto.copy.call(buffer, buffer, targetStart, start, end);
      }

      // write header
      var type = (actual === 1) ? (0xa0 + length) : (actual <= 3) ? (0xd7 + actual) : 0xdb;
      token[type](encoder, length);

      // move cursor
      encoder.offset += length;
    }
  }

  function object(encoder, value) {
    // null
    if (value === null) return nil(encoder, value);

    // Buffer
    if (isBuffer(value)) return bin(encoder, value);

    // Array
    if (IS_ARRAY(value)) return array(encoder, value);

    // int64-buffer objects
    if (Uint64BE.isUint64BE(value)) return uint64(encoder, value);
    if (Int64BE.isInt64BE(value)) return int64(encoder, value);

    // ext formats
    var packer = encoder.codec.getExtPacker(value);
    if (packer) value = packer(value);
    if (value instanceof ExtBuffer) return ext(encoder, value);

    // plain old Objects or Map
    map(encoder, value);
  }

  function object_raw(encoder, value) {
    // Buffer
    if (isBuffer(value)) return raw(encoder, value);

    // others
    object(encoder, value);
  }

  // nil -- 0xc0
  function nil(encoder, value) {
    var type = 0xc0;
    token[type](encoder, value);
  }

  // fixarray -- 0x90 - 0x9f
  // array 16 -- 0xdc
  // array 32 -- 0xdd
  function array(encoder, value) {
    var length = value.length;
    var type = (length < 16) ? (0x90 + length) : (length <= 0xFFFF) ? 0xdc : 0xdd;
    token[type](encoder, length);

    var encode = encoder.codec.encode;
    for (var i = 0; i < length; i++) {
      encode(encoder, value[i]);
    }
  }

  // bin 8 -- 0xc4
  // bin 16 -- 0xc5
  // bin 32 -- 0xc6
  function bin_buffer(encoder, value) {
    var length = value.length;
    var type = (length < 0xFF) ? 0xc4 : (length <= 0xFFFF) ? 0xc5 : 0xc6;
    token[type](encoder, length);
    encoder.send(value);
  }

  function bin_arraybuffer(encoder, value) {
    bin_buffer(encoder, new Uint8Array(value));
  }

  // fixext 1 -- 0xd4
  // fixext 2 -- 0xd5
  // fixext 4 -- 0xd6
  // fixext 8 -- 0xd7
  // fixext 16 -- 0xd8
  // ext 8 -- 0xc7
  // ext 16 -- 0xc8
  // ext 32 -- 0xc9
  function ext(encoder, value) {
    var buffer = value.buffer;
    var length = buffer.length;
    var type = extmap[length] || ((length < 0xFF) ? 0xc7 : (length <= 0xFFFF) ? 0xc8 : 0xc9);
    token[type](encoder, length);
    uint8[value.type](encoder);
    encoder.send(buffer);
  }

  // fixmap -- 0x80 - 0x8f
  // map 16 -- 0xde
  // map 32 -- 0xdf
  function obj_to_map(encoder, value) {
    var keys = Object.keys(value);
    var length = keys.length;
    var type = (length < 16) ? (0x80 + length) : (length <= 0xFFFF) ? 0xde : 0xdf;
    token[type](encoder, length);

    var encode = encoder.codec.encode;
    keys.forEach(function(key) {
      encode(encoder, key);
      encode(encoder, value[key]);
    });
  }

  // fixmap -- 0x80 - 0x8f
  // map 16 -- 0xde
  // map 32 -- 0xdf
  function map_to_map(encoder, value) {
    if (!(value instanceof Map)) return obj_to_map(encoder, value);

    var length = value.size;
    var type = (length < 16) ? (0x80 + length) : (length <= 0xFFFF) ? 0xde : 0xdf;
    token[type](encoder, length);

    var encode = encoder.codec.encode;
    value.forEach(function(val, key, m) {
      encode(encoder, key);
      encode(encoder, val);
    });
  }

  // raw 16 -- 0xda
  // raw 32 -- 0xdb
  // fixraw -- 0xa0 - 0xbf
  function raw(encoder, value) {
    var length = value.length;
    var type = (length < 32) ? (0xa0 + length) : (length <= 0xFFFF) ? 0xda : 0xdb;
    token[type](encoder, length);
    encoder.send(value);
  }
}


/***/ }),

/***/ "./node_modules/msgpack-lite/lib/write-uint8.js":
/*!******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/write-uint8.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

// write-unit8.js

var constant = exports.uint8 = new Array(256);

for (var i = 0x00; i <= 0xFF; i++) {
  constant[i] = write0(i);
}

function write0(type) {
  return function(encoder) {
    var offset = encoder.reserve(1);
    encoder.buffer[offset] = type;
  };
}


/***/ }),

/***/ "./src/EventEmitter.ts":
/*!*****************************!*\
  !*** ./src/EventEmitter.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventEmitter": () => (/* binding */ EventEmitter)
/* harmony export */ });
class EventEmitter {
    constructor() {
        this.listeners = new Map();
    }
    on(event, handler) {
        let handlers = this.listeners.get(event);
        if (handlers === undefined) {
            handlers = [];
            this.listeners.set(event, handlers);
        }
        handlers.push(handler);
    }
    emit(event, ...data) {
        const handlers = this.listeners.get(event);
        if (handlers !== undefined) {
            const errors = [];
            handlers.forEach((handler) => {
                try {
                    handler(...data);
                }
                catch (e) {
                    /* istanbul ignore next */
                    errors.push(e);
                }
            });
            /* Error conditions here are impossible to test for from selenium
             * because it would arise from the wrong use of the API, which we
             * can't ship in the extension, so don't try to instrument. */
            /* istanbul ignore next */
            if (errors.length > 0) {
                throw new Error(JSON.stringify(errors));
            }
        }
    }
}


/***/ }),

/***/ "./src/KeyHandler.ts":
/*!***************************!*\
  !*** ./src/KeyHandler.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KeydownHandler": () => (/* binding */ KeydownHandler)
/* harmony export */ });
/* harmony import */ var _EventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventEmitter */ "./src/EventEmitter.ts");
/* harmony import */ var _utils_keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/keys */ "./src/utils/keys.ts");


// This class implements the keydown logic that deals with modifiers and is
// shared across both browsers and thunderbird
class KeydownHandler extends _EventEmitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {
    constructor(elem, settings) {
        super();
        this.elem = elem;
        const ignoreKeys = settings.ignoreKeys;
        this.elem.addEventListener("keydown", (evt) => {
            // This is a workaround for osx where pressing non-alphanumeric
            // characters like "@" requires pressing <A-a>, which results
            // in the browser sending an <A-@> event, which we want to
            // treat as a regular @.
            // So if we're seeing an alt on a non-alphanumeric character,
            // we just ignore it and let the input event handler do its
            // magic. This can only be tested on OSX, as generating an
            // <A-@> keydown event with selenium won't result in an input
            // event.
            // Since coverage reports are only retrieved on linux, we don't
            // instrument this condition.
            /* istanbul ignore next */
            if (evt.altKey && settings.alt === "alphanum" && !/[a-zA-Z0-9]/.test(evt.key)) {
                return;
            }
            // Note: order of this array is important, we need to check OS before checking meta
            const specialKeys = [["Alt", "A"], ["Control", "C"], ["OS", "D"], ["Meta", "D"]];
            // The event has to be trusted and either have a modifier or a non-literal representation
            if (evt.isTrusted
                && (_utils_keys__WEBPACK_IMPORTED_MODULE_1__.nonLiteralKeys[evt.key] !== undefined
                    || specialKeys.find(([mod, _]) => evt.key !== mod && evt.getModifierState(mod)))) {
                const text = specialKeys.concat([["Shift", "S"]])
                    .reduce((key, [attr, mod]) => {
                    if (evt.getModifierState(attr)) {
                        return (0,_utils_keys__WEBPACK_IMPORTED_MODULE_1__.addModifier)(mod, key);
                    }
                    return key;
                }, (0,_utils_keys__WEBPACK_IMPORTED_MODULE_1__.translateKey)(evt.key));
                let keys = [];
                if (ignoreKeys[this.currentMode] !== undefined) {
                    keys = ignoreKeys[this.currentMode].slice();
                }
                if (ignoreKeys.all !== undefined) {
                    keys.push.apply(keys, ignoreKeys.all);
                }
                if (!keys.includes(text)) {
                    this.emit("input", text);
                    evt.preventDefault();
                    evt.stopImmediatePropagation();
                }
            }
        });
    }
    focus() {
        this.elem.focus();
    }
    moveTo(_, __) {
        // Don't do nuthin
    }
    setMode(s) {
        this.currentMode = s;
    }
}
;


/***/ }),

/***/ "./src/Neovim.ts":
/*!***********************!*\
  !*** ./src/Neovim.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "neovim": () => (/* binding */ neovim)
/* harmony export */ });
/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderer */ "./src/renderer.ts");
/* harmony import */ var _Stdin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Stdin */ "./src/Stdin.ts");
/* harmony import */ var _Stdout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Stdout */ "./src/Stdout.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _utils_configuration__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/configuration */ "./src/utils/configuration.ts");





async function neovim(page, canvas, { port, password }) {
    const functions = {};
    const requests = new Map();
    _renderer__WEBPACK_IMPORTED_MODULE_0__.setCanvas(canvas);
    _renderer__WEBPACK_IMPORTED_MODULE_0__.events.on("resize", ({ grid, width, height }) => {
        functions.ui_try_resize_grid(grid, width, height);
    });
    _renderer__WEBPACK_IMPORTED_MODULE_0__.events.on("frameResize", ({ width, height }) => {
        page.resizeEditor(width, height);
    });
    let prevNotificationPromise = Promise.resolve();
    const socket = new WebSocket(`ws://127.0.0.1:${port}/${password}`);
    socket.binaryType = "arraybuffer";
    socket.addEventListener("close", ((_) => {
        prevNotificationPromise = prevNotificationPromise.finally(() => page.killEditor());
    }));
    await (new Promise(resolve => socket.addEventListener("open", () => {
        resolve(undefined);
    })));
    const stdin = new _Stdin__WEBPACK_IMPORTED_MODULE_1__.Stdin(socket);
    const stdout = new _Stdout__WEBPACK_IMPORTED_MODULE_2__.Stdout(socket);
    let reqId = 0;
    const request = (api, args) => {
        return new Promise((resolve, reject) => {
            reqId += 1;
            requests.set(reqId, { resolve, reject });
            stdin.write(reqId, api, args);
        });
    };
    stdout.on("request", (id, name, args) => {
        console.warn("firenvim: unhandled request from neovim", id, name, args);
    });
    stdout.on("response", (id, error, result) => {
        const r = requests.get(id);
        if (!r) {
            // This can't happen and yet it sometimes does, possibly due to a firefox bug
            console.error(`Received answer to ${id} but no handler found!`);
        }
        else {
            requests.delete(id);
            if (error) {
                r.reject(error);
            }
            else {
                r.resolve(result);
            }
        }
    });
    let lastLostFocus = performance.now();
    stdout.on("notification", async (name, args) => {
        if (name === "redraw" && args) {
            _renderer__WEBPACK_IMPORTED_MODULE_0__.onRedraw(args);
            return;
        }
        prevNotificationPromise = prevNotificationPromise.finally(() => {
            // A very tricky sequence of events could happen here:
            // - firenvim_bufwrite is received page.setElementContent is called
            //   asynchronously
            // - firenvim_focus_page is called, page.focusPage() is called
            //   asynchronously, lastLostFocus is set to now
            // - page.setElementContent completes, lastLostFocus is checked to see
            //   if focus should be grabbed or not
            // That's why we have to check for lastLostFocus after
            // page.setElementContent/Cursor! Same thing for firenvim_press_keys
            const hadFocus = document.hasFocus();
            switch (name) {
                case "firenvim_sync_with_elm": {
                    return Promise.all([page.getElementContent(), page.getEditorInfo()]).then(([content, [url, selector, cursor, language]]) => {
                        const urlSettings = (0,_utils_configuration__WEBPACK_IMPORTED_MODULE_4__.getConfForUrl)(url);
                        const filename = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__.toFileName)(urlSettings.filename, url, selector, language);
                        const [line, col] = cursor;
                        return functions.call_function("writefile", [content.split("\n"), filename])
                            .then(() => functions.command(`edit ${filename} `
                            + `| call nvim_win_set_cursor(0, [${line}, ${col}])`));
                    });
                }
                case "firenvim_bufwrite":
                    {
                        const data = args[0];
                        return page.setElementContent(data.text.join("\n"))
                            .then(() => page.setElementCursor(...(data.cursor)))
                            .then(() => {
                            if (hadFocus
                                && !document.hasFocus()
                                && (performance.now() - lastLostFocus > 3000)) {
                                window.focus();
                            }
                        });
                    }
                case "firenvim_eval_js":
                    return page.evalInPage(args[0]).catch(_ => _).then(result => {
                        if (args[1]) {
                            request("nvim_call_function", [args[1], [JSON.stringify(result)]]);
                        }
                    });
                case "firenvim_focus_page":
                    lastLostFocus = performance.now();
                    return page.focusPage();
                case "firenvim_focus_input":
                    lastLostFocus = performance.now();
                    return page.focusInput();
                case "firenvim_hide_frame":
                    lastLostFocus = performance.now();
                    return page.hideEditor();
                case "firenvim_press_keys":
                    return page.pressKeys(args[0]);
                case "firenvim_vimleave":
                    lastLostFocus = performance.now();
                    return page.killEditor();
                case "firenvim_thunderbird_send":
                    return browser.runtime.sendMessage({
                        args: [],
                        funcName: ["thunderbirdSend"],
                    });
            }
        });
    });
    const { 0: channel, 1: apiInfo } = (await request("nvim_get_api_info", []));
    stdout.setTypes(apiInfo.types);
    Object.assign(functions, apiInfo.functions
        .filter(f => f.deprecated_since === undefined)
        .reduce((acc, cur) => {
        let name = cur.name;
        if (name.startsWith("nvim_")) {
            name = name.slice(5);
        }
        acc[name] = (...args) => request(cur.name, args);
        return acc;
    }, {}));
    functions.get_current_channel = () => channel;
    return functions;
}


/***/ }),

/***/ "./src/Stdin.ts":
/*!**********************!*\
  !*** ./src/Stdin.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Stdin": () => (/* binding */ Stdin)
/* harmony export */ });
/* harmony import */ var msgpack_lite__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! msgpack-lite */ "./node_modules/msgpack-lite/lib/browser.js");

class Stdin {
    constructor(socket) {
        this.socket = socket;
    }
    write(reqId, method, args) {
        const req = [0, reqId, method, args];
        const encoded = msgpack_lite__WEBPACK_IMPORTED_MODULE_0__.encode(req);
        this.socket.send(encoded);
    }
}


/***/ }),

/***/ "./src/Stdout.ts":
/*!***********************!*\
  !*** ./src/Stdout.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Stdout": () => (/* binding */ Stdout)
/* harmony export */ });
/* harmony import */ var msgpack_lite__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! msgpack-lite */ "./node_modules/msgpack-lite/lib/browser.js");
/* harmony import */ var _EventEmitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EventEmitter */ "./src/EventEmitter.ts");


class Stdout extends _EventEmitter__WEBPACK_IMPORTED_MODULE_1__.EventEmitter {
    constructor(socket) {
        super();
        this.socket = socket;
        this.messageNames = new Map([[0, "request"], [1, "response"], [2, "notification"]]);
        // Holds previously-received, incomplete and unprocessed messages
        this.prev = new Uint8Array(0);
        this.msgpackConfig = {};
        this.socket.addEventListener("message", this.onMessage.bind(this));
    }
    setTypes(types) {
        this.msgpackConfig.codec = msgpack_lite__WEBPACK_IMPORTED_MODULE_0__.createCodec({ preset: true });
        Object
            .entries(types)
            .forEach(([_, { id }]) => this
            .msgpackConfig
            .codec
            .addExtUnpacker(id, (data) => data));
    }
    onMessage(msg) {
        const msgData = new Uint8Array(msg.data);
        let data = new Uint8Array(msgData.byteLength + this.prev.byteLength);
        data.set(this.prev);
        data.set(msgData, this.prev.length);
        while (true) {
            let decoded;
            try {
                decoded = msgpack_lite__WEBPACK_IMPORTED_MODULE_0__.decode(data, this.msgpackConfig);
            }
            catch (e) {
                this.prev = data;
                return;
            }
            const encoded = msgpack_lite__WEBPACK_IMPORTED_MODULE_0__.encode(decoded);
            data = data.slice(encoded.byteLength);
            const [kind, reqId, data1, data2] = decoded;
            const name = this.messageNames.get(kind);
            /* istanbul ignore else */
            if (name) {
                this.emit(name, reqId, data1, data2);
            }
            else {
                // Can't be tested because this would mean messages that break
                // the msgpack-rpc spec, so coverage impossible to get.
                console.error(`Unhandled message kind ${name}`);
            }
        }
    }
}


/***/ }),

/***/ "./src/input.ts":
/*!**********************!*\
  !*** ./src/input.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setupInput": () => (/* binding */ setupInput)
/* harmony export */ });
/* harmony import */ var _Neovim__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Neovim */ "./src/Neovim.ts");
/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderer */ "./src/renderer.ts");
/* harmony import */ var _utils_configuration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/configuration */ "./src/utils/configuration.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/utils */ "./src/utils/utils.ts");




async function setupInput(page, canvas, keyHandler, connectionPromise) {
    try {
        const [[url, selector, cursor, language], connectionData] = await Promise.all([page.getEditorInfo(), connectionPromise]);
        const nvimPromise = (0,_Neovim__WEBPACK_IMPORTED_MODULE_0__.neovim)(page, canvas, connectionData);
        const contentPromise = page.getElementContent();
        const [cols, rows] = (0,_renderer__WEBPACK_IMPORTED_MODULE_1__.getLogicalSize)();
        const nvim = await nvimPromise;
        keyHandler.on("input", (s) => nvim.input(s));
        _renderer__WEBPACK_IMPORTED_MODULE_1__.events.on("modeChange", (s) => keyHandler.setMode(s));
        // We need to set client info before running ui_attach because we want this
        // info to be available when UIEnter is triggered
        const extInfo = browser.runtime.getManifest();
        const [major, minor, patch] = extInfo.version.split(".");
        nvim.set_client_info(extInfo.name, { major, minor, patch }, "ui", {}, {});
        await _utils_configuration__WEBPACK_IMPORTED_MODULE_2__.confReady;
        const urlSettings = (0,_utils_configuration__WEBPACK_IMPORTED_MODULE_2__.getConfForUrl)(url);
        nvim.ui_attach(cols < 1 ? 1 : cols, rows < 1 ? 1 : rows, {
            ext_linegrid: true,
            ext_messages: urlSettings.cmdline === "firenvim",
            rgb: true,
        }).catch(console.log);
        let resizeReqId = 0;
        page.on("resize", ([id, width, height]) => {
            if (id > resizeReqId) {
                resizeReqId = id;
                // We need to put the keyHandler at the origin in order to avoid
                // issues when it slips out of the viewport
                keyHandler.moveTo(0, 0);
                // It's tempting to try to optimize this by only calling
                // ui_try_resize when nCols is different from cols and nRows is
                // different from rows but we can't because redraw notifications
                // might happen without us actually calling ui_try_resize and then
                // the sizes wouldn't be in sync anymore
                const [nCols, nRows] = (0,_renderer__WEBPACK_IMPORTED_MODULE_1__.computeGridDimensionsFor)(width * window.devicePixelRatio, height * window.devicePixelRatio);
                nvim.ui_try_resize_grid((0,_renderer__WEBPACK_IMPORTED_MODULE_1__.getGridId)(), nCols, nRows);
                page.resizeEditor(Math.floor(width / nCols) * nCols, Math.floor(height / nRows) * nRows);
            }
        });
        page.on("frame_sendKey", (args) => nvim.input(args.join("")));
        page.on("get_buf_content", (r) => r(nvim.buf_get_lines(0, 0, -1, 0)));
        // Create file, set its content to the textarea's, write it
        const filename = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__.toFileName)(urlSettings.filename, url, selector, language);
        const content = await contentPromise;
        const [line, col] = cursor;
        const writeFilePromise = nvim.call_function("writefile", [content.split("\n"), filename])
            .then(() => nvim.command(`edit ${filename} `
            + `| call nvim_win_set_cursor(0, [${line}, ${col}])`));
        // Can't get coverage for this as browsers don't let us reliably
        // push data to the server on beforeunload.
        /* istanbul ignore next */
        window.addEventListener("beforeunload", () => {
            nvim.ui_detach();
            nvim.command("qall!");
        });
        // Keep track of last active instance (necessary for firenvim#focus_input() & others)
        const chan = nvim.get_current_channel();
        function setCurrentChan() {
            nvim.set_var("last_focused_firenvim_channel", chan);
        }
        setCurrentChan();
        window.addEventListener("focus", setCurrentChan);
        window.addEventListener("click", setCurrentChan);
        const augroupName = `FirenvimAugroupChan${chan}`;
        // Cleanup means:
        // - notify frontend that we're shutting down
        // - delete file
        // - remove own augroup
        const cleanup = `call rpcnotify(${chan}, 'firenvim_vimleave') | `
            + `call delete('${filename}')`;
        // Ask for notifications when user writes/leaves firenvim
        nvim.call_atomic((`augroup ${augroupName}
                        au!
                        autocmd BufWrite ${filename} `
            + `call rpcnotify(${chan}, `
            + `'firenvim_bufwrite', `
            + `{`
            + `'text': nvim_buf_get_lines(0, 0, -1, 0),`
            + `'cursor': nvim_win_get_cursor(0),`
            + `})
                        au VimLeave * ${cleanup}
                    augroup END`).split("\n").map(command => ["nvim_command", [command]]));
        window.addEventListener("mousemove", (evt) => {
            keyHandler.moveTo(evt.clientX, evt.clientY);
        });
        function onMouse(evt, action) {
            let button;
            // Selenium can't generate wheel events yet :(
            /* istanbul ignore next */
            if (evt instanceof WheelEvent) {
                button = "wheel";
            }
            else {
                // Selenium can't generate mouse events with more buttons :(
                /* istanbul ignore next */
                if (evt.button > 2) {
                    // Neovim doesn't handle other mouse buttons for now
                    return;
                }
                button = ["left", "middle", "right"][evt.button];
            }
            evt.preventDefault();
            evt.stopImmediatePropagation();
            const modifiers = (evt.altKey ? "A" : "") +
                (evt.ctrlKey ? "C" : "") +
                (evt.metaKey ? "D" : "") +
                (evt.shiftKey ? "S" : "");
            const [x, y] = (0,_renderer__WEBPACK_IMPORTED_MODULE_1__.getGridCoordinates)(evt.pageX, evt.pageY);
            nvim.input_mouse(button, action, modifiers, (0,_renderer__WEBPACK_IMPORTED_MODULE_1__.getGridId)(), y, x);
            keyHandler.focus();
        }
        window.addEventListener("mousedown", e => {
            onMouse(e, "press");
        });
        window.addEventListener("mouseup", e => {
            onMouse(e, "release");
        });
        // Selenium doesn't let you simulate mouse wheel events :(
        /* istanbul ignore next */
        window.addEventListener("wheel", evt => {
            if (Math.abs(evt.deltaY) >= Math.abs(evt.deltaX)) {
                onMouse(evt, evt.deltaY < 0 ? "up" : "down");
            }
            else {
                onMouse(evt, evt.deltaX < 0 ? "right" : "left");
            }
        });
        // Let users know when they focus/unfocus the frame
        window.addEventListener("focus", () => {
            document.documentElement.style.opacity = "1";
            keyHandler.focus();
            nvim.command("doautocmd FocusGained");
        });
        window.addEventListener("blur", () => {
            document.documentElement.style.opacity = "1";
            nvim.command("doautocmd FocusLost");
        });
        keyHandler.focus();
        return new Promise((resolve, reject) => setTimeout(() => {
            keyHandler.focus();
            writeFilePromise.then(() => resolve(page));
            // To hard to test (we'd need to find a way to make neovim fail
            // to write the file, which requires too many os-dependent side
            // effects), so don't instrument.
            /* istanbul ignore next */
            writeFilePromise.catch(() => reject());
        }, 10));
    }
    catch (e) {
        console.error(e);
        page.killEditor();
        throw e;
    }
}


/***/ }),

/***/ "./src/page.ts":
/*!*********************!*\
  !*** ./src/page.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getTabFunctions": () => (/* binding */ getTabFunctions),
/* harmony export */   "getActiveContentFunctions": () => (/* binding */ getActiveContentFunctions),
/* harmony export */   "getNeovimFrameFunctions": () => (/* binding */ getNeovimFrameFunctions),
/* harmony export */   "PageEventEmitter": () => (/* binding */ PageEventEmitter),
/* harmony export */   "getPageProxy": () => (/* binding */ getPageProxy)
/* harmony export */ });
/* harmony import */ var _EventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventEmitter */ "./src/EventEmitter.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _utils_configuration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/configuration */ "./src/utils/configuration.ts");
/* harmony import */ var _utils_keys__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/keys */ "./src/utils/keys.ts");




/////////////////////////////////////////////
// Functions running in the content script //
/////////////////////////////////////////////
function _focusInput(global, firenvim, addListener) {
    if (addListener) {
        // Only re-add event listener if input's selector matches the ones
        // that should be autonvimified
        const conf = (0,_utils_configuration__WEBPACK_IMPORTED_MODULE_2__.getConf)();
        if (conf.selector && conf.selector !== "") {
            const elems = Array.from(document.querySelectorAll(conf.selector));
            addListener = elems.includes(firenvim.getElement());
        }
    }
    firenvim.focusOriginalElement(addListener);
}
function getFocusedElement(firenvimElems) {
    return Array
        .from(firenvimElems.values())
        .find(instance => instance.isFocused());
}
// Tab functions are functions all content scripts should react to
function getTabFunctions(global) {
    return {
        getActiveInstanceCount: () => global.firenvimElems.size,
        registerNewFrameId: (frameId) => {
            global.frameIdResolve(frameId);
        },
        setDisabled: (disabled) => {
            global.disabled = disabled;
        },
        setLastFocusedContentScript: (frameId) => {
            global.lastFocusedContentScript = frameId;
        }
    };
}
function isVisible(e) {
    const rect = e.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}
// ActiveContent functions are functions only the active content script should react to
function getActiveContentFunctions(global) {
    return {
        forceNvimify: () => {
            let elem = document.activeElement;
            const isNull = elem === null || elem === undefined;
            const pageNotEditable = document.documentElement.contentEditable !== "true";
            const bodyNotEditable = (document.body.contentEditable === "false"
                || (document.body.contentEditable === "inherit"
                    && document.documentElement.contentEditable !== "true"));
            if (isNull
                || (elem === document.documentElement && pageNotEditable)
                || (elem === document.body && bodyNotEditable)) {
                elem = Array.from(document.getElementsByTagName("textarea"))
                    .find(isVisible);
                if (!elem) {
                    elem = Array.from(document.getElementsByTagName("input"))
                        .find(e => e.type === "text" && isVisible(e));
                }
                if (!elem) {
                    return;
                }
            }
            global.nvimify({ target: elem });
        },
        sendKey: (key) => {
            const firenvim = getFocusedElement(global.firenvimElems);
            if (firenvim !== undefined) {
                firenvim.sendKey(key);
            }
            else {
                // It's important to throw this error as the background script
                // will execute a fallback
                throw new Error("No firenvim frame selected");
            }
        },
    };
}
function getNeovimFrameFunctions(global) {
    return {
        evalInPage: (_, js) => (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.executeInPage)(js),
        focusInput: (frameId) => {
            let firenvimElement;
            if (frameId === undefined) {
                firenvimElement = getFocusedElement(global.firenvimElems);
            }
            else {
                firenvimElement = global.firenvimElems.get(frameId);
            }
            _focusInput(global, firenvimElement, true);
        },
        focusPage: (frameId) => {
            const firenvimElement = global.firenvimElems.get(frameId);
            firenvimElement.clearFocusListeners();
            document.activeElement.blur();
            document.documentElement.focus();
        },
        getEditorInfo: (frameId) => global
            .firenvimElems
            .get(frameId)
            .getBufferInfo(),
        getElementContent: (frameId) => global
            .firenvimElems
            .get(frameId)
            .getPageElementContent(),
        hideEditor: (frameId) => {
            window.__firenvim_mnt_elm.style.visibility = 'unset';
            const firenvim = global.firenvimElems.get(frameId);
            firenvim.hide();
            _focusInput(global, firenvim, true);
        },
        killEditor: (frameId) => {
            window.__firenvim_mnt_elm.style.visibility = 'unset';
            const firenvim = global.firenvimElems.get(frameId);
            const isFocused = firenvim.isFocused();
            firenvim.detachFromPage();
            const conf = (0,_utils_configuration__WEBPACK_IMPORTED_MODULE_2__.getConf)();
            if (isFocused) {
                _focusInput(global, firenvim, conf.takeover !== "once");
            }
            global.firenvimElems.delete(frameId);
        },
        pressKeys: (frameId, keys) => {
            global.firenvimElems.get(frameId).pressKeys((0,_utils_keys__WEBPACK_IMPORTED_MODULE_3__.keysToEvents)(keys));
        },
        resizeEditor: (frameId, width, height) => {
            const elem = global.firenvimElems.get(frameId);
            elem.resizeTo(width, height, true);
            elem.putEditorCloseToInputOriginAfterResizeFromFrame();
        },
        setElementContent: (frameId, text) => {
            return global.firenvimElems.get(frameId).setPageElementContent(text);
        },
        setElementCursor: (frameId, line, column) => {
            return global.firenvimElems.get(frameId).setPageElementCursor(line, column);
        },
    };
}
//////////////////////////////////////////////////////////////////////////////
// Definition of a proxy type that lets the frame script transparently call //
// the content script's functions                                           //
//////////////////////////////////////////////////////////////////////////////
;
class PageEventEmitter extends _EventEmitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {
    constructor() {
        super();
        browser.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
            switch (request.funcName[0]) {
                case "pause_keyhandler":
                case "frame_sendKey":
                case "resize":
                    this.emit(request.funcName[0], request.args);
                    break;
                case "get_buf_content":
                    return new Promise(resolve => this.emit(request.funcName[0], resolve));
                // default:
                //     console.error("Unhandled page request:", request);
            }
        });
    }
}
function getPageProxy(frameId) {
    const page = new PageEventEmitter();
    let funcName;
    for (funcName in getNeovimFrameFunctions({})) {
        // We need to declare func here because funcName is a global and would not
        // be captured in the closure otherwise
        const func = funcName;
        page[func] = ((...arr) => {
            return browser.runtime.sendMessage({
                args: {
                    args: [frameId].concat(arr),
                    funcName: [func],
                },
                funcName: ["messagePage"],
            });
        });
    }
    return page;
}
;


/***/ }),

/***/ "./src/renderer.ts":
/*!*************************!*\
  !*** ./src/renderer.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "events": () => (/* binding */ events),
/* harmony export */   "setCanvas": () => (/* binding */ setCanvas),
/* harmony export */   "getGlyphInfo": () => (/* binding */ getGlyphInfo),
/* harmony export */   "getLogicalSize": () => (/* binding */ getLogicalSize),
/* harmony export */   "computeGridDimensionsFor": () => (/* binding */ computeGridDimensionsFor),
/* harmony export */   "getGridCoordinates": () => (/* binding */ getGridCoordinates),
/* harmony export */   "getGridId": () => (/* binding */ getGridId),
/* harmony export */   "onRedraw": () => (/* binding */ onRedraw)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _utils_configuration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/configuration */ "./src/utils/configuration.ts");
/* harmony import */ var _EventEmitter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EventEmitter */ "./src/EventEmitter.ts");



const events = new _EventEmitter__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
let glyphCache = {};
function wipeGlyphCache() {
    glyphCache = {};
}
let metricsInvalidated = false;
function invalidateMetrics() {
    metricsInvalidated = true;
    wipeGlyphCache();
}
let fontString;
function setFontString(state, s) {
    fontString = s;
    state.context.font = fontString;
    invalidateMetrics();
}
function glyphId(char, high) {
    return char + "-" + high;
}
function setCanvasDimensions(cvs, width, height) {
    cvs.width = width * window.devicePixelRatio;
    cvs.height = height * window.devicePixelRatio;
    cvs.style.width = `${width}px`;
    cvs.style.height = `${height}px`;
}
function makeFontString(fontSize, fontFamily) {
    return `${fontSize} ${fontFamily}`;
}
let defaultFontSize = "";
const defaultFontFamily = "monospace";
let defaultFontString = "";
function setCanvas(cvs) {
    const state = globalState;
    state.canvas = cvs;
    setCanvasDimensions(state.canvas, window.innerWidth, window.innerHeight);
    defaultFontSize = window.getComputedStyle(state.canvas).fontSize;
    defaultFontString = makeFontString(defaultFontSize, defaultFontFamily);
    state.context = state.canvas.getContext("2d", { "alpha": false });
    setFontString(state, defaultFontString);
}
// We first define highlight information.
const defaultBackground = "#FFFFFF";
const defaultForeground = "#000000";
var DamageKind;
(function (DamageKind) {
    DamageKind[DamageKind["Cell"] = 0] = "Cell";
    DamageKind[DamageKind["Resize"] = 1] = "Resize";
    DamageKind[DamageKind["Scroll"] = 2] = "Scroll";
})(DamageKind || (DamageKind = {}));
const globalState = {
    canvas: undefined,
    context: undefined,
    commandLine: {
        status: "hidden",
        content: [],
        pos: 0,
        firstc: "",
        prompt: "",
        indent: 0,
        level: 0,
    },
    cursor: {
        currentGrid: 1,
        display: true,
        x: 0,
        y: 0,
        lastMove: performance.now(),
        movedSinceLastMessage: false,
    },
    gridCharacters: [],
    gridDamages: [],
    gridDamagesCount: [],
    gridHighlights: [],
    gridSizes: [],
    highlights: [newHighlight(defaultBackground, defaultForeground)],
    lastMessage: performance.now(),
    linespace: 0,
    messages: [],
    messagesPositions: [],
    mode: {
        current: 0,
        styleEnabled: false,
        modeInfo: [{
                attr_id: 0,
                attr_id_lm: 0,
                blinkoff: 0,
                blinkon: 0,
                blinkwait: 0,
                cell_percentage: 0,
                cursor_shape: "block",
                name: "normal",
            }]
    },
    ruler: undefined,
    showcmd: undefined,
    showmode: undefined,
};
function pushDamage(grid, kind, h, w, x, y) {
    const damages = globalState.gridDamages[grid];
    const count = globalState.gridDamagesCount[grid];
    if (damages.length === count) {
        damages.push({ kind, h, w, x, y });
    }
    else {
        damages[count].kind = kind;
        damages[count].h = h;
        damages[count].w = w;
        damages[count].x = x;
        damages[count].y = y;
    }
    globalState.gridDamagesCount[grid] = count + 1;
}
let maxCellWidth;
let maxCellHeight;
let maxBaselineDistance;
function recomputeCharSize(ctx) {
    // 94, K+32: we ignore the first 32 ascii chars because they're non-printable
    const chars = new Array(94)
        .fill(0)
        .map((_, k) => String.fromCharCode(k + 32))
        // Concatening Â because that's the tallest character I can think of.
        .concat(["Â"]);
    let width = 0;
    let height = 0;
    let baseline = 0;
    let measure;
    for (const char of chars) {
        measure = ctx.measureText(char);
        if (measure.width > width) {
            width = measure.width;
        }
        let tmp = Math.abs(measure.actualBoundingBoxAscent);
        if (tmp > baseline) {
            baseline = tmp;
        }
        tmp += Math.abs(measure.actualBoundingBoxDescent);
        if (tmp > height) {
            height = tmp;
        }
    }
    maxCellWidth = Math.ceil(width);
    maxCellHeight = Math.ceil(height) + globalState.linespace;
    maxBaselineDistance = baseline;
    metricsInvalidated = false;
}
function getGlyphInfo(state) {
    if (metricsInvalidated
        || maxCellWidth === undefined
        || maxCellHeight === undefined
        || maxBaselineDistance === undefined) {
        recomputeCharSize(state.context);
    }
    return [maxCellWidth, maxCellHeight, maxBaselineDistance];
}
function measureWidth(state, char) {
    const charWidth = getGlyphInfo(state)[0];
    return Math.ceil(state.context.measureText(char).width / charWidth) * charWidth;
}
function getLogicalSize() {
    const state = globalState;
    const [cellWidth, cellHeight] = getGlyphInfo(state);
    return [Math.floor(state.canvas.width / cellWidth), Math.floor(state.canvas.height / cellHeight)];
}
function computeGridDimensionsFor(width, height) {
    const [cellWidth, cellHeight] = getGlyphInfo(globalState);
    return [Math.floor(width / cellWidth), Math.floor(height / cellHeight)];
}
function getGridCoordinates(x, y) {
    const [cellWidth, cellHeight] = getGlyphInfo(globalState);
    return [Math.floor(x * window.devicePixelRatio / cellWidth), Math.floor(y * window.devicePixelRatio / cellHeight)];
}
function newHighlight(bg, fg) {
    return {
        background: bg,
        bold: undefined,
        blend: undefined,
        foreground: fg,
        italic: undefined,
        reverse: undefined,
        special: undefined,
        strikethrough: undefined,
        undercurl: undefined,
        underline: undefined,
    };
}
function getGridId() {
    return 1;
}
function getCommandLineRect(state) {
    const [width, height] = getGlyphInfo(state);
    return {
        x: width - 1,
        y: ((state.canvas.height - height - 1) / 2),
        width: (state.canvas.width - (width * 2)) + 2,
        height: height + 2,
    };
}
function damageCommandLineSpace(state) {
    const [width, height] = getGlyphInfo(state);
    const rect = getCommandLineRect(state);
    const gid = getGridId();
    const dimensions = globalState.gridSizes[gid];
    pushDamage(gid, DamageKind.Cell, Math.min(Math.ceil(rect.height / height) + 1, dimensions.height), Math.min(Math.ceil(rect.width / width) + 1, dimensions.width), Math.max(Math.floor(rect.x / width), 0), Math.max(Math.floor(rect.y / height), 0));
}
function damageMessagesSpace(state) {
    const gId = getGridId();
    const msgPos = globalState.messagesPositions[gId];
    const dimensions = globalState.gridSizes[gId];
    const [charWidth, charHeight] = getGlyphInfo(state);
    pushDamage(gId, DamageKind.Cell, Math.min(Math.ceil((state.canvas.height - msgPos.y) / charHeight) + 2, dimensions.height), Math.min(Math.ceil((state.canvas.width - msgPos.x) / charWidth) + 2, dimensions.width), Math.max(Math.floor(msgPos.x / charWidth) - 1, 0), Math.max(Math.floor(msgPos.y / charHeight) - 1, 0));
    msgPos.x = state.canvas.width;
    msgPos.y = state.canvas.height;
}
const handlers = {
    busy_start: () => {
        pushDamage(getGridId(), DamageKind.Cell, 1, 1, globalState.cursor.x, globalState.cursor.y);
        globalState.cursor.display = false;
    },
    busy_stop: () => { globalState.cursor.display = true; },
    cmdline_hide: () => {
        globalState.commandLine.status = "hidden";
        damageCommandLineSpace(globalState);
    },
    cmdline_pos: (pos, level) => {
        globalState.commandLine.pos = pos;
        globalState.commandLine.level = level;
    },
    cmdline_show: (content, pos, firstc, prompt, indent, level) => {
        globalState.commandLine.status = "shown";
        globalState.commandLine.content = content;
        globalState.commandLine.pos = pos;
        globalState.commandLine.firstc = firstc;
        globalState.commandLine.prompt = prompt;
        globalState.commandLine.indent = indent;
        globalState.commandLine.level = level;
    },
    default_colors_set: (fg, bg, sp) => {
        if (fg !== undefined && fg !== -1) {
            globalState.highlights[0].foreground = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.toHexCss)(fg);
        }
        if (bg !== undefined && bg !== -1) {
            globalState.highlights[0].background = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.toHexCss)(bg);
        }
        if (sp !== undefined && sp !== -1) {
            globalState.highlights[0].special = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.toHexCss)(sp);
        }
        const curGridSize = globalState.gridSizes[getGridId()];
        if (curGridSize !== undefined) {
            pushDamage(getGridId(), DamageKind.Cell, curGridSize.height, curGridSize.width, 0, 0);
        }
        wipeGlyphCache();
    },
    flush: () => {
        scheduleFrame();
    },
    grid_clear: (id) => {
        // glacambre: What should actually happen on grid_clear? The
        //            documentation says "clear the grid", but what does that
        //            mean? I guess the characters should be removed, but what
        //            about the highlights? Are there other things that need to
        //            be cleared?
        // bfredl: to default bg color
        //         grid_clear is not meant to be used often
        //         it is more "the terminal got screwed up, better to be safe
        //         than sorry"
        const charGrid = globalState.gridCharacters[id];
        const highGrid = globalState.gridHighlights[id];
        const dims = globalState.gridSizes[id];
        for (let j = 0; j < dims.height; ++j) {
            for (let i = 0; i < dims.width; ++i) {
                charGrid[j][i] = " ";
                highGrid[j][i] = 0;
            }
        }
        pushDamage(id, DamageKind.Cell, dims.height, dims.width, 0, 0);
    },
    grid_cursor_goto: (id, row, column) => {
        const cursor = globalState.cursor;
        pushDamage(getGridId(), DamageKind.Cell, 1, 1, cursor.x, cursor.y);
        cursor.currentGrid = id;
        cursor.x = column;
        cursor.y = row;
        cursor.lastMove = performance.now();
        cursor.movedSinceLastMessage = true;
    },
    grid_line: (id, row, col, changes) => {
        const charGrid = globalState.gridCharacters[id];
        const highlights = globalState.gridHighlights[id];
        let prevCol = col;
        let high = 0;
        for (let i = 0; i < changes.length; ++i) {
            const change = changes[i];
            const chara = change[0];
            if (change[1] !== undefined) {
                high = change[1];
            }
            const repeat = change[2] === undefined ? 1 : change[2];
            pushDamage(id, DamageKind.Cell, 1, repeat, prevCol, row);
            const limit = prevCol + repeat;
            for (let j = prevCol; j < limit; j += 1) {
                charGrid[row][j] = chara;
                highlights[row][j] = high;
            }
            prevCol = limit;
        }
    },
    grid_resize: (id, width, height) => {
        const state = globalState;
        const createGrid = state.gridCharacters[id] === undefined;
        if (createGrid) {
            state.gridCharacters[id] = [];
            state.gridCharacters[id].push([]);
            state.gridSizes[id] = { width: 0, height: 0 };
            state.gridDamages[id] = [];
            state.gridDamagesCount[id] = 0;
            state.gridHighlights[id] = [];
            state.gridHighlights[id].push([]);
            state.messagesPositions[id] = {
                x: state.canvas.width,
                y: state.canvas.height,
            };
        }
        const curGridSize = globalState.gridSizes[id];
        pushDamage(id, DamageKind.Resize, height, width, curGridSize.width, curGridSize.height);
        const highlights = globalState.gridHighlights[id];
        const charGrid = globalState.gridCharacters[id];
        if (width > charGrid[0].length) {
            for (let i = 0; i < charGrid.length; ++i) {
                const row = charGrid[i];
                const highs = highlights[i];
                while (row.length < width) {
                    row.push(" ");
                    highs.push(0);
                }
            }
        }
        if (height > charGrid.length) {
            while (charGrid.length < height) {
                charGrid.push((new Array(width)).fill(" "));
                highlights.push((new Array(width)).fill(0));
            }
        }
        pushDamage(id, DamageKind.Cell, 0, width, 0, curGridSize.height);
        curGridSize.width = width;
        curGridSize.height = height;
    },
    grid_scroll: (id, top, bot, left, right, rows, _cols) => {
        const dimensions = globalState.gridSizes[id];
        const charGrid = globalState.gridCharacters[id];
        const highGrid = globalState.gridHighlights[id];
        if (rows > 0) {
            const bottom = (bot + rows) >= dimensions.height
                ? dimensions.height - rows
                : bot;
            for (let y = top; y < bottom; ++y) {
                const srcChars = charGrid[y + rows];
                const dstChars = charGrid[y];
                const srcHighs = highGrid[y + rows];
                const dstHighs = highGrid[y];
                for (let x = left; x < right; ++x) {
                    dstChars[x] = srcChars[x];
                    dstHighs[x] = srcHighs[x];
                }
            }
            pushDamage(id, DamageKind.Cell, dimensions.height, dimensions.width, 0, 0);
        }
        else if (rows < 0) {
            for (let y = bot - 1; y >= top && (y + rows) >= 0; --y) {
                const srcChars = charGrid[y + rows];
                const dstChars = charGrid[y];
                const srcHighs = highGrid[y + rows];
                const dstHighs = highGrid[y];
                for (let x = left; x < right; ++x) {
                    dstChars[x] = srcChars[x];
                    dstHighs[x] = srcHighs[x];
                }
            }
            pushDamage(id, DamageKind.Cell, dimensions.height, dimensions.width, 0, 0);
        }
    },
    hl_attr_define: (id, rgbAttr) => {
        const highlights = globalState.highlights;
        if (highlights[id] === undefined) {
            highlights[id] = newHighlight(undefined, undefined);
        }
        highlights[id].foreground = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.toHexCss)(rgbAttr.foreground);
        highlights[id].background = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.toHexCss)(rgbAttr.background);
        highlights[id].bold = rgbAttr.bold;
        highlights[id].blend = rgbAttr.blend;
        highlights[id].italic = rgbAttr.italic;
        highlights[id].special = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.toHexCss)(rgbAttr.special);
        highlights[id].strikethrough = rgbAttr.strikethrough;
        highlights[id].undercurl = rgbAttr.undercurl;
        highlights[id].underline = rgbAttr.underline;
        highlights[id].reverse = rgbAttr.reverse;
    },
    mode_change: (_, modeIdx) => {
        globalState.mode.current = modeIdx;
        events.emit("modeChange", globalState.mode.modeInfo[modeIdx].name);
        if (globalState.mode.styleEnabled) {
            const cursor = globalState.cursor;
            pushDamage(getGridId(), DamageKind.Cell, 1, 1, cursor.x, cursor.y);
            scheduleFrame();
        }
    },
    mode_info_set: (cursorStyleEnabled, modeInfo) => {
        // Missing: handling of cell-percentage
        const mode = globalState.mode;
        mode.styleEnabled = cursorStyleEnabled;
        mode.modeInfo = modeInfo;
    },
    msg_clear: () => {
        damageMessagesSpace(globalState);
        globalState.messages.length = 0;
    },
    msg_history_show: (entries) => {
        damageMessagesSpace(globalState);
        globalState.messages = entries.map(([, b]) => b);
    },
    msg_ruler: (content) => {
        damageMessagesSpace(globalState);
        globalState.ruler = content;
    },
    msg_show: (_, content, replaceLast) => {
        damageMessagesSpace(globalState);
        if (replaceLast) {
            globalState.messages.length = 0;
        }
        globalState.messages.push(content);
        globalState.lastMessage = performance.now();
        globalState.cursor.movedSinceLastMessage = false;
    },
    msg_showcmd: (content) => {
        damageMessagesSpace(globalState);
        globalState.showcmd = content;
    },
    msg_showmode: (content) => {
        damageMessagesSpace(globalState);
        globalState.showmode = content;
    },
    option_set: (option, value) => {
        const state = globalState;
        switch (option) {
            case "guifont":
                {
                    let newFontString;
                    if (value === "") {
                        newFontString = defaultFontString;
                    }
                    else {
                        const guifont = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseGuifont)(value, {
                            "font-family": defaultFontFamily,
                            "font-size": defaultFontSize,
                        });
                        newFontString = makeFontString(guifont["font-size"], guifont["font-family"]);
                    }
                    if (newFontString === fontString) {
                        break;
                    }
                    setFontString(state, newFontString);
                    const [charWidth, charHeight] = getGlyphInfo(state);
                    events.emit("resize", {
                        grid: getGridId(),
                        width: Math.floor(state.canvas.width / charWidth),
                        height: Math.floor(state.canvas.height / charHeight),
                    });
                }
                break;
            case "linespace":
                {
                    if (state.linespace === value) {
                        break;
                    }
                    state.linespace = value;
                    invalidateMetrics();
                    const [charWidth, charHeight] = getGlyphInfo(state);
                    const gid = getGridId();
                    const curGridSize = state.gridSizes[gid];
                    if (curGridSize !== undefined) {
                        pushDamage(getGridId(), DamageKind.Cell, curGridSize.height, curGridSize.width, 0, 0);
                    }
                    events.emit("resize", {
                        grid: gid,
                        width: Math.floor(state.canvas.width / charWidth),
                        height: Math.floor(state.canvas.height / charHeight),
                    });
                }
                break;
        }
    },
};
// keep track of whether a frame is already being scheduled or not. This avoids
// asking for multiple frames where we'd paint the same thing anyway.
let frameScheduled = false;
function scheduleFrame() {
    if (!frameScheduled) {
        frameScheduled = true;
        window.requestAnimationFrame(paint);
    }
}
function paintMessages(state) {
    const ctx = state.context;
    const gId = getGridId();
    const messagesPosition = state.messagesPositions[gId];
    const [, charHeight, baseline] = getGlyphInfo(state);
    const messages = state.messages;
    // we need to know the size of the message box in order to draw its border
    // and background. The algorithm to compute this is equivalent to drawing
    // all messages. So we put the drawing algorithm in a function with a
    // boolean argument that will control whether text should actually be
    // drawn. This lets us run the algorithm once to get the dimensions and
    // then again to actually draw text.
    function renderMessages(draw) {
        let renderedX = state.canvas.width;
        let renderedY = state.canvas.height - charHeight + baseline;
        for (let i = messages.length - 1; i >= 0; --i) {
            const message = messages[i];
            for (let j = message.length - 1; j >= 0; --j) {
                const chars = Array.from(message[j][1]);
                for (let k = chars.length - 1; k >= 0; --k) {
                    const char = chars[k];
                    const measuredWidth = measureWidth(state, char);
                    if (renderedX - measuredWidth < 0) {
                        if (renderedY - charHeight < 0) {
                            return;
                        }
                        renderedX = state.canvas.width;
                        renderedY = renderedY - charHeight;
                    }
                    renderedX = renderedX - measuredWidth;
                    if (draw) {
                        ctx.fillText(char, renderedX, renderedY);
                    }
                    if (renderedX < messagesPosition.x) {
                        messagesPosition.x = renderedX;
                    }
                    if (renderedY < messagesPosition.y) {
                        messagesPosition.y = renderedY - baseline;
                    }
                }
            }
            renderedX = state.canvas.width;
            renderedY = renderedY - charHeight;
        }
    }
    renderMessages(false);
    ctx.fillStyle = state.highlights[0].foreground;
    ctx.fillRect(messagesPosition.x - 2, messagesPosition.y - 2, state.canvas.width - messagesPosition.x + 2, state.canvas.height - messagesPosition.y + 2);
    ctx.fillStyle = state.highlights[0].background;
    ctx.fillRect(messagesPosition.x - 1, messagesPosition.y - 1, state.canvas.width - messagesPosition.x + 1, state.canvas.height - messagesPosition.y + 1);
    ctx.fillStyle = state.highlights[0].foreground;
    renderMessages(true);
}
function paintCommandlineWindow(state) {
    const ctx = state.context;
    const [charWidth, charHeight, baseline] = getGlyphInfo(state);
    const commandLine = state.commandLine;
    const rect = getCommandLineRect(state);
    // outer rectangle
    ctx.fillStyle = state.highlights[0].foreground;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    // inner rectangle
    rect.x += 1;
    rect.y += 1;
    rect.width -= 2;
    rect.height -= 2;
    ctx.fillStyle = state.highlights[0].background;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    // padding of inner rectangle
    rect.x += 1;
    rect.y += 1;
    rect.width -= 2;
    rect.height -= 2;
    // Position where text should be drawn
    let x = rect.x;
    const y = rect.y;
    // first character
    ctx.fillStyle = state.highlights[0].foreground;
    ctx.fillText(commandLine.firstc, x, y + baseline);
    x += charWidth;
    rect.width -= charWidth;
    const encoder = new TextEncoder();
    // reduce the commandline's content to a string for iteration
    const str = commandLine.content.reduce((r, segment) => r + segment[1], "");
    // Array.from(str) will return an array whose cells are grapheme
    // clusters. It is important to iterate over graphemes instead of the
    // string because iterating over the string would sometimes yield only
    // half of the UTF-16 character/surrogate pair.
    const characters = Array.from(str);
    // renderedI is the horizontal pixel position where the next character
    // should be drawn
    let renderedI = 0;
    // encodedI is the number of bytes that have been iterated over thus
    // far. It is used to find out where to draw the cursor. Indeed, neovim
    // sends the cursor's position as a byte position within the UTF-8
    // encoded commandline string.
    let encodedI = 0;
    // cursorX is the horizontal pixel position where the cursor should be
    // drawn.
    let cursorX = 0;
    // The index of the first character of `characters` that can be drawn.
    // It is higher than 0 when the command line string is too long to be
    // entirely displayed.
    let sliceStart = 0;
    // The index of the last character of `characters` that can be drawn.
    // It is different from characters.length when the command line string
    // is too long to be entirely displayed.
    let sliceEnd = 0;
    // The horizontal width in pixels taken by the displayed slice. It
    // is used to keep track of whether the commandline string is longer
    // than the commandline window.
    let sliceWidth = 0;
    // cursorDisplayed keeps track of whether the cursor can be displayed
    // in the slice.
    let cursorDisplayed = commandLine.pos === 0;
    // description of the algorithm:
    // For each character, find out its width. If it cannot fit in the
    // command line window along with the rest of the slice and the cursor
    // hasn't been found yet, remove characters from the beginning of the
    // slice until the character fits.
    // Stop either when all characters are in the slice or when the cursor
    // can be displayed and the slice takes all available width.
    for (let i = 0; i < characters.length; ++i) {
        sliceEnd = i;
        const char = characters[i];
        const cWidth = measureWidth(state, char);
        renderedI += cWidth;
        sliceWidth += cWidth;
        if (sliceWidth > rect.width) {
            if (cursorDisplayed) {
                break;
            }
            do {
                const removedChar = characters[sliceStart];
                const removedWidth = measureWidth(state, removedChar);
                renderedI -= removedWidth;
                sliceWidth -= removedWidth;
                sliceStart += 1;
            } while (sliceWidth > rect.width);
        }
        encodedI += encoder.encode(char).length;
        if (encodedI === commandLine.pos) {
            cursorX = renderedI;
            cursorDisplayed = true;
        }
    }
    if (characters.length > 0) {
        renderedI = 0;
        for (let i = sliceStart; i <= sliceEnd; ++i) {
            const char = characters[i];
            ctx.fillText(char, x + renderedI, y + baseline);
            renderedI += measureWidth(state, char);
        }
    }
    ctx.fillRect(x + cursorX, y, 1, charHeight);
}
function paint(_) {
    frameScheduled = false;
    const state = globalState;
    const canvas = state.canvas;
    const context = state.context;
    const gid = getGridId();
    const charactersGrid = state.gridCharacters[gid];
    const highlightsGrid = state.gridHighlights[gid];
    const damages = state.gridDamages[gid];
    const damageCount = state.gridDamagesCount[gid];
    const highlights = state.highlights;
    const [charWidth, charHeight, baseline] = getGlyphInfo(state);
    for (let i = 0; i < damageCount; ++i) {
        const damage = damages[i];
        switch (damage.kind) {
            case DamageKind.Resize:
                {
                    const pixelWidth = damage.w * charWidth / window.devicePixelRatio;
                    const pixelHeight = damage.h * charHeight / window.devicePixelRatio;
                    events.emit("frameResize", { width: pixelWidth, height: pixelHeight });
                    setCanvasDimensions(canvas, pixelWidth, pixelHeight);
                    // Note: changing width and height resets font, so we have to
                    // set it again. Who thought this was a good idea???
                    context.font = fontString;
                }
                break;
            case DamageKind.Scroll:
            case DamageKind.Cell:
                for (let y = damage.y; y < damage.y + damage.h && y < charactersGrid.length; ++y) {
                    const row = charactersGrid[y];
                    const rowHigh = highlightsGrid[y];
                    const pixelY = y * charHeight;
                    for (let x = damage.x; x < damage.x + damage.w && x < row.length; ++x) {
                        if (row[x] === "") {
                            continue;
                        }
                        const pixelX = x * charWidth;
                        const id = glyphId(row[x], rowHigh[x]);
                        if (glyphCache[id] === undefined) {
                            const cellHigh = highlights[rowHigh[x]];
                            const width = Math.ceil(measureWidth(state, row[x]) / charWidth) * charWidth;
                            let background = cellHigh.background || highlights[0].background;
                            let foreground = cellHigh.foreground || highlights[0].foreground;
                            if (cellHigh.reverse) {
                                const tmp = background;
                                background = foreground;
                                foreground = tmp;
                            }
                            context.fillStyle = background;
                            context.fillRect(pixelX, pixelY, width, charHeight);
                            context.fillStyle = foreground;
                            let fontStr = "";
                            let changeFont = false;
                            if (cellHigh.bold) {
                                fontStr += " bold ";
                                changeFont = true;
                            }
                            if (cellHigh.italic) {
                                fontStr += " italic ";
                                changeFont = true;
                            }
                            if (changeFont) {
                                context.font = fontStr + fontString;
                            }
                            context.fillText(row[x], pixelX, pixelY + baseline);
                            if (changeFont) {
                                context.font = fontString;
                            }
                            if (cellHigh.strikethrough) {
                                context.fillRect(pixelX, pixelY + baseline / 2, width, 1);
                            }
                            context.fillStyle = cellHigh.special;
                            const baselineHeight = (charHeight - baseline);
                            if (cellHigh.underline) {
                                const linepos = baselineHeight * 0.3;
                                context.fillRect(pixelX, pixelY + baseline + linepos, width, 1);
                            }
                            if (cellHigh.undercurl) {
                                const curlpos = baselineHeight * 0.6;
                                for (let abscissa = pixelX; abscissa < pixelX + width; ++abscissa) {
                                    context.fillRect(abscissa, pixelY + baseline + curlpos + Math.cos(abscissa), 1, 1);
                                }
                            }
                            // reason for the check: we can't retrieve pixels
                            // drawn outside the viewport
                            if (pixelX >= 0
                                && pixelY >= 0
                                && (pixelX + width < canvas.width)
                                && (pixelY + charHeight < canvas.height)
                                && width > 0 && charHeight > 0) {
                                glyphCache[id] = context.getImageData(pixelX, pixelY, width, charHeight);
                            }
                        }
                        else {
                            context.putImageData(glyphCache[id], pixelX, pixelY);
                        }
                    }
                }
                break;
        }
    }
    if (state.messages.length > 0) {
        paintMessages(state);
    }
    // If the command line is shown, the cursor's in it
    if (state.commandLine.status === "shown") {
        paintCommandlineWindow(state);
    }
    else if (state.cursor.display) {
        const cursor = state.cursor;
        if (cursor.currentGrid === gid) {
            // Missing: handling of cell-percentage
            const mode = state.mode;
            const info = mode.styleEnabled
                ? mode.modeInfo[mode.current]
                : mode.modeInfo[0];
            const shouldBlink = (info.blinkwait > 0 && info.blinkon > 0 && info.blinkoff > 0);
            // Decide color. As described in the doc, if attr_id is 0 colors
            // should be reverted.
            let background = highlights[info.attr_id].background;
            let foreground = highlights[info.attr_id].foreground;
            if (info.attr_id === 0) {
                const tmp = background;
                background = foreground;
                foreground = tmp;
            }
            // Decide cursor shape. Default to block, change to
            // vertical/horizontal if needed.
            const cursorWidth = cursor.x * charWidth;
            let cursorHeight = cursor.y * charHeight;
            let width = charWidth;
            let height = charHeight;
            if (info.cursor_shape === "vertical") {
                width = 1;
            }
            else if (info.cursor_shape === "horizontal") {
                cursorHeight += charHeight - 2;
                height = 1;
            }
            const now = performance.now();
            // Decide if the cursor should be inverted. This only happens if
            // blinking is on, we've waited blinkwait time and we're in the
            // "blinkoff" time slot.
            const blinkOff = shouldBlink
                && (now - info.blinkwait > cursor.lastMove)
                && ((now % (info.blinkon + info.blinkoff)) > info.blinkon);
            if (blinkOff) {
                const high = highlights[highlightsGrid[cursor.y][cursor.x]];
                background = high.background;
                foreground = high.foreground;
            }
            // Finally draw cursor
            context.fillStyle = background;
            context.fillRect(cursorWidth, cursorHeight, width, height);
            if (info.cursor_shape === "block") {
                context.fillStyle = foreground;
                const char = charactersGrid[cursor.y][cursor.x];
                context.fillText(char, cursor.x * charWidth, cursor.y * charHeight + baseline);
            }
            if (shouldBlink) {
                // if the cursor should blink, we need to paint continuously
                const relativeNow = performance.now() % (info.blinkon + info.blinkoff);
                const nextPaint = relativeNow < info.blinkon
                    ? info.blinkon - relativeNow
                    : info.blinkoff - (relativeNow - info.blinkon);
                setTimeout(scheduleFrame, nextPaint);
            }
        }
    }
    state.gridDamagesCount[gid] = 0;
}
let cmdlineTimeout = 3000;
_utils_configuration__WEBPACK_IMPORTED_MODULE_1__.confReady.then(() => cmdlineTimeout = (0,_utils_configuration__WEBPACK_IMPORTED_MODULE_1__.getGlobalConf)().cmdlineTimeout);
function onRedraw(events) {
    for (let i = 0; i < events.length; ++i) {
        const event = events[i];
        const handler = handlers[event[0]];
        if (handler !== undefined) {
            for (let j = 1; j < event.length; ++j) {
                handler.apply(globalState, event[j]);
            }
        }
        else {
            // console.error(`${event[0]} is not implemented.`);
        }
    }
    if (performance.now() - globalState.lastMessage > cmdlineTimeout && globalState.cursor.movedSinceLastMessage) {
        handlers["msg_clear"]();
    }
}


/***/ }),

/***/ "./src/utils/configuration.ts":
/*!************************************!*\
  !*** ./src/utils/configuration.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mergeWithDefaults": () => (/* binding */ mergeWithDefaults),
/* harmony export */   "confReady": () => (/* binding */ confReady),
/* harmony export */   "getGlobalConf": () => (/* binding */ getGlobalConf),
/* harmony export */   "getConf": () => (/* binding */ getConf),
/* harmony export */   "getConfForUrl": () => (/* binding */ getConfForUrl)
/* harmony export */ });
let conf = undefined;
function mergeWithDefaults(os, settings) {
    function makeDefaults(obj, name, value) {
        if (obj[name] === undefined) {
            obj[name] = value;
        }
    }
    function makeDefaultLocalSetting(sett, site, obj) {
        makeDefaults(sett.localSettings, site, {});
        for (const key of Object.keys(obj)) {
            makeDefaults(sett.localSettings[site], key, obj[key]);
        }
    }
    if (settings === undefined) {
        settings = {};
    }
    makeDefaults(settings, "globalSettings", {});
    // "<KEY>": "default" | "noop"
    // #103: When using the browser's command API to allow sending `<C-w>` to
    // firenvim, whether the default action should be performed if no neovim
    // frame is focused.
    makeDefaults(settings.globalSettings, "<C-n>", "default");
    makeDefaults(settings.globalSettings, "<C-t>", "default");
    makeDefaults(settings.globalSettings, "<C-w>", "default");
    // Note: <CS-*> are currently disabled because of
    // https://github.com/neovim/neovim/issues/12037
    // Note: <CS-n> doesn't match the default behavior on firefox because this
    // would require the sessions API. Instead, Firefox's behavior matches
    // Chrome's.
    makeDefaults(settings.globalSettings, "<CS-n>", "default");
    // Note: <CS-t> is there for completeness sake's but can't be emulated in
    // Chrome and Firefox because this would require the sessions API.
    makeDefaults(settings.globalSettings, "<CS-t>", "default");
    makeDefaults(settings.globalSettings, "<CS-w>", "default");
    // #717: allow passing keys to the browser
    makeDefaults(settings.globalSettings, "ignoreKeys", {});
    // #1050: cursor sometimes covered by command line
    makeDefaults(settings.globalSettings, "cmdlineTimeout", 3000);
    // "alt": "all" | "alphanum"
    // #202: Only register alt key on alphanums to let swedish osx users type
    //       special chars
    // Only tested on OSX, where we don't pull coverage reports, so don't
    // instrument function.
    /* istanbul ignore next */
    if (os === "mac") {
        makeDefaults(settings.globalSettings, "alt", "alphanum");
    }
    else {
        makeDefaults(settings.globalSettings, "alt", "all");
    }
    makeDefaults(settings, "localSettings", {});
    makeDefaultLocalSetting(settings, ".*", {
        // "cmdline": "neovim" | "firenvim"
        // #168: Use an external commandline to preserve space
        cmdline: "firenvim",
        content: "text",
        priority: 0,
        renderer: "canvas",
        selector: 'textarea:not([readonly]), div[role="textbox"]',
        // "takeover": "always" | "once" | "empty" | "nonempty" | "never"
        // #265: On "once", don't automatically bring back after :q'ing it
        takeover: "always",
        filename: "{hostname%32}_{pathname%32}_{selector%32}_{timestamp%32}.{extension}",
    });
    makeDefaultLocalSetting(settings, "about:blank\\?compose", {
        cmdline: "firenvim",
        content: "text",
        priority: 1,
        renderer: "canvas",
        selector: 'body',
        takeover: "always",
        filename: "mail_{timestamp%32}.eml",
    });
    return settings;
}
const confReady = new Promise(resolve => {
    browser.storage.local.get().then((obj) => {
        conf = obj;
        resolve(true);
    });
});
browser.storage.onChanged.addListener((changes) => {
    Object
        .entries(changes)
        .forEach(([key, value]) => confReady.then(() => {
        conf[key] = value.newValue;
    }));
});
function getGlobalConf() {
    // Can't be tested for
    /* istanbul ignore next */
    if (conf === undefined) {
        throw new Error("getGlobalConf called before config was ready");
    }
    return conf.globalSettings;
}
function getConf() {
    return getConfForUrl(document.location.href);
}
function getConfForUrl(url) {
    const localSettings = conf.localSettings;
    function or1(val) {
        if (val === undefined) {
            return 1;
        }
        return val;
    }
    // Can't be tested for
    /* istanbul ignore next */
    if (localSettings === undefined) {
        throw new Error("Error: your settings are undefined. Try reloading the page. If this error persists, try the troubleshooting guide: https://github.com/glacambre/firenvim/blob/master/TROUBLESHOOTING.md");
    }
    return Array.from(Object.entries(localSettings))
        .filter(([pat, _]) => (new RegExp(pat)).test(url))
        .sort((e1, e2) => (or1(e1[1].priority) - or1(e2[1].priority)))
        .reduce((acc, [_, cur]) => Object.assign(acc, cur), {});
}


/***/ }),

/***/ "./src/utils/keys.ts":
/*!***************************!*\
  !*** ./src/utils/keys.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "nonLiteralKeys": () => (/* binding */ nonLiteralKeys),
/* harmony export */   "keysToEvents": () => (/* binding */ keysToEvents),
/* harmony export */   "translateKey": () => (/* binding */ translateKey),
/* harmony export */   "addModifier": () => (/* binding */ addModifier)
/* harmony export */ });
const nonLiteralKeys = {
    " ": "<Space>",
    "<": "<lt>",
    "ArrowDown": "<Down>",
    "ArrowLeft": "<Left>",
    "ArrowRight": "<Right>",
    "ArrowUp": "<Up>",
    "Backspace": "<BS>",
    "Delete": "<Del>",
    "End": "<End>",
    "Enter": "<CR>",
    "Escape": "<Esc>",
    "F1": "<F1>",
    "F10": "<F10>",
    "F11": "<F11>",
    "F12": "<F12>",
    "F13": "<F13>",
    "F14": "<F14>",
    "F15": "<F15>",
    "F16": "<F16>",
    "F17": "<F17>",
    "F18": "<F18>",
    "F19": "<F19>",
    "F2": "<F2>",
    "F20": "<F20>",
    "F21": "<F21>",
    "F22": "<F22>",
    "F23": "<F23>",
    "F24": "<F24>",
    "F3": "<F3>",
    "F4": "<F4>",
    "F5": "<F5>",
    "F6": "<F6>",
    "F7": "<F7>",
    "F8": "<F8>",
    "F9": "<F9>",
    "Home": "<Home>",
    "PageDown": "<PageDown>",
    "PageUp": "<PageUp>",
    "Tab": "<Tab>",
    "\\": "<Bslash>",
    "|": "<Bar>",
};
const nonLiteralVimKeys = Object.fromEntries(Object
    .entries(nonLiteralKeys)
    .map(([x, y]) => [y, x]));
const nonLiteralKeyCodes = {
    "Enter": 13,
    "Space": 32,
    "Tab": 9,
    "Delete": 46,
    "End": 35,
    "Home": 36,
    "Insert": 45,
    "PageDown": 34,
    "PageUp": 33,
    "ArrowDown": 40,
    "ArrowLeft": 37,
    "ArrowRight": 39,
    "ArrowUp": 38,
    "Escape": 27,
};
// Given a "special" key representation (e.g. <Enter> or <M-l>), returns an
// array of three javascript keyevents, the first one representing the
// corresponding keydown, the second one a keypress and the third one a keyup
// event.
function modKeyToEvents(k) {
    let mods = "";
    let key = nonLiteralVimKeys[k];
    let ctrlKey = false;
    let altKey = false;
    let shiftKey = false;
    if (key === undefined) {
        const arr = k.slice(1, -1).split("-");
        mods = arr[0];
        key = arr[1];
        ctrlKey = /c/i.test(mods);
        altKey = /a/i.test(mods);
        const specialChar = "<" + key + ">";
        if (nonLiteralVimKeys[specialChar] !== undefined) {
            key = nonLiteralVimKeys[specialChar];
            shiftKey = false;
        }
        else {
            shiftKey = key !== key.toLocaleLowerCase();
        }
    }
    // Some pages rely on keyCodes to figure out what key was pressed. This is
    // awful because keycodes aren't guaranteed to be the same acrross
    // browsers/OS/keyboard layouts but try to do the right thing anyway.
    // https://github.com/glacambre/firenvim/issues/723
    let keyCode = 0;
    if (/^[a-zA-Z0-9]$/.test(key)) {
        keyCode = key.charCodeAt(0);
    }
    else if (nonLiteralKeyCodes[key] !== undefined) {
        keyCode = nonLiteralKeyCodes[key];
    }
    const init = { key, keyCode, ctrlKey, altKey, shiftKey, bubbles: true };
    return [
        new KeyboardEvent("keydown", init),
        new KeyboardEvent("keypress", init),
        new KeyboardEvent("keyup", init),
    ];
}
// Given a "simple" key (e.g. `a`, `1`…), returns an array of three javascript
// events representing the action of pressing the key.
function keyToEvents(key) {
    const shiftKey = key !== key.toLocaleLowerCase();
    return [
        new KeyboardEvent("keydown", { key, shiftKey, bubbles: true }),
        new KeyboardEvent("keypress", { key, shiftKey, bubbles: true }),
        new KeyboardEvent("keyup", { key, shiftKey, bubbles: true }),
    ];
}
// Given an array of string representation of keys (e.g. ["a", "<Enter>", …]),
// returns an array of javascript keyboard events that simulate these keys
// being pressed.
function keysToEvents(keys) {
    // Code to split mod keys and non-mod keys:
    // const keys = str.match(/([<>][^<>]+[<>])|([^<>]+)/g)
    // if (keys === null) {
    //     return [];
    // }
    return keys.map((key) => {
        if (key[0] === "<") {
            return modKeyToEvents(key);
        }
        return keyToEvents(key);
    }).flat();
}
// Turns a non-literal key (e.g. "Enter") into a vim-equivalent "<Enter>"
function translateKey(key) {
    if (nonLiteralKeys[key] !== undefined) {
        return nonLiteralKeys[key];
    }
    return key;
}
// Add modifier `mod` (`A`, `C`, `S`…) to `text` (a vim key `b`, `<Enter>`,
// `<CS-x>`…)
function addModifier(mod, text) {
    let match;
    let modifiers = "";
    let key = "";
    if ((match = text.match(/^<([A-Z]{1,5})-(.+)>$/))) {
        modifiers = match[1];
        key = match[2];
    }
    else if ((match = text.match(/^<(.+)>$/))) {
        key = match[1];
    }
    else {
        key = text;
    }
    return "<" + mod + modifiers + "-" + key + ">";
}


/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isChrome": () => (/* binding */ isChrome),
/* harmony export */   "isThunderbird": () => (/* binding */ isThunderbird),
/* harmony export */   "executeInPage": () => (/* binding */ executeInPage),
/* harmony export */   "getIconImageData": () => (/* binding */ getIconImageData),
/* harmony export */   "toFileName": () => (/* binding */ toFileName),
/* harmony export */   "languageToExtensions": () => (/* binding */ languageToExtensions),
/* harmony export */   "parseSingleGuifont": () => (/* binding */ parseSingleGuifont),
/* harmony export */   "parseGuifont": () => (/* binding */ parseGuifont),
/* harmony export */   "computeSelector": () => (/* binding */ computeSelector),
/* harmony export */   "toHexCss": () => (/* binding */ toHexCss)
/* harmony export */ });
let curHost;
// Can't get coverage for thunderbird.
/* istanbul ignore next */
if (browser.composeScripts !== undefined || document.location.href === "about:blank?compose") {
    curHost = "thunderbird";
    // Chrome doesn't have a "browser" object, instead it uses "chrome".
}
else if (window.location.protocol === "moz-extension:") {
    curHost = "firefox";
}
else if (window.location.protocol === "chrome-extension:") {
    curHost = "chrome";
}
// Only usable in background script!
function isChrome() {
    // Can't cover error condition
    /* istanbul ignore next */
    if (curHost === undefined) {
        throw Error("Used isChrome in content script!");
    }
    return curHost === "chrome";
}
function isThunderbird() {
    // Can't cover error condition
    /* istanbul ignore next */
    if (curHost === undefined) {
        throw Error("Used isThunderbird in content script!");
    }
    return curHost === "thunderbird";
}
// Runs CODE in the page's context by setting up a custom event listener,
// embedding a script element that runs the piece of code and emits its result
// as an event.
function executeInPage(code) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        const eventId = (new URL(browser.runtime.getURL(""))).hostname + Math.random();
        script.innerHTML = `(async (evId) => {
            try {
                let result;
                result = await ${code};
                window.dispatchEvent(new CustomEvent(evId, {
                    detail: {
                        success: true,
                        result,
                    }
                }));
            } catch (e) {
                window.dispatchEvent(new CustomEvent(evId, {
                    detail: { success: false, reason: e },
                }));
            }
        })(${JSON.stringify(eventId)})`;
        window.addEventListener(eventId, ({ detail }) => {
            script.parentNode.removeChild(script);
            if (detail.success) {
                return resolve(detail.result);
            }
            return reject(detail.reason);
        }, { once: true });
        document.head.appendChild(script);
    });
}
// Various filters that are used to change the appearance of the BrowserAction
// icon.
const svgpath = "firenvim.svg";
const transformations = {
    disabled: (img) => {
        for (let i = 0; i < img.length; i += 4) {
            // Skip transparent pixels
            if (img[i + 3] === 0) {
                continue;
            }
            const mean = Math.floor((img[i] + img[i + 1] + img[i + 2]) / 3);
            img[i] = mean;
            img[i + 1] = mean;
            img[i + 2] = mean;
        }
    },
    error: (img) => {
        for (let i = 0; i < img.length; i += 4) {
            // Turn transparent pixels red
            if (img[i + 3] === 0) {
                img[i] = 255;
                img[i + 3] = 255;
            }
        }
    },
    normal: ((_img) => undefined),
    notification: (img) => {
        for (let i = 0; i < img.length; i += 4) {
            // Turn transparent pixels yellow
            if (img[i + 3] === 0) {
                img[i] = 255;
                img[i + 1] = 255;
                img[i + 3] = 255;
            }
        }
    },
};
// Takes an icon kind and dimensions as parameter, draws that to a canvas and
// returns a promise that will be resolved with the canvas' image data.
function getIconImageData(kind, width = 32, height = 32) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image(width, height);
    const result = new Promise((resolve) => img.addEventListener("load", () => {
        ctx.drawImage(img, 0, 0, width, height);
        const id = ctx.getImageData(0, 0, width, height);
        transformations[kind](id.data);
        resolve(id);
    }));
    img.src = svgpath;
    return result;
}
// Given a url and a selector, tries to compute a name that will be unique,
// short and readable for the user.
function toFileName(formatString, url, id, language) {
    let parsedURL;
    try {
        parsedURL = new URL(url);
    }
    catch (e) {
        // Only happens with thunderbird, where we can't get coverage
        /* istanbul ignore next */
        parsedURL = { hostname: 'thunderbird', pathname: 'mail' };
    }
    const sanitize = (s) => (s.match(/[a-zA-Z0-9]+/g) || []).join("-");
    const expand = (pattern) => {
        const noBrackets = pattern.slice(1, -1);
        const [symbol, length] = noBrackets.split("%");
        let value = "";
        switch (symbol) {
            case "hostname":
                value = parsedURL.hostname;
                break;
            case "pathname":
                value = sanitize(parsedURL.pathname);
                break;
            case "selector":
                value = sanitize(id.replace(/:nth-of-type/g, ""));
                break;
            case "timestamp":
                value = sanitize((new Date()).toISOString());
                break;
            case "extension":
                value = languageToExtensions(language);
                break;
            default: console.error(`Unrecognized filename pattern: ${pattern}`);
        }
        return value.slice(-length);
    };
    let result = formatString;
    const matches = formatString.match(/{[^}]*}/g);
    if (matches !== null) {
        for (const match of matches.filter(s => s !== undefined)) {
            result = result.replace(match, expand(match));
        }
    }
    return result;
}
// Given a language name, returns a filename extension. Can return undefined.
function languageToExtensions(language) {
    // if (language === undefined || language === null) {
    //     language = "";
    // }
    // const lang = language.toLowerCase();
    // /* istanbul ignore next */
    // switch (lang) {
    //     case "apl":              return "apl";
    //     case "brainfuck":        return "bf";
    //     case "c":                return "c";
    //     case "c#":               return "cs";
    //     case "c++":              return "cpp";
    //     case "ceylon":           return "ceylon";
    //     case "clike":            return "c";
    //     case "clojure":          return "clj";
    //     case "cmake":            return ".cmake";
    //     case "cobol":            return "cbl";
    //     case "coffeescript":     return "coffee";
    //     case "commonlisp":      return "lisp";
    //     case "crystal":          return "cr";
    //     case "css":              return "css";
    //     case "cython":           return "py";
    //     case "d":                return "d";
    //     case "dart":             return "dart";
    //     case "diff":             return "diff";
    //     case "dockerfile":       return "dockerfile";
    //     case "dtd":              return "dtd";
    //     case "dylan":            return "dylan";
    //     // Eiffel was there first but elixir seems more likely
    //     // case "eiffel":           return "e";
    //     case "elixir":           return "e";
    //     case "elm":              return "elm";
    //     case "erlang":           return "erl";
    //     case "f#":               return "fs";
    //     case "factor":           return "factor";
    //     case "forth":            return "fth";
    //     case "fortran":          return "f90";
    //     case "gas":              return "asm";
    //     case "go":               return "go";
    //     // GFM: CodeMirror's github-flavored markdown
    //     case "gfm":              return "md";
    //     case "groovy":           return "groovy";
    //     case "haml":             return "haml";
    //     case "handlebars":       return "hbs";
    //     case "haskell":          return "hs";
    //     case "haxe":             return "hx";
    //     case "html":             return "html";
    //     case "htmlembedded":     return "html";
    //     case "htmlmixed":        return "html";
    //     case "ipython":          return "py";
    //     case "ipythonfm":        return "md";
    //     case "java":             return "java";
    //     case "javascript":       return "js";
    //     case "jinja2":           return "jinja";
    //     case "julia":            return "jl";
    //     case "jsx":              return "jsx";
    //     case "kotlin":           return "kt";
    //     case "latex":            return "latex";
    //     case "less":             return "less";
    //     case "lua":              return "lua";
    //     case "markdown":         return "md";
    //     case "mllike":            return "ml";
    //     case "ocaml":            return "ml";
    //     case "octave":           return "m";
    //     case "pascal":           return "pas";
    //     case "perl":             return "pl";
    //     case "php":              return "php";
    //     case "powershell":       return "ps1";
    //     case "python":           return "py";
    //     case "r":                return "r";
    //     case "rst":              return "rst";
    //     case "ruby":             return "ruby";
    //     case "rust":             return "rs";
    //     case "sas":              return "sas";
    //     case "sass":             return "sass";
    //     case "scala":            return "scala";
    //     case "scheme":           return "scm";
    //     case "scss":             return "scss";
    //     case "smalltalk":        return "st";
    //     case "shell":            return "sh";
    //     case "sql":              return "sql";
    //     case "stex":             return "latex";
    //     case "swift":            return "swift";
    //     case "tcl":              return "tcl";
    //     case "toml":             return "toml";
    //     case "twig":             return "twig";
    //     case "typescript":       return "ts";
    //     case "vb":               return "vb";
    //     case "vbscript":         return "vbs";
    //     case "verilog":          return "sv";
    //     case "vhdl":             return "vhdl";
    //     case "xml":              return "xml";
    //     case "yaml":             return "yaml";
    //     case "z80":              return "z8a";
    // }
    return "txt";
}
// Make tslint happy
const fontFamily = "font-family";
// Can't be tested e2e :/
/* istanbul ignore next */
function parseSingleGuifont(guifont, defaults) {
    const options = guifont.split(":");
    const result = Object.assign({}, defaults);
    if (/^[a-zA-Z0-9]+$/.test(options[0])) {
        result[fontFamily] = options[0];
    }
    else {
        result[fontFamily] = JSON.stringify(options[0]);
    }
    if (defaults[fontFamily]) {
        result[fontFamily] += `, ${defaults[fontFamily]}`;
    }
    return options.slice(1).reduce((acc, option) => {
        switch (option[0]) {
            case "h":
                acc["font-size"] = `${option.slice(1)}pt`;
                break;
            case "b":
                acc["font-weight"] = "bold";
                break;
            case "i":
                acc["font-style"] = "italic";
                break;
            case "u":
                acc["text-decoration"] = "underline";
                break;
            case "s":
                acc["text-decoration"] = "line-through";
                break;
            case "w": // Can't set font width. Would have to adjust cell width.
            case "c": // Can't set character set
                break;
        }
        return acc;
    }, result);
}
;
// Parses a guifont declaration as described in `:h E244`
// defaults: default value for each of.
// Can't be tested e2e :/
/* istanbul ignore next */
function parseGuifont(guifont, defaults) {
    const fonts = guifont.split(",").reverse();
    return fonts.reduce((acc, cur) => parseSingleGuifont(cur, acc), defaults);
}
// Computes a unique selector for its argument.
function computeSelector(element) {
    function uniqueSelector(e) {
        // Only matching alphanumeric selectors because others chars might have special meaning in CSS
        if (e.id && e.id.match("^[a-zA-Z0-9_-]+$")) {
            const id = e.tagName + `[id="${e.id}"]`;
            if (document.querySelectorAll(id).length === 1) {
                return id;
            }
        }
        // If we reached the top of the document
        if (!e.parentElement) {
            return "HTML";
        }
        // Compute the position of the element
        const index = Array.from(e.parentElement.children)
            .filter(child => child.tagName === e.tagName)
            .indexOf(e) + 1;
        return `${uniqueSelector(e.parentElement)} > ${e.tagName}:nth-of-type(${index})`;
    }
    return uniqueSelector(element);
}
// Turns a number into its hash+6 number hexadecimal representation.
function toHexCss(n) {
    if (n === undefined)
        return undefined;
    const str = n.toString(16);
    // Pad with leading zeros
    return "#" + (new Array(6 - str.length)).fill("0").join("") + str;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************!*\
  !*** ./src/compose.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _KeyHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./KeyHandler */ "./src/KeyHandler.ts");
/* harmony import */ var _utils_configuration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/configuration */ "./src/utils/configuration.ts");
/* harmony import */ var _input__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./input */ "./src/input.ts");
/* harmony import */ var _page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./page */ "./src/page.ts");




function print(...args) {
    return browser.runtime.sendMessage({
        args: [(new Error()).stack.replace(/@moz-extension:\/\/[^/]*/g, ""), args],
        funcName: ["console", "log"],
    });
}
window.console.log = print;
window.console.error = print;
// Make canvas size of window
const canvas = document.createElement("canvas");
canvas.id = "canvas";
canvas.oncontextmenu = () => false;
canvas.style.position = "fixed";
canvas.style.top = "0px";
canvas.style.left = "0px";
document.body.appendChild(canvas);
const style = document.createElement("style");
style.innerText = `
html, body {
    /* Hide caret, which sometimes appears over canvas */
    caret-color: transparent !important;
    /* Hide scrollbars when email is longer than window */
    overflow: hidden !important;
}
body > *:not(canvas) {
    /* Hide email content, useful when email is longer than canvas and */
    /* canvas shorter than window */
    display: none !important;
}
`.replace(/\n/g, "");
document.head.appendChild(style);
const connectionPromise = browser.runtime.sendMessage({ funcName: ["getNeovimInstance"] });
class ThunderbirdPageEventEmitter extends _page__WEBPACK_IMPORTED_MODULE_3__.PageEventEmitter {
    constructor() {
        super();
        this.resizeCount = 0;
        const onResize = (() => {
            this.resizeCount += 1;
            this.emit("resize", [this.resizeCount, window.innerWidth, window.innerHeight]);
        }).bind(this);
        window.addEventListener("resize", onResize);
        // We need to trigger a resize on startup because for some reason the
        // window might be 1px wide when the compose script is created.
        setTimeout(onResize, 100);
    }
    async evalInPage(js) { return eval(js); }
    async focusInput() { return Promise.resolve(); }
    async focusPage() { return Promise.resolve(); }
    async getEditorInfo() { return [document.location.href, "", [1, 1], undefined]; }
    async getElementContent() {
        const details = await browser.runtime.sendMessage({ funcName: ["getOwnComposeDetails"], args: [] });
        if (details.isPlainText) {
            return details.plainTextBody;
        }
        return "HTML composition mode not supported due to extension "
            + "restrictions. Switch to plaintext editing (Account Settings "
            + "> Composition & Addressing > Untick `Compose messages in HTML "
            + "Format`)";
    }
    async hideEditor() { return Promise.resolve(); }
    async killEditor() {
        return browser.runtime.sendMessage({
            funcName: ["closeOwnTab"]
        });
    }
    async pressKeys(_) { return Promise.resolve(); }
    async resizeEditor(_, __) {
        // Don't do anything, resizing is fully controlled by resizing the
        // compose window
        return Promise.resolve();
    }
    async setElementContent(_) { return; }
    async setElementCursor(_, __) { return Promise.resolve(); }
}
class ThunderbirdKeyHandler extends _KeyHandler__WEBPACK_IMPORTED_MODULE_0__.KeydownHandler {
    constructor(settings) {
        super(document.documentElement, settings);
        this.start();
        const acceptInput = ((evt) => {
            if (this.enabled) {
                this.emit("input", evt.data);
                evt.preventDefault();
                evt.stopImmediatePropagation();
            }
        }).bind(this);
        document.documentElement.addEventListener("beforeinput", (evt) => {
            if (evt.isTrusted && !evt.isComposing) {
                acceptInput(evt);
            }
        });
    }
    start() {
        this.enabled = true;
    }
    stop() {
        this.enabled = false;
    }
    focus() {
        window.focus();
        document.documentElement.focus();
    }
}
_utils_configuration__WEBPACK_IMPORTED_MODULE_1__.confReady.then(async () => {
    const keyHandler = new ThunderbirdKeyHandler((0,_utils_configuration__WEBPACK_IMPORTED_MODULE_1__.getGlobalConf)());
    const page = new ThunderbirdPageEventEmitter();
    page.on("pause_keyhandler", () => {
        keyHandler.stop();
        setTimeout(() => keyHandler.start(), 1000);
    });
    (0,_input__WEBPACK_IMPORTED_MODULE_2__.setupInput)(page, canvas, keyHandler, connectionPromise);
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1Isa0RBQWtEO0FBQ2xELG1EQUFtRDtBQUNuRCxRQUFRO0FBQ1IsNkNBQTZDO0FBQzdDLFFBQVE7QUFDUiw2Q0FBNkM7QUFDN0MsUUFBUTtBQUNSLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixPQUFPO0FBQzNCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUMsQ0FBQyxLQUEyQixnRUFBZ0U7Ozs7Ozs7Ozs7O0FDcFM3RixpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNKQTs7QUFFQSx3R0FBMkM7QUFDM0Msd0dBQTJDOztBQUUzQyw0R0FBOEM7QUFDOUMsNEdBQThDOztBQUU5Qyw0R0FBa0Q7QUFDbEQsb0dBQXdDOzs7Ozs7Ozs7OztBQ1R4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ1ZBOztBQUVBOztBQUVBLFlBQVk7QUFDWixnQkFBZ0I7QUFDaEIsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsb0JBQW9CO0FBQ3BCLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixRQUFRO0FBQzlCLG1CQUFtQjtBQUNuQixpQkFBaUI7QUFDakIsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQix5QkFBeUI7QUFDekIsbUJBQW1CO0FBQ25CLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0IsUUFBUTtBQUM5QjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsZ0JBQWdCLFNBQVM7QUFDekI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDcklBOztBQUVBLGdCQUFnQixtQkFBTyxDQUFDLGlFQUFhOztBQUVyQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0I7QUFDaEIsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3hDQTs7QUFFQSxnQkFBZ0IsbUJBQU8sQ0FBQyxpRUFBYTtBQUNyQzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0I7QUFDaEIsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtCQUErQjtBQUMvQixJQUFJO0FBQ0osOEJBQThCO0FBQzlCO0FBQ0E7Ozs7Ozs7Ozs7O0FDN0NBOztBQUVBOztBQUVBLGlCQUFpQixtQkFBTyxDQUFDLHFFQUFlOztBQUV4QyxZQUFZO0FBQ1osYUFBYTtBQUNiLGdCQUFnQjtBQUNoQixhQUFhOztBQUViLGdCQUFnQixtQkFBTyxDQUFDLGlFQUFhO0FBQ3JDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0I7QUFDbEIseUJBQXlCO0FBQ3pCLG1CQUFtQjtBQUNuQixpQkFBaUI7QUFDakIsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CO0FBQ25CLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsUUFBUTtBQUM5QixtQkFBbUI7QUFDbkIsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3JGQTs7QUFFQSxnQkFBZ0IsbUJBQU8sQ0FBQyxpRUFBYTs7QUFFckM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCO0FBQ2hCLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQ2xEQTs7QUFFQSxhQUFhLCtHQUEyQztBQUN4RCxnQkFBZ0IsaUJBQWlCO0FBQ2pDLHFCQUFxQixzQkFBc0I7O0FBRTNDLGNBQWMsdUZBQW9DO0FBQ2xELHFCQUFxQjtBQUNyQixlQUFlLGdCQUFnQjtBQUMvQixhQUFhLGNBQWM7O0FBRTNCLGFBQWE7QUFDYixjQUFjO0FBQ2QsWUFBWTs7QUFFWixrQkFBa0Isa0hBQTRDO0FBQzlELG1CQUFtQixxSEFBOEM7QUFDakUsdUJBQXVCLGlJQUFzRDtBQUM3RSxrQkFBa0Isc0hBQWdEOztBQUVsRTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQjtBQUNoQixhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLE9BQU87QUFDdkI7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7Ozs7Ozs7Ozs7QUMzR0E7O0FBRUEsZUFBZSxtQkFBTyxDQUFDLGdEQUFTOztBQUVoQyxtQkFBbUI7QUFDbkIsZUFBZTtBQUNmLGNBQWM7O0FBRWQsZ0JBQWdCLG1CQUFPLENBQUMsaUVBQWE7O0FBRXJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsY0FBYyxnQkFBZ0IsYUFBYTs7Ozs7Ozs7Ozs7QUNsRTNDOztBQUVBO0FBQ0EsbUJBQU8sQ0FBQyxpRUFBYTtBQUNyQixtQkFBTyxDQUFDLG1FQUFjOztBQUV0QjtBQUNBOztBQUVBLGFBQWE7QUFDYixVQUFVLCtGQUE4QjtBQUN4Qzs7Ozs7Ozs7Ozs7QUNYQTs7QUFFQSxvQkFBb0I7O0FBRXBCLGFBQWEsNkZBQTZCOztBQUUxQyxrQkFBa0Isc0dBQW9DOztBQUV0RDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzFCQTs7QUFFQSxjQUFjOztBQUVkLG1CQUFtQiwyR0FBdUM7O0FBRTFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNWQTs7QUFFQSxlQUFlOztBQUVmLGdCQUFnQixtQkFBTyxDQUFDLDJEQUFZO0FBQ3BDLG1CQUFtQiwyR0FBdUM7O0FBRTFEO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUM1QkE7O0FBRUEsb0JBQW9COztBQUVwQixhQUFhLCtGQUE4Qjs7QUFFM0Msa0JBQWtCLHNHQUFvQzs7QUFFdEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMxQkE7O0FBRUEsY0FBYzs7QUFFZCxtQkFBbUIsMkdBQXVDOztBQUUxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ1ZBOztBQUVBLGVBQWU7O0FBRWYsZ0JBQWdCLG1CQUFPLENBQUMsMkRBQVk7QUFDcEMsbUJBQW1CLDJHQUF1Qzs7QUFFMUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN6QkE7O0FBRUEsaUJBQWlCOztBQUVqQixnQkFBZ0IsbUJBQU8sQ0FBQyxpRUFBYTs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNWQTs7QUFFQSxxQkFBcUI7O0FBRXJCLGdCQUFnQixtQkFBTyxDQUFDLGlFQUFhO0FBQ3JDO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQix1RkFBMEIsRUFBRTtBQUN0RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUM3RUE7O0FBRUEsdUJBQXVCOztBQUV2QixnQkFBZ0IsbUJBQU8sQ0FBQyxpRUFBYTtBQUNyQztBQUNBOztBQUVBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLHVGQUEwQixFQUFFO0FBQ3REO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNoRkE7O0FBRUE7QUFDQSxtQkFBTyxDQUFDLGlFQUFhO0FBQ3JCLG1CQUFPLENBQUMsbUVBQWM7O0FBRXRCLDBIQUF5RDs7Ozs7Ozs7Ozs7QUNOekQ7O0FBRUEsbUJBQW1CO0FBQ25CLG1CQUFtQjs7QUFFbkIsZ0JBQWdCLG1CQUFPLENBQUMsaUVBQWE7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDak1BOztBQUVBLGdCQUFnQixrR0FBaUM7QUFDakQsa0JBQWtCLG1CQUFPLENBQUMsdUVBQWdCO0FBQzFDLGdCQUFnQixvR0FBa0M7QUFDbEQsZ0JBQWdCLG1CQUFPLENBQUMsbUVBQWM7QUFDdEMsZ0JBQWdCLG1CQUFPLENBQUMsbUVBQWM7O0FBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxjQUFjOztBQUVkO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ25EQTs7QUFFQSxjQUFjLG1CQUFPLENBQUMsZ0RBQVM7QUFDL0Isa0JBQWtCLG1CQUFPLENBQUMsaUVBQWM7QUFDeEM7QUFDQTs7QUFFQSxxQkFBcUI7QUFDckIsaUJBQWlCOztBQUVqQixnQkFBZ0IsbUJBQU8sQ0FBQyxpRUFBYTtBQUNyQyxrQkFBa0IsbUJBQU8sQ0FBQyw2RUFBbUI7O0FBRTdDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjLFNBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0EsY0FBYyxTQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjLFNBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0EsY0FBYyxTQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDcExBOztBQUVBLGlCQUFpQixtQkFBTyxDQUFDLHFFQUFlOztBQUV4QyxvQkFBb0I7O0FBRXBCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLFdBQVc7QUFDNUI7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixXQUFXO0FBQzVCO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsV0FBVztBQUM1QjtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLFdBQVc7QUFDNUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLFdBQVc7QUFDNUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsV0FBVztBQUM1QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNoS0E7O0FBRUEsZ0JBQWdCLGtHQUFpQztBQUNqRCxnQkFBZ0IsbUJBQU8sQ0FBQyxtRUFBYztBQUN0QyxnQkFBZ0IsbUJBQU8sQ0FBQyxtRUFBYztBQUN0QyxnQkFBZ0IsbUJBQU8sQ0FBQyxtRUFBYzs7QUFFdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVELGNBQWM7O0FBRWQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQ7QUFDMUQ7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdEQUF3RDtBQUN4RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFNBQVM7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDcEVBOztBQUVBLGNBQWMsbUJBQU8sQ0FBQyxnREFBUztBQUMvQixrQkFBa0IsbUJBQU8sQ0FBQyxpRUFBYztBQUN4QztBQUNBOztBQUVBLFlBQVksZ0dBQThCO0FBQzFDLGdCQUFnQixtQkFBTyxDQUFDLGlFQUFhO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ2xPQTs7QUFFQSxlQUFlLG1CQUFPLENBQUMsZ0RBQVM7QUFDaEMsa0JBQWtCLG1CQUFPLENBQUMsaUVBQWM7QUFDeEM7QUFDQTs7QUFFQSxnQkFBZ0IsbUJBQU8sQ0FBQyxpRUFBYTtBQUNyQyxrQkFBa0IsbUJBQU8sQ0FBQyw2RUFBbUI7QUFDN0MsaUJBQWlCLG1CQUFPLENBQUMscUVBQWU7QUFDeEMsWUFBWSxnR0FBOEI7QUFDMUMsZ0JBQWdCLGtHQUFpQzs7QUFFakQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9COztBQUVwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixZQUFZO0FBQ2hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDNVFBOztBQUVBLGVBQWUsYUFBYTs7QUFFNUIsbUJBQW1CLFdBQVc7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNaTyxNQUFNLFlBQVk7SUFBekI7UUFDWSxjQUFTLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztJQWdDMUMsQ0FBQztJQTlCRyxFQUFFLENBQUMsS0FBUSxFQUFFLE9BQVU7UUFDbkIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQ3hCLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDdkM7UUFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBUSxFQUFFLEdBQUcsSUFBUztRQUN2QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDeEIsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1lBQzVCLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDekIsSUFBSTtvQkFDQSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztpQkFDcEI7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1IsMEJBQTBCO29CQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNsQjtZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0g7OzBFQUU4RDtZQUM5RCwwQkFBMEI7WUFDMUIsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7YUFDM0M7U0FDSjtJQUNMLENBQUM7Q0FDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEM2QztBQUUyQjtBQWN6RSwyRUFBMkU7QUFDM0UsOENBQThDO0FBQ3ZDLE1BQU0sY0FBZSxTQUFRLHVEQUEwQztJQUUxRSxZQUFvQixJQUEyQixFQUFFLFFBQXdCO1FBQ3JFLEtBQUssRUFBRSxDQUFDO1FBRFEsU0FBSSxHQUFKLElBQUksQ0FBdUI7UUFFM0MsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzFDLCtEQUErRDtZQUMvRCw2REFBNkQ7WUFDN0QsMERBQTBEO1lBQzFELHdCQUF3QjtZQUN4Qiw2REFBNkQ7WUFDN0QsMkRBQTJEO1lBQzNELDBEQUEwRDtZQUMxRCw2REFBNkQ7WUFDN0QsU0FBUztZQUNULCtEQUErRDtZQUMvRCw2QkFBNkI7WUFDN0IsMEJBQTBCO1lBQzFCLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsR0FBRyxLQUFLLFVBQVUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUMzRSxPQUFPO2FBQ1Y7WUFDRCxtRkFBbUY7WUFDbkYsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2pGLHlGQUF5RjtZQUN6RixJQUFJLEdBQUcsQ0FBQyxTQUFTO21CQUNWLENBQUMsdURBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUzt1QkFDbEMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBbUIsRUFBRSxFQUFFLENBQy9CLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFLLEdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2pGLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3FCQUNoRCxNQUFNLENBQUMsQ0FBQyxHQUFXLEVBQUUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFtQixFQUFFLEVBQUU7b0JBQ25ELElBQUssR0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUNyQyxPQUFPLHdEQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3FCQUNoQztvQkFDRCxPQUFPLEdBQUcsQ0FBQztnQkFDZixDQUFDLEVBQUUseURBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFMUIsSUFBSSxJQUFJLEdBQWMsRUFBRSxDQUFDO2dCQUN6QixJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssU0FBUyxFQUFFO29CQUM1QyxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDL0M7Z0JBQ0QsSUFBSSxVQUFVLENBQUMsR0FBRyxLQUFLLFNBQVMsRUFBRTtvQkFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDekM7Z0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUN6QixHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3JCLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO2lCQUNsQzthQUNKO1FBQ0wsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxNQUFNLENBQUMsQ0FBUyxFQUFFLEVBQVU7UUFDeEIsa0JBQWtCO0lBQ3RCLENBQUM7SUFFRCxPQUFPLENBQUMsQ0FBVztRQUNmLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7Q0FDSjtBQUFBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hGMkM7QUFDYjtBQUNFO0FBQ1M7QUFDVztBQUUvQyxLQUFLLFVBQVUsTUFBTSxDQUNwQixJQUFjLEVBQ2QsTUFBeUIsRUFDekIsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFzQztJQUUxRCxNQUFNLFNBQVMsR0FBUSxFQUFFLENBQUM7SUFDMUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQXlDLENBQUM7SUFFbEUsZ0RBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakMsZ0RBQXdCLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBTSxFQUFFLEVBQUU7UUFDN0QsU0FBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQy9ELENBQUMsQ0FBQyxDQUFDO0lBQ0gsZ0RBQXdCLENBQUMsYUFBYSxFQUFFLENBQUMsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFNLEVBQUUsRUFBRTtRQUM3RCxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksdUJBQXVCLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2hELE1BQU0sTUFBTSxHQUFHLElBQUksU0FBUyxDQUFDLGtCQUFrQixJQUFJLElBQUksUUFBUSxFQUFFLENBQUMsQ0FBQztJQUNuRSxNQUFNLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQztJQUNsQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRTtRQUN6Qyx1QkFBdUIsR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDdkYsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNKLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO1FBQy9ELE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxNQUFNLEtBQUssR0FBRyxJQUFJLHlDQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsTUFBTSxNQUFNLEdBQUcsSUFBSSwyQ0FBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWxDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNkLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBVyxFQUFFLElBQVcsRUFBRSxFQUFFO1FBQ3pDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUNYLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7WUFDdkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDO0lBQ0YsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFVLEVBQUUsSUFBUyxFQUFFLElBQVMsRUFBRSxFQUFFO1FBQ3RELE9BQU8sQ0FBQyxJQUFJLENBQUMseUNBQXlDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1RSxDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBTyxFQUFFLEtBQVUsRUFBRSxNQUFXLEVBQUUsRUFBRTtRQUN2RCxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDSiw2RUFBNkU7WUFDN0UsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1NBQ25FO2FBQU07WUFDSCxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BCLElBQUksS0FBSyxFQUFFO2dCQUNQLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDbkI7aUJBQU07Z0JBQ0gsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNyQjtTQUNKO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLGFBQWEsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDdEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLElBQVksRUFBRSxJQUFXLEVBQUUsRUFBRTtRQUMxRCxJQUFJLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxFQUFFO1lBQzNCLCtDQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlCLE9BQU87U0FDVjtRQUNELHVCQUF1QixHQUFHLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7WUFDM0Qsc0RBQXNEO1lBQ3RELG1FQUFtRTtZQUNuRSxtQkFBbUI7WUFDbkIsOERBQThEO1lBQzlELGdEQUFnRDtZQUNoRCxzRUFBc0U7WUFDdEUsc0NBQXNDO1lBQ3RDLHNEQUFzRDtZQUN0RCxvRUFBb0U7WUFDcEUsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3JDLFFBQVEsSUFBSSxFQUFFO2dCQUNWLEtBQUssd0JBQXdCLENBQUMsQ0FBQztvQkFDN0IsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDdkgsTUFBTSxXQUFXLEdBQUcsbUVBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDdkMsTUFBTSxRQUFRLEdBQUcsd0RBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7d0JBQzNFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO3dCQUMzQixPQUFPLFNBQVMsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzs2QkFDekUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxRQUFRLEdBQUc7OEJBQ3pCLGtDQUFrQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNuRixDQUFDLENBQUM7aUJBQ0g7Z0JBQ0QsS0FBSyxtQkFBbUI7b0JBQ3BCO3dCQUNBLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQWlELENBQUM7d0JBQ3JFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzZCQUM5QyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs2QkFDbkQsSUFBSSxDQUFDLEdBQUcsRUFBRTs0QkFDUCxJQUFJLFFBQVE7bUNBQ0wsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFO21DQUNwQixDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxhQUFhLEdBQUcsSUFBSSxDQUFDLEVBQUU7Z0NBQy9DLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQzs2QkFDbEI7d0JBQ0wsQ0FBQyxDQUFDLENBQUM7cUJBQ047Z0JBQ0wsS0FBSyxrQkFBa0I7b0JBQ25CLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7d0JBQ3hELElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFOzRCQUNULE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3RFO29CQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUNQLEtBQUsscUJBQXFCO29CQUN0QixhQUFhLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUNsQyxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDNUIsS0FBSyxzQkFBc0I7b0JBQ3ZCLGFBQWEsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ2xDLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUM3QixLQUFLLHFCQUFxQjtvQkFDdEIsYUFBYSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDbEMsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQzdCLEtBQUsscUJBQXFCO29CQUN0QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLEtBQUssbUJBQW1CO29CQUNwQixhQUFhLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUNsQyxPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDN0IsS0FBSywyQkFBMkI7b0JBQzVCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7d0JBQy9CLElBQUksRUFBRSxFQUFFO3dCQUNSLFFBQVEsRUFBRSxDQUFDLGlCQUFpQixDQUFDO3FCQUNoQyxDQUFDLENBQUM7YUFDVjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLENBQUMsQ0FBaUIsQ0FBQztJQUU1RixNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUUvQixNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztTQUNyQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxDQUFDO1NBQzdDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUNqQixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ3BCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMxQixJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4QjtRQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBVyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUMsRUFBRSxFQUE0QyxDQUFDLENBQUMsQ0FBQztJQUN0RCxTQUFTLENBQUMsbUJBQW1CLEdBQUcsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQzlDLE9BQU8sU0FBUyxDQUFDO0FBQ3JCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkp1QztBQUVqQyxNQUFNLEtBQUs7SUFFZCxZQUFvQixNQUFpQjtRQUFqQixXQUFNLEdBQU4sTUFBTSxDQUFXO0lBQUcsQ0FBQztJQUVsQyxLQUFLLENBQUMsS0FBYSxFQUFFLE1BQWMsRUFBRSxJQUFXO1FBQ25ELE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckMsTUFBTSxPQUFPLEdBQUcsZ0RBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0NBRUo7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1p1QztBQUNNO0FBT3ZDLE1BQU0sTUFBTyxTQUFRLHVEQUF5QztJQU1qRSxZQUFvQixNQUFpQjtRQUNqQyxLQUFLLEVBQUUsQ0FBQztRQURRLFdBQU0sR0FBTixNQUFNLENBQVc7UUFMN0IsaUJBQVksR0FBRyxJQUFJLEdBQUcsQ0FBc0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUcsaUVBQWlFO1FBQ3pELFNBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixrQkFBYSxHQUFHLEVBQTRCLENBQUM7UUFJakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRU0sUUFBUSxDQUFDLEtBQXNDO1FBQ2xELElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLHFEQUFtQixDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDakUsTUFBTTthQUNELE9BQU8sQ0FBQyxLQUFLLENBQUM7YUFDZCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUNoQixJQUFJO2FBQ0EsYUFBYTthQUNiLEtBQUs7YUFDTCxjQUFjLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFTyxTQUFTLENBQUMsR0FBUTtRQUN0QixNQUFNLE9BQU8sR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsSUFBSSxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEMsT0FBTyxJQUFJLEVBQUU7WUFDVCxJQUFJLE9BQU8sQ0FBQztZQUNaLElBQUk7Z0JBQ0EsT0FBTyxHQUFHLGdEQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUN0RDtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNqQixPQUFPO2FBQ1Y7WUFDRCxNQUFNLE9BQU8sR0FBRyxnREFBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDO1lBQzVDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLDBCQUEwQjtZQUMxQixJQUFJLElBQUksRUFBRTtnQkFDTixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3hDO2lCQUFNO2dCQUNILDhEQUE4RDtnQkFDOUQsdURBQXVEO2dCQUN2RCxPQUFPLENBQUMsS0FBSyxDQUFDLDBCQUEwQixJQUFJLEVBQUUsQ0FBQyxDQUFDO2FBQ25EO1NBQ0o7SUFDTCxDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekRpQztBQUM2RjtBQUNwRDtBQUNoQztBQUlwQyxLQUFLLFVBQVUsVUFBVSxDQUM1QixJQUFjLEVBQ2QsTUFBeUIsRUFDekIsVUFBc0IsRUFDdEIsaUJBQThEO0lBRTlELElBQUk7UUFDQSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsRUFBRSxjQUFjLENBQUMsR0FDckQsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUNqRSxNQUFNLFdBQVcsR0FBRywrQ0FBTSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDekQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFaEQsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyx5REFBYyxFQUFFLENBQUM7UUFFdEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxXQUFXLENBQUM7UUFFL0IsVUFBVSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxnREFBaUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFXLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4RSwyRUFBMkU7UUFDM0UsaURBQWlEO1FBQ2pELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDOUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUM3QixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQ3ZCLElBQUksRUFDSixFQUFFLEVBQ0YsRUFBRSxDQUNMLENBQUM7UUFFRixNQUFNLDJEQUFTLENBQUM7UUFDaEIsTUFBTSxXQUFXLEdBQUcsbUVBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsU0FBUyxDQUNWLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUNuQixJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFDbkI7WUFDSSxZQUFZLEVBQUUsSUFBSTtZQUNsQixZQUFZLEVBQUUsV0FBVyxDQUFDLE9BQU8sS0FBSyxVQUFVO1lBQ2hELEdBQUcsRUFBRSxJQUFJO1NBQ2hCLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXRCLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQTJCLEVBQUUsRUFBRTtZQUNoRSxJQUFJLEVBQUUsR0FBRyxXQUFXLEVBQUU7Z0JBQ2xCLFdBQVcsR0FBRyxFQUFFLENBQUM7Z0JBQ2pCLGdFQUFnRTtnQkFDaEUsMkNBQTJDO2dCQUMzQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDeEIsd0RBQXdEO2dCQUN4RCwrREFBK0Q7Z0JBQy9ELGdFQUFnRTtnQkFDaEUsa0VBQWtFO2dCQUNsRSx3Q0FBd0M7Z0JBQ3hDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsbUVBQXdCLENBQzNDLEtBQUssR0FBRyxNQUFNLENBQUMsZ0JBQWdCLEVBQy9CLE1BQU0sR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQ25DLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLGtCQUFrQixDQUFDLG9EQUFTLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2FBQzVGO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzRSwyREFBMkQ7UUFDM0QsTUFBTSxRQUFRLEdBQUcsd0RBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDM0UsTUFBTSxPQUFPLEdBQUcsTUFBTSxjQUFjLENBQUM7UUFDckMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDM0IsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDcEYsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxRQUFRLEdBQUc7Y0FDakIsa0NBQWtDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFcEYsZ0VBQWdFO1FBQ2hFLDJDQUEyQztRQUMzQywwQkFBMEI7UUFDMUIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7WUFDekMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxxRkFBcUY7UUFDckYsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDeEMsU0FBUyxjQUFjO1lBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsK0JBQStCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNELGNBQWMsRUFBRSxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUVqRCxNQUFNLFdBQVcsR0FBRyxzQkFBc0IsSUFBSSxFQUFFLENBQUM7UUFDakQsaUJBQWlCO1FBQ2pCLDZDQUE2QztRQUM3QyxnQkFBZ0I7UUFDaEIsdUJBQXVCO1FBQ3ZCLE1BQU0sT0FBTyxHQUFHLGtCQUFrQixJQUFJLDJCQUEyQjtjQUNuRCxnQkFBZ0IsUUFBUSxJQUFJLENBQUM7UUFDM0MseURBQXlEO1FBQ3pELElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLFdBQVc7OzJDQUVMLFFBQVEsR0FBRztjQUN4QixrQkFBa0IsSUFBSSxJQUFJO2NBQ3RCLHVCQUF1QjtjQUN2QixHQUFHO2NBQ0MsMENBQTBDO2NBQzFDLG1DQUFtQztjQUN2Qzt3Q0FDTSxPQUFPO2dDQUNmLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVuRixNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBZSxFQUFFLEVBQUU7WUFDckQsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztRQUNILFNBQVMsT0FBTyxDQUFDLEdBQWUsRUFBRSxNQUFjO1lBQzVDLElBQUksTUFBTSxDQUFDO1lBQ1gsOENBQThDO1lBQzlDLDBCQUEwQjtZQUMxQixJQUFJLEdBQUcsWUFBWSxVQUFVLEVBQUU7Z0JBQzNCLE1BQU0sR0FBRyxPQUFPLENBQUM7YUFDcEI7aUJBQU07Z0JBQ0gsNERBQTREO2dCQUM1RCwwQkFBMEI7Z0JBQzFCLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ2hCLG9EQUFvRDtvQkFDcEQsT0FBTztpQkFDVjtnQkFDRCxNQUFNLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNwRDtZQUNELEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNyQixHQUFHLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztZQUUvQixNQUFNLFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNyQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUN4QixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUN4QixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyw2REFBa0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFDTixNQUFNLEVBQ04sU0FBUyxFQUNULG9EQUFTLEVBQUUsRUFDWCxDQUFDLEVBQ0QsQ0FBQyxDQUFDLENBQUM7WUFDcEIsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQ25DLE9BQU8sQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7UUFDSCwwREFBMEQ7UUFDMUQsMEJBQTBCO1FBQzFCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDbkMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDOUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNoRDtpQkFBTTtnQkFDSCxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ25EO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxtREFBbUQ7UUFDbkQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDbEMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztZQUM3QyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7WUFDakMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztZQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbkIsT0FBTyxJQUFJLE9BQU8sQ0FBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDckQsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ25CLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMzQywrREFBK0Q7WUFDL0QsK0RBQStEO1lBQy9ELGlDQUFpQztZQUNqQywwQkFBMEI7WUFDMUIsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDM0MsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDWDtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1IsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsTUFBTSxDQUFDLENBQUM7S0FDWDtBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlMZ0Q7QUFFRDtBQUNRO0FBQ1Q7QUFjL0MsNkNBQTZDO0FBQzdDLDZDQUE2QztBQUM3Qyw2Q0FBNkM7QUFFN0MsU0FBUyxXQUFXLENBQUMsTUFBb0IsRUFBRSxRQUF5QixFQUFFLFdBQW9CO0lBQ3RGLElBQUksV0FBVyxFQUFFO1FBQ2Isa0VBQWtFO1FBQ2xFLCtCQUErQjtRQUMvQixNQUFNLElBQUksR0FBRyw2REFBTyxFQUFFLENBQUM7UUFDdkIsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssRUFBRSxFQUFFO1lBQ3ZDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ25FLFdBQVcsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZEO0tBQ0o7SUFDRCxRQUFRLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUUsYUFBMkM7SUFDbkUsT0FBTyxLQUFLO1NBQ1AsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBRUQsa0VBQWtFO0FBQzNELFNBQVMsZUFBZSxDQUFDLE1BQW9CO0lBQ2hELE9BQU87UUFDSCxzQkFBc0IsRUFBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUk7UUFDeEQsa0JBQWtCLEVBQUUsQ0FBQyxPQUFlLEVBQUUsRUFBRTtZQUNwQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFDRCxXQUFXLEVBQUUsQ0FBQyxRQUFpQixFQUFFLEVBQUU7WUFDL0IsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDL0IsQ0FBQztRQUNELDJCQUEyQixFQUFFLENBQUMsT0FBZSxFQUFFLEVBQUU7WUFDN0MsTUFBTSxDQUFDLHdCQUF3QixHQUFHLE9BQU8sQ0FBQztRQUM5QyxDQUFDO0tBQ0osQ0FBQztBQUNOLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxDQUFjO0lBQzdCLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQ3ZDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZGLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsVUFBVSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzVELENBQUM7QUFFRCx1RkFBdUY7QUFDaEYsU0FBUyx5QkFBeUIsQ0FBQyxNQUFvQjtJQUMxRCxPQUFPO1FBQ0gsWUFBWSxFQUFFLEdBQUcsRUFBRTtZQUNmLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7WUFDbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssU0FBUyxDQUFDO1lBQ25ELE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsZUFBZSxLQUFLLE1BQU0sQ0FBQztZQUM1RSxNQUFNLGVBQWUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxLQUFLLE9BQU87bUJBQ25ELENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLEtBQUssU0FBUzt1QkFDeEMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxlQUFlLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN6RSxJQUFJLE1BQU07bUJBQ0gsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLGVBQWUsSUFBSSxlQUFlLENBQUM7bUJBQ3RELENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxJQUFJLElBQUksZUFBZSxDQUFDLEVBQUU7Z0JBQ2hELElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztxQkFDdkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLENBQUMsSUFBSSxFQUFFO29CQUNQLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQzt5QkFDcEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3JEO2dCQUNELElBQUksQ0FBQyxJQUFJLEVBQUU7b0JBQ1AsT0FBTztpQkFDVjthQUNKO1lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQVMsQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQyxHQUFXLEVBQUUsRUFBRTtZQUNyQixNQUFNLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDekQsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO2dCQUN4QixRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3pCO2lCQUFNO2dCQUNILDhEQUE4RDtnQkFDOUQsMEJBQTBCO2dCQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7YUFDakQ7UUFDTCxDQUFDO0tBQ0osQ0FBQztBQUNOLENBQUM7QUFFTSxTQUFTLHVCQUF1QixDQUFDLE1BQW9CO0lBQ3hELE9BQU87UUFDSCxVQUFVLEVBQUUsQ0FBQyxDQUFTLEVBQUUsRUFBVSxFQUFFLEVBQUUsQ0FBQywyREFBYSxDQUFDLEVBQUUsQ0FBQztRQUN4RCxVQUFVLEVBQUUsQ0FBQyxPQUFlLEVBQUUsRUFBRTtZQUM1QixJQUFJLGVBQWUsQ0FBQztZQUNwQixJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7Z0JBQ3ZCLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDN0Q7aUJBQU07Z0JBQ0gsZUFBZSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3ZEO1lBQ0QsV0FBVyxDQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUNELFNBQVMsRUFBRSxDQUFDLE9BQWUsRUFBRSxFQUFFO1lBQzNCLE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFELGVBQWUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQ3JDLFFBQVEsQ0FBQyxhQUFxQixDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3ZDLFFBQVEsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDckMsQ0FBQztRQUNELGFBQWEsRUFBRSxDQUFDLE9BQWUsRUFBRSxFQUFFLENBQUMsTUFBTTthQUNyQyxhQUFhO2FBQ2IsR0FBRyxDQUFDLE9BQU8sQ0FBQzthQUNaLGFBQWEsRUFBRTtRQUNwQixpQkFBaUIsRUFBRSxDQUFDLE9BQWUsRUFBRSxFQUFFLENBQUMsTUFBTTthQUN6QyxhQUFhO2FBQ2IsR0FBRyxDQUFDLE9BQU8sQ0FBQzthQUNaLHFCQUFxQixFQUFFO1FBQzVCLFVBQVUsRUFBRSxDQUFDLE9BQWUsRUFBRSxFQUFFO1lBQzNCLE1BQWMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLE9BQU87WUFDN0QsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkQsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hCLFdBQVcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFDRCxVQUFVLEVBQUUsQ0FBQyxPQUFlLEVBQUUsRUFBRTtZQUMzQixNQUFjLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxPQUFPO1lBQzdELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25ELE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN2QyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLEdBQUcsNkRBQU8sRUFBRSxDQUFDO1lBQ3ZCLElBQUksU0FBUyxFQUFFO2dCQUNYLFdBQVcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEtBQUssTUFBTSxDQUFDLENBQUM7YUFDM0Q7WUFDRCxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBQ0QsU0FBUyxFQUFFLENBQUMsT0FBZSxFQUFFLElBQWMsRUFBRSxFQUFFO1lBQzNDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyx5REFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEUsQ0FBQztRQUNELFlBQVksRUFBRSxDQUFDLE9BQWUsRUFBRSxLQUFhLEVBQUUsTUFBYyxFQUFFLEVBQUU7WUFDN0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQywrQ0FBK0MsRUFBRSxDQUFDO1FBQzNELENBQUM7UUFDRCxpQkFBaUIsRUFBRSxDQUFDLE9BQWUsRUFBRSxJQUFZLEVBQUUsRUFBRTtZQUNqRCxPQUFPLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pFLENBQUM7UUFDRCxnQkFBZ0IsRUFBRSxDQUFDLE9BQWUsRUFBRSxJQUFZLEVBQUUsTUFBYyxFQUFFLEVBQUU7WUFDaEUsT0FBTyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEYsQ0FBQztLQUNKLENBQUM7QUFDTixDQUFDO0FBRUQsOEVBQThFO0FBQzlFLDhFQUE4RTtBQUM5RSw4RUFBOEU7QUFDOUUsOEVBQThFO0FBQzlFLENBQUM7QUFVTSxNQUFNLGdCQUFpQixTQUFRLHVEQUFzQztJQUN4RTtRQUNJLEtBQUssRUFBRSxDQUFDO1FBQ1IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBWSxFQUFFLE9BQVksRUFBRSxhQUFrQixFQUFFLEVBQUU7WUFDckYsUUFBUSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN6QixLQUFLLGtCQUFrQixDQUFDO2dCQUN4QixLQUFLLGVBQWUsQ0FBQztnQkFDckIsS0FBSyxRQUFRO29CQUNULElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzdDLE1BQU07Z0JBQ1YsS0FBSyxpQkFBaUI7b0JBQ2xCLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDM0UsV0FBVztnQkFDWCx5REFBeUQ7YUFDNUQ7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQU1NLFNBQVMsWUFBWSxDQUFFLE9BQWU7SUFDekMsTUFBTSxJQUFJLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0lBRXBDLElBQUksUUFBd0IsQ0FBQztJQUM3QixLQUFLLFFBQVEsSUFBSSx1QkFBdUIsQ0FBQyxFQUFTLENBQUMsRUFBRTtRQUNqRCwwRUFBMEU7UUFDMUUsdUNBQXVDO1FBQ3ZDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUNyQixJQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBVSxFQUFFLEVBQUU7WUFDckMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztnQkFDL0IsSUFBSSxFQUFFO29CQUNGLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7b0JBQzNCLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQztpQkFDbkI7Z0JBQ0QsUUFBUSxFQUFFLENBQUMsYUFBYSxDQUFDO2FBQzVCLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0tBQ047SUFDRCxPQUFPLElBQWdCLENBQUM7QUFDNUIsQ0FBQztBQUFBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDek5xRDtBQUNvQjtBQUM3QjtBQU92QyxNQUFNLE1BQU0sR0FBRyxJQUFJLHVEQUFZLEVBQWlDLENBQUM7QUFFeEUsSUFBSSxVQUFVLEdBQVMsRUFBRSxDQUFDO0FBQzFCLFNBQVMsY0FBYztJQUNuQixVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLENBQUM7QUFFRCxJQUFJLGtCQUFrQixHQUFHLEtBQUssQ0FBQztBQUUvQixTQUFTLGlCQUFpQjtJQUN0QixrQkFBa0IsR0FBRyxJQUFJLENBQUM7SUFDMUIsY0FBYyxFQUFFLENBQUM7QUFDckIsQ0FBQztBQUVELElBQUksVUFBbUIsQ0FBQztBQUN4QixTQUFTLGFBQWEsQ0FBRSxLQUFZLEVBQUUsQ0FBVTtJQUM1QyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO0lBQ2hDLGlCQUFpQixFQUFFLENBQUM7QUFDeEIsQ0FBQztBQUNELFNBQVMsT0FBTyxDQUFDLElBQVksRUFBRSxJQUFZO0lBQ3ZDLE9BQU8sSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDN0IsQ0FBQztBQUNELFNBQVMsbUJBQW1CLENBQUUsR0FBc0IsRUFBRSxLQUFhLEVBQUUsTUFBYztJQUMvRSxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7SUFDNUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0lBQzlDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsS0FBSyxJQUFJLENBQUM7SUFDL0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQztBQUNyQyxDQUFDO0FBQ0QsU0FBUyxjQUFjLENBQUMsUUFBZ0IsRUFBRSxVQUFrQjtJQUN4RCxPQUFPLEdBQUcsUUFBUSxJQUFJLFVBQVUsRUFBRSxDQUFDO0FBQ3ZDLENBQUM7QUFDRCxJQUFJLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDekIsTUFBTSxpQkFBaUIsR0FBRyxXQUFXLENBQUM7QUFDdEMsSUFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFDcEIsU0FBUyxTQUFTLENBQUUsR0FBc0I7SUFDN0MsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDO0lBQzFCLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ25CLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQ1osTUFBTSxDQUFDLFVBQVUsRUFDakIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3hDLGVBQWUsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUNqRSxpQkFBaUIsR0FBRyxjQUFjLENBQUMsZUFBZSxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDdkUsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNsRSxhQUFhLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUVELHlDQUF5QztBQUN6QyxNQUFNLGlCQUFpQixHQUFHLFNBQVMsQ0FBQztBQUNwQyxNQUFNLGlCQUFpQixHQUFHLFNBQVMsQ0FBQztBQXlCcEMsSUFBSyxVQUlKO0FBSkQsV0FBSyxVQUFVO0lBQ1gsMkNBQUk7SUFDSiwrQ0FBTTtJQUNOLCtDQUFNO0FBQ1YsQ0FBQyxFQUpJLFVBQVUsS0FBVixVQUFVLFFBSWQ7QUFzR0QsTUFBTSxXQUFXLEdBQVU7SUFDdkIsTUFBTSxFQUFFLFNBQVM7SUFDakIsT0FBTyxFQUFFLFNBQVM7SUFDbEIsV0FBVyxFQUFFO1FBQ1QsTUFBTSxFQUFFLFFBQVE7UUFDaEIsT0FBTyxFQUFFLEVBQUU7UUFDWCxHQUFHLEVBQUUsQ0FBQztRQUNOLE1BQU0sRUFBRSxFQUFFO1FBQ1YsTUFBTSxFQUFFLEVBQUU7UUFDVixNQUFNLEVBQUUsQ0FBQztRQUNULEtBQUssRUFBRSxDQUFDO0tBQ1g7SUFDRCxNQUFNLEVBQUU7UUFDSixXQUFXLEVBQUUsQ0FBQztRQUNkLE9BQU8sRUFBRSxJQUFJO1FBQ2IsQ0FBQyxFQUFFLENBQUM7UUFDSixDQUFDLEVBQUUsQ0FBQztRQUNKLFFBQVEsRUFBRSxXQUFXLENBQUMsR0FBRyxFQUFFO1FBQzNCLHFCQUFxQixFQUFFLEtBQUs7S0FDL0I7SUFDRCxjQUFjLEVBQUUsRUFBRTtJQUNsQixXQUFXLEVBQUUsRUFBRTtJQUNmLGdCQUFnQixFQUFFLEVBQUU7SUFDcEIsY0FBYyxFQUFFLEVBQUU7SUFDbEIsU0FBUyxFQUFFLEVBQUU7SUFDYixVQUFVLEVBQUUsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUNoRSxXQUFXLEVBQUUsV0FBVyxDQUFDLEdBQUcsRUFBRTtJQUM5QixTQUFTLEVBQUUsQ0FBQztJQUNaLFFBQVEsRUFBRSxFQUFFO0lBQ1osaUJBQWlCLEVBQUUsRUFBRTtJQUNyQixJQUFJLEVBQUU7UUFDRixPQUFPLEVBQUUsQ0FBQztRQUNWLFlBQVksRUFBRyxLQUFLO1FBQ3BCLFFBQVEsRUFBRSxDQUFDO2dCQUNQLE9BQU8sRUFBRSxDQUFDO2dCQUNWLFVBQVUsRUFBRSxDQUFDO2dCQUNiLFFBQVEsRUFBRSxDQUFDO2dCQUNYLE9BQU8sRUFBRSxDQUFDO2dCQUNWLFNBQVMsRUFBRSxDQUFDO2dCQUNaLGVBQWUsRUFBRSxDQUFDO2dCQUNsQixZQUFZLEVBQUUsT0FBTztnQkFDckIsSUFBSSxFQUFFLFFBQVE7YUFDakIsQ0FBQztLQUNMO0lBQ0QsS0FBSyxFQUFFLFNBQVM7SUFDaEIsT0FBTyxFQUFFLFNBQVM7SUFDbEIsUUFBUSxFQUFFLFNBQVM7Q0FDdEIsQ0FBQztBQUVGLFNBQVMsVUFBVSxDQUFDLElBQVksRUFBRSxJQUFnQixFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7SUFDMUYsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakQsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLEtBQUssRUFBRTtRQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDdEM7U0FBTTtRQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3hCO0lBQ0QsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUVELElBQUksWUFBb0IsQ0FBQztBQUN6QixJQUFJLGFBQXFCLENBQUM7QUFDMUIsSUFBSSxtQkFBMkIsQ0FBQztBQUNoQyxTQUFTLGlCQUFpQixDQUFFLEdBQTZCO0lBQ3JELDZFQUE2RTtJQUM3RSxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUM7U0FDdEIsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUNQLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLHFFQUFxRTtTQUNwRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ25CLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNkLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNmLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztJQUNqQixJQUFJLE9BQW9CLENBQUM7SUFDekIsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7UUFDdEIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsSUFBSSxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssRUFBRTtZQUN2QixLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztTQUN6QjtRQUNELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDcEQsSUFBSSxHQUFHLEdBQUcsUUFBUSxFQUFFO1lBQ2hCLFFBQVEsR0FBRyxHQUFHLENBQUM7U0FDbEI7UUFDRCxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUNsRCxJQUFJLEdBQUcsR0FBRyxNQUFNLEVBQUU7WUFDZCxNQUFNLEdBQUcsR0FBRyxDQUFDO1NBQ2hCO0tBQ0o7SUFDRCxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDO0lBQzFELG1CQUFtQixHQUFHLFFBQVEsQ0FBQztJQUMvQixrQkFBa0IsR0FBRyxLQUFLLENBQUM7QUFDL0IsQ0FBQztBQUNNLFNBQVMsWUFBWSxDQUFFLEtBQVk7SUFDdEMsSUFBSSxrQkFBa0I7V0FDZixZQUFZLEtBQUssU0FBUztXQUMxQixhQUFhLEtBQUssU0FBUztXQUMzQixtQkFBbUIsS0FBSyxTQUFTLEVBQUU7UUFDdEMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3BDO0lBQ0QsT0FBTyxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBQ0QsU0FBUyxZQUFZLENBQUMsS0FBWSxFQUFFLElBQVk7SUFDNUMsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDO0FBQ3BGLENBQUM7QUFFTSxTQUFTLGNBQWM7SUFDMUIsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDO0lBQzFCLE1BQU0sQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BELE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUN0RyxDQUFDO0FBRU0sU0FBUyx3QkFBd0IsQ0FBRSxLQUFjLEVBQUUsTUFBZTtJQUNyRSxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMxRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBRU0sU0FBUyxrQkFBa0IsQ0FBRSxDQUFTLEVBQUUsQ0FBUztJQUNwRCxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMxRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ3ZILENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBRSxFQUFVLEVBQUUsRUFBVTtJQUN6QyxPQUFPO1FBQ0gsVUFBVSxFQUFFLEVBQUU7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFVBQVUsRUFBRSxFQUFFO1FBQ2QsTUFBTSxFQUFFLFNBQVM7UUFDakIsT0FBTyxFQUFFLFNBQVM7UUFDbEIsT0FBTyxFQUFFLFNBQVM7UUFDbEIsYUFBYSxFQUFFLFNBQVM7UUFDeEIsU0FBUyxFQUFFLFNBQVM7UUFDcEIsU0FBUyxFQUFFLFNBQVM7S0FDdkIsQ0FBQztBQUNOLENBQUM7QUFFTSxTQUFTLFNBQVM7SUFDckIsT0FBTyxDQUFDLENBQUM7QUFDYixDQUFDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBRSxLQUFZO0lBQ3JDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVDLE9BQU87UUFDSCxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUM7UUFDWixDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0MsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQzdDLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQztLQUNyQixDQUFDO0FBQ04sQ0FBQztBQUVELFNBQVMsc0JBQXNCLENBQUUsS0FBWTtJQUN6QyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QyxNQUFNLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QyxNQUFNLEdBQUcsR0FBRyxTQUFTLEVBQUUsQ0FBQztJQUN4QixNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlDLFVBQVUsQ0FBQyxHQUFHLEVBQ0gsVUFBVSxDQUFDLElBQUksRUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUNoRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUM3RCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDdkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBRSxLQUFZO0lBQ3RDLE1BQU0sR0FBRyxHQUFHLFNBQVMsRUFBRSxDQUFDO0lBQ3hCLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsRCxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BELFVBQVUsQ0FBQyxHQUFHLEVBQ0gsVUFBVSxDQUFDLElBQUksRUFDZixJQUFJLENBQUMsR0FBRyxDQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUM1RCxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQ3RCLElBQUksQ0FBQyxHQUFHLENBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQzFELFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRCxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQzlCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDbkMsQ0FBQztBQUVELE1BQU0sUUFBUSxHQUErQztJQUN6RCxVQUFVLEVBQUUsR0FBRyxFQUFFO1FBQ2IsVUFBVSxDQUFDLFNBQVMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNGLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN2QyxDQUFDO0lBQ0QsU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDdkQsWUFBWSxFQUFFLEdBQUcsRUFBRTtRQUNmLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztRQUMxQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBQ0QsV0FBVyxFQUFFLENBQUMsR0FBVyxFQUFFLEtBQWEsRUFBRSxFQUFFO1FBQ3hDLFdBQVcsQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNsQyxXQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDMUMsQ0FBQztJQUNELFlBQVksRUFDUixDQUFDLE9BQXdCLEVBQ3hCLEdBQVcsRUFDWCxNQUFjLEVBQ2QsTUFBYyxFQUNkLE1BQWMsRUFDZCxLQUFhLEVBQUUsRUFBRTtRQUNiLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztRQUN6QyxXQUFXLENBQUMsV0FBVyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDMUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2xDLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUN4QyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDeEMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3hDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUMxQyxDQUFDO0lBQ04sa0JBQWtCLEVBQUUsQ0FBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFFO1FBQ3ZELElBQUksRUFBRSxLQUFLLFNBQVMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDL0IsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsc0RBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN2RDtRQUNELElBQUksRUFBRSxLQUFLLFNBQVMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDL0IsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsc0RBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN2RDtRQUNELElBQUksRUFBRSxLQUFLLFNBQVMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDL0IsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsc0RBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNwRDtRQUNELE1BQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUN2RCxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7WUFDM0IsVUFBVSxDQUFDLFNBQVMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN6RjtRQUNELGNBQWMsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxLQUFLLEVBQUUsR0FBRyxFQUFFO1FBQ1IsYUFBYSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUNELFVBQVUsRUFBRSxDQUFDLEVBQVUsRUFBRSxFQUFFO1FBQ3ZCLDREQUE0RDtRQUM1RCxxRUFBcUU7UUFDckUsc0VBQXNFO1FBQ3RFLHVFQUF1RTtRQUN2RSx5QkFBeUI7UUFDekIsOEJBQThCO1FBQzlCLG1EQUFtRDtRQUNuRCxxRUFBcUU7UUFDckUsc0JBQXNCO1FBQ3RCLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEQsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoRCxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUNqQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUNyQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3RCO1NBQ0o7UUFDRCxVQUFVLENBQUMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBQ0QsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFVLEVBQUUsR0FBVyxFQUFFLE1BQWMsRUFBRSxFQUFFO1FBQzFELE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDbEMsVUFBVSxDQUFDLFNBQVMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRSxNQUFNLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN4QixNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUNsQixNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNmLE1BQU0sQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7SUFDeEMsQ0FBQztJQUNELFNBQVMsRUFBRSxDQUFDLEVBQVUsRUFBRSxHQUFXLEVBQUUsR0FBVyxFQUFFLE9BQWUsRUFBRSxFQUFFO1FBQ2pFLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsRCxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDbEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDckMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQ3pCLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDcEI7WUFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV2RCxVQUFVLENBQUMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFekQsTUFBTSxLQUFLLEdBQUcsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3JDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ3pCLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDN0I7WUFDRCxPQUFPLEdBQUcsS0FBSyxDQUFDO1NBQ25CO0lBQ0wsQ0FBQztJQUNELFdBQVcsRUFBRSxDQUFDLEVBQVUsRUFBRSxLQUFhLEVBQUUsTUFBYyxFQUFFLEVBQUU7UUFDdkQsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDO1FBQzFCLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLEtBQUssU0FBUyxDQUFDO1FBQzFELElBQUksVUFBVSxFQUFFO1lBQ1osS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDOUIsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbEMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzlDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzNCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0IsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDOUIsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbEMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxHQUFHO2dCQUMxQixDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLO2dCQUNyQixDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNO2FBQ3pCLENBQUM7U0FDTDtRQUVELE1BQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFOUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFeEYsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsRCxNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDNUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQ3RDLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixPQUFPLEdBQUcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxFQUFFO29CQUN2QixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2pCO2FBQ0o7U0FDSjtRQUNELElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDMUIsT0FBTyxRQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRTtnQkFDN0IsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQy9DO1NBQ0o7UUFDRCxVQUFVLENBQUMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pFLFdBQVcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQzFCLFdBQVcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ2hDLENBQUM7SUFDRCxXQUFXLEVBQUUsQ0FBQyxFQUFVLEVBQ1YsR0FBVyxFQUNYLEdBQVcsRUFDWCxJQUFZLEVBQ1osS0FBYSxFQUNiLElBQVksRUFDWixLQUFhLEVBQUUsRUFBRTtRQUMzQixNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEQsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoRCxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDVixNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsTUFBTTtnQkFDNUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsSUFBSTtnQkFDMUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUNWLEtBQUssSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQy9CLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFO29CQUMvQixRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQixRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM3QjthQUNKO1lBQ0QsVUFBVSxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDOUU7YUFBTSxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUNwRCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtvQkFDL0IsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUIsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDN0I7YUFDSjtZQUNELFVBQVUsQ0FBQyxFQUFFLEVBQUUsVUFBVSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzlFO0lBQ0wsQ0FBQztJQUNELGNBQWMsRUFBRSxDQUFDLEVBQVUsRUFBRSxPQUFZLEVBQUUsRUFBRTtRQUN6QyxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDO1FBQzFDLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxLQUFLLFNBQVMsRUFBRTtZQUM5QixVQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUN2RDtRQUNELFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEdBQUcsc0RBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekQsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxzREFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6RCxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDbkMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQ3JDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUN2QyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLHNEQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztRQUNyRCxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDN0MsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQzdDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUM3QyxDQUFDO0lBQ0QsV0FBVyxFQUFFLENBQUMsQ0FBUyxFQUFFLE9BQWUsRUFBRSxFQUFFO1FBQ3hDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQy9CLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7WUFDbEMsVUFBVSxDQUFDLFNBQVMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRSxhQUFhLEVBQUUsQ0FBQztTQUNuQjtJQUNMLENBQUM7SUFDRCxhQUFhLEVBQUUsQ0FBQyxrQkFBMkIsRUFBRSxRQUFZLEVBQUUsRUFBRTtRQUN6RCx1Q0FBdUM7UUFDdkMsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQztRQUM5QixJQUFJLENBQUMsWUFBWSxHQUFHLGtCQUFrQixDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFDRCxTQUFTLEVBQUUsR0FBRyxFQUFFO1FBQ1osbUJBQW1CLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDakMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFDRCxnQkFBZ0IsRUFBRSxDQUFDLE9BQWMsRUFBRSxFQUFFO1FBQ2pDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2pDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNELFNBQVMsRUFBRSxDQUFDLE9BQWdCLEVBQUUsRUFBRTtRQUM1QixtQkFBbUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNqQyxXQUFXLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztJQUNoQyxDQUFDO0lBQ0QsUUFBUSxFQUFFLENBQUMsQ0FBUyxFQUFFLE9BQWdCLEVBQUUsV0FBb0IsRUFBRSxFQUFFO1FBQzVELG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2pDLElBQUksV0FBVyxFQUFFO1lBQ2IsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkMsV0FBVyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDNUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7SUFDckQsQ0FBQztJQUNELFdBQVcsRUFBRSxDQUFDLE9BQWdCLEVBQUUsRUFBRTtRQUM5QixtQkFBbUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNqQyxXQUFXLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUNsQyxDQUFDO0lBQ0QsWUFBWSxFQUFFLENBQUMsT0FBZ0IsRUFBRSxFQUFFO1FBQy9CLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2pDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQ25DLENBQUM7SUFDRCxVQUFVLEVBQUUsQ0FBQyxNQUFjLEVBQUUsS0FBVSxFQUFFLEVBQUU7UUFDdkMsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDO1FBQzFCLFFBQVEsTUFBTSxFQUFFO1lBQ1osS0FBSyxTQUFTO2dCQUFFO29CQUNaLElBQUksYUFBYSxDQUFDO29CQUNsQixJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7d0JBQ2QsYUFBYSxHQUFHLGlCQUFpQixDQUFDO3FCQUNyQzt5QkFBTTt3QkFDSCxNQUFNLE9BQU8sR0FBRywwREFBWSxDQUFDLEtBQUssRUFBRTs0QkFDaEMsYUFBYSxFQUFFLGlCQUFpQjs0QkFDaEMsV0FBVyxFQUFFLGVBQWU7eUJBQy9CLENBQUMsQ0FBQzt3QkFDSCxhQUFhLEdBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztxQkFDakY7b0JBQ0QsSUFBSSxhQUFhLEtBQUssVUFBVSxFQUFFO3dCQUM5QixNQUFNO3FCQUNUO29CQUNELGFBQWEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBQ3BDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTt3QkFDbEIsSUFBSSxFQUFFLFNBQVMsRUFBRTt3QkFDakIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO3dCQUNqRCxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7cUJBQ3ZELENBQUMsQ0FBQztpQkFDTjtnQkFDRCxNQUFNO1lBQ04sS0FBSyxXQUFXO2dCQUFFO29CQUNkLElBQUksS0FBSyxDQUFDLFNBQVMsS0FBSyxLQUFLLEVBQUU7d0JBQzNCLE1BQU07cUJBQ1Q7b0JBQ0QsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7b0JBQ3hCLGlCQUFpQixFQUFFLENBQUM7b0JBQ3BCLE1BQU0sQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNwRCxNQUFNLEdBQUcsR0FBRyxTQUFTLEVBQUUsQ0FBQztvQkFDeEIsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDekMsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO3dCQUMzQixVQUFVLENBQUMsU0FBUyxFQUFFLEVBQUUsVUFBVSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUN6RjtvQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTt3QkFDbEIsSUFBSSxFQUFFLEdBQUc7d0JBQ1QsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO3dCQUNqRCxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7cUJBQ3ZELENBQUMsQ0FBQztpQkFDTjtnQkFDRCxNQUFNO1NBQ1Q7SUFDTCxDQUFDO0NBQ0osQ0FBQztBQUVGLCtFQUErRTtBQUMvRSxxRUFBcUU7QUFDckUsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO0FBQzNCLFNBQVMsYUFBYTtJQUNsQixJQUFJLENBQUMsY0FBYyxFQUFFO1FBQ2pCLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDdEIsTUFBTSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3ZDO0FBQ0wsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLEtBQVk7SUFDL0IsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztJQUMxQixNQUFNLEdBQUcsR0FBRyxTQUFTLEVBQUUsQ0FBQztJQUN4QixNQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0RCxNQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JELE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7SUFDaEMsMEVBQTBFO0lBQzFFLHlFQUF5RTtJQUN6RSxxRUFBcUU7SUFDckUscUVBQXFFO0lBQ3JFLHVFQUF1RTtJQUN2RSxvQ0FBb0M7SUFDcEMsU0FBUyxjQUFjLENBQUUsSUFBYTtRQUNsQyxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNuQyxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQzVELEtBQUssSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUMzQyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsS0FBSyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUMxQyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxLQUFLLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7b0JBQ3hDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsTUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDaEQsSUFBSSxTQUFTLEdBQUcsYUFBYSxHQUFHLENBQUMsRUFBRTt3QkFDL0IsSUFBSSxTQUFTLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRTs0QkFDNUIsT0FBTzt5QkFDVjt3QkFDRCxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7d0JBQy9CLFNBQVMsR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDO3FCQUN0QztvQkFDRCxTQUFTLEdBQUcsU0FBUyxHQUFHLGFBQWEsQ0FBQztvQkFDdEMsSUFBSSxJQUFJLEVBQUU7d0JBQ04sR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO3FCQUM1QztvQkFDRCxJQUFJLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUU7d0JBQ2hDLGdCQUFnQixDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7cUJBQ2xDO29CQUNELElBQUksU0FBUyxHQUFHLGdCQUFnQixDQUFDLENBQUMsRUFBRTt3QkFDaEMsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxRQUFRLENBQUM7cUJBQzdDO2lCQUNKO2FBQ0o7WUFDRCxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDL0IsU0FBUyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7U0FDdEM7SUFDTCxDQUFDO0lBQ0QsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7SUFDL0MsR0FBRyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUNsQixnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUN0QixLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUMzQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFL0QsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUMvQyxHQUFHLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsR0FBRyxDQUFDLEVBQ2xCLGdCQUFnQixDQUFDLENBQUMsR0FBRyxDQUFDLEVBQ3RCLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFDLENBQUMsR0FBRyxDQUFDLEVBQzNDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLGdCQUFnQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMvRCxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQy9DLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBRUQsU0FBUyxzQkFBc0IsQ0FBQyxLQUFZO0lBQ3hDLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7SUFDMUIsTUFBTSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7SUFDdEMsTUFBTSxJQUFJLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkMsa0JBQWtCO0lBQ2xCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7SUFDL0MsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUNGLElBQUksQ0FBQyxDQUFDLEVBQ04sSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFOUIsa0JBQWtCO0lBQ2xCLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ1osSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDWixJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztJQUNoQixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUNqQixHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQy9DLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDRixJQUFJLENBQUMsQ0FBQyxFQUNOLElBQUksQ0FBQyxLQUFLLEVBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTlCLDZCQUE2QjtJQUM3QixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNaLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ1osSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7SUFDaEIsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7SUFFakIsc0NBQXNDO0lBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDZixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRWpCLGtCQUFrQjtJQUNsQixHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQy9DLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO0lBQ2xELENBQUMsSUFBSSxTQUFTLENBQUM7SUFDZixJQUFJLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQztJQUV4QixNQUFNLE9BQU8sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLDZEQUE2RDtJQUM3RCxNQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQVMsRUFBRSxPQUFzQixFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2xHLGdFQUFnRTtJQUNoRSxxRUFBcUU7SUFDckUsc0VBQXNFO0lBQ3RFLCtDQUErQztJQUMvQyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLHNFQUFzRTtJQUN0RSxrQkFBa0I7SUFDbEIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLG9FQUFvRTtJQUNwRSx1RUFBdUU7SUFDdkUsa0VBQWtFO0lBQ2xFLDhCQUE4QjtJQUM5QixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7SUFDakIsc0VBQXNFO0lBQ3RFLFNBQVM7SUFDVCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDaEIsc0VBQXNFO0lBQ3RFLHFFQUFxRTtJQUNyRSxzQkFBc0I7SUFDdEIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLHFFQUFxRTtJQUNyRSxzRUFBc0U7SUFDdEUsd0NBQXdDO0lBQ3hDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztJQUNqQixrRUFBa0U7SUFDbEUsb0VBQW9FO0lBQ3BFLCtCQUErQjtJQUMvQixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDbkIscUVBQXFFO0lBQ3JFLGdCQUFnQjtJQUNoQixJQUFJLGVBQWUsR0FBRyxXQUFXLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztJQUM1QyxnQ0FBZ0M7SUFDaEMsa0VBQWtFO0lBQ2xFLHNFQUFzRTtJQUN0RSxxRUFBcUU7SUFDckUsa0NBQWtDO0lBQ2xDLHNFQUFzRTtJQUN0RSw0REFBNEQ7SUFDNUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDeEMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNiLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzQixNQUFNLE1BQU0sR0FBRyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pDLFNBQVMsSUFBSSxNQUFNLENBQUM7UUFFcEIsVUFBVSxJQUFJLE1BQU0sQ0FBQztRQUNyQixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3pCLElBQUksZUFBZSxFQUFFO2dCQUNqQixNQUFNO2FBQ1Q7WUFDRCxHQUFHO2dCQUNDLE1BQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxZQUFZLEdBQUcsWUFBWSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDdEQsU0FBUyxJQUFJLFlBQVksQ0FBQztnQkFDMUIsVUFBVSxJQUFJLFlBQVksQ0FBQztnQkFDM0IsVUFBVSxJQUFJLENBQUMsQ0FBQzthQUNuQixRQUFRLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFO1NBQ3JDO1FBRUQsUUFBUSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3hDLElBQUksUUFBUSxLQUFLLFdBQVcsQ0FBQyxHQUFHLEVBQUU7WUFDOUIsT0FBTyxHQUFHLFNBQVMsQ0FBQztZQUNwQixlQUFlLEdBQUcsSUFBSSxDQUFDO1NBQzFCO0tBQ0o7SUFDRCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3ZCLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLElBQUksUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3pDLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztZQUNoRCxTQUFTLElBQUksWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMxQztLQUNKO0lBQ0QsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUVELFNBQVMsS0FBSyxDQUFFLENBQXNCO0lBQ2xDLGNBQWMsR0FBRyxLQUFLLENBQUM7SUFFdkIsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDO0lBQzFCLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDNUIsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztJQUM5QixNQUFNLEdBQUcsR0FBRyxTQUFTLEVBQUUsQ0FBQztJQUN4QixNQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pELE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEQsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztJQUNwQyxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFOUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNsQyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQ2pCLEtBQUssVUFBVSxDQUFDLE1BQU07Z0JBQUU7b0JBQ3BCLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDbEUsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDO29CQUNwRSxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7b0JBQ3ZFLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7b0JBQ3JELDZEQUE2RDtvQkFDN0Qsb0RBQW9EO29CQUNwRCxPQUFPLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztpQkFDN0I7Z0JBQ0QsTUFBTTtZQUNOLEtBQUssVUFBVSxDQUFDLE1BQU0sQ0FBQztZQUN2QixLQUFLLFVBQVUsQ0FBQyxJQUFJO2dCQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtvQkFDOUUsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNLE9BQU8sR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7b0JBRTlCLEtBQUssSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO3dCQUNuRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7NEJBQ2YsU0FBUzt5QkFDWjt3QkFDRCxNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDO3dCQUM3QixNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUV2QyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsS0FBSyxTQUFTLEVBQUU7NEJBQzlCLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDeEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLFNBQVMsQ0FBQzs0QkFDN0UsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDOzRCQUNqRSxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7NEJBQ2pFLElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRTtnQ0FDbEIsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDO2dDQUN2QixVQUFVLEdBQUcsVUFBVSxDQUFDO2dDQUN4QixVQUFVLEdBQUcsR0FBRyxDQUFDOzZCQUNwQjs0QkFDRCxPQUFPLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQzs0QkFDL0IsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQ04sTUFBTSxFQUNOLEtBQUssRUFDTCxVQUFVLENBQUMsQ0FBQzs0QkFDN0IsT0FBTyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7NEJBQy9CLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQzs0QkFDakIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDOzRCQUN2QixJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUU7Z0NBQ2YsT0FBTyxJQUFJLFFBQVEsQ0FBQztnQ0FDcEIsVUFBVSxHQUFHLElBQUksQ0FBQzs2QkFDckI7NEJBQ0QsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO2dDQUNqQixPQUFPLElBQUksVUFBVSxDQUFDO2dDQUN0QixVQUFVLEdBQUcsSUFBSSxDQUFDOzZCQUNyQjs0QkFDRCxJQUFJLFVBQVUsRUFBRTtnQ0FDWixPQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxVQUFVLENBQUM7NkJBQ3ZDOzRCQUNELE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUM7NEJBQ3BELElBQUksVUFBVSxFQUFFO2dDQUNaLE9BQU8sQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDOzZCQUM3Qjs0QkFDRCxJQUFJLFFBQVEsQ0FBQyxhQUFhLEVBQUU7Z0NBQ3hCLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sR0FBRyxRQUFRLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs2QkFDN0Q7NEJBQ0QsT0FBTyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDOzRCQUNyQyxNQUFNLGNBQWMsR0FBRyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsQ0FBQzs0QkFDL0MsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFO2dDQUNwQixNQUFNLE9BQU8sR0FBRyxjQUFjLEdBQUcsR0FBRyxDQUFDO2dDQUNyQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEdBQUcsUUFBUSxHQUFHLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7NkJBQ25FOzRCQUNELElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRTtnQ0FDcEIsTUFBTSxPQUFPLEdBQUcsY0FBYyxHQUFHLEdBQUcsQ0FBQztnQ0FDckMsS0FBSyxJQUFJLFFBQVEsR0FBRyxNQUFNLEVBQUUsUUFBUSxHQUFHLE1BQU0sR0FBRyxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUU7b0NBQy9ELE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUNSLE1BQU0sR0FBRyxRQUFRLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQ2hELENBQUMsRUFDRCxDQUFDLENBQUMsQ0FBQztpQ0FDdkI7NkJBQ0o7NEJBQ0QsaURBQWlEOzRCQUNqRCw2QkFBNkI7NEJBQzdCLElBQUksTUFBTSxJQUFJLENBQUM7bUNBQ1IsTUFBTSxJQUFJLENBQUM7bUNBQ1gsQ0FBQyxNQUFNLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7bUNBQy9CLENBQUMsTUFBTSxHQUFHLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO21DQUNyQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7Z0NBQ2hDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUNqQyxNQUFNLEVBQ04sTUFBTSxFQUNOLEtBQUssRUFDTCxVQUFVLENBQUMsQ0FBQzs2QkFDbkI7eUJBQ0o7NkJBQU07NEJBQ0gsT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO3lCQUN4RDtxQkFDSjtpQkFDSjtnQkFDRCxNQUFNO1NBQ2I7S0FDSjtJQUVELElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzNCLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4QjtJQUVELG1EQUFtRDtJQUNuRCxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLE9BQU8sRUFBRTtRQUN0QyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNqQztTQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7UUFDN0IsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM1QixJQUFJLE1BQU0sQ0FBQyxXQUFXLEtBQUssR0FBRyxFQUFFO1lBQzVCLHVDQUF1QztZQUN2QyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ3hCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZO2dCQUMxQixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUM3QixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixNQUFNLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFbEYsZ0VBQWdFO1lBQ2hFLHNCQUFzQjtZQUN0QixJQUFJLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQztZQUNyRCxJQUFJLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQztZQUNyRCxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssQ0FBQyxFQUFFO2dCQUNwQixNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUM7Z0JBQ3ZCLFVBQVUsR0FBRyxVQUFVLENBQUM7Z0JBQ3hCLFVBQVUsR0FBRyxHQUFHLENBQUM7YUFDcEI7WUFFRCxtREFBbUQ7WUFDbkQsaUNBQWlDO1lBQ2pDLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO1lBQ3pDLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDO1lBQ3pDLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQztZQUN0QixJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUM7WUFDeEIsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFVBQVUsRUFBRTtnQkFDbEMsS0FBSyxHQUFHLENBQUMsQ0FBQzthQUNiO2lCQUFNLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxZQUFZLEVBQUU7Z0JBQzNDLFlBQVksSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQixNQUFNLEdBQUcsQ0FBQyxDQUFDO2FBQ2Q7WUFFRCxNQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDOUIsZ0VBQWdFO1lBQ2hFLCtEQUErRDtZQUMvRCx3QkFBd0I7WUFDeEIsTUFBTSxRQUFRLEdBQUcsV0FBVzttQkFDckIsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO21CQUN4QyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0QsSUFBSSxRQUFRLEVBQUU7Z0JBQ1YsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVELFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUM3QixVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUNoQztZQUVELHNCQUFzQjtZQUN0QixPQUFPLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztZQUMvQixPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFDWCxZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sQ0FBQyxDQUFDO1lBRXpCLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxPQUFPLEVBQUU7Z0JBQy9CLE9BQU8sQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO2dCQUMvQixNQUFNLElBQUksR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUM7YUFDbEY7WUFFRCxJQUFJLFdBQVcsRUFBRTtnQkFDYiw0REFBNEQ7Z0JBQzVELE1BQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2RSxNQUFNLFNBQVMsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU87b0JBQ3hDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLFdBQVc7b0JBQzVCLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDbkQsVUFBVSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUN4QztTQUNKO0tBQ0o7SUFFRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFFRCxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDMUIsZ0VBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLEdBQUcsbUVBQWEsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRS9ELFNBQVMsUUFBUSxDQUFDLE1BQWE7SUFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDcEMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sT0FBTyxHQUFJLFFBQWdCLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBUyxDQUFDLENBQUM7UUFDckQsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQ3ZCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUNuQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN4QztTQUNKO2FBQU07WUFDSCxvREFBb0Q7U0FDdkQ7S0FDSjtJQUNELElBQUksV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsQ0FBQyxXQUFXLEdBQUcsY0FBYyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUU7UUFDMUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7S0FDM0I7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQy8vQkQsSUFBSSxJQUFJLEdBQVksU0FBb0IsQ0FBQztBQUVsQyxTQUFTLGlCQUFpQixDQUFDLEVBQVUsRUFBRSxRQUFhO0lBQ3ZELFNBQVMsWUFBWSxDQUFDLEdBQTJCLEVBQUUsSUFBWSxFQUFFLEtBQVU7UUFDdkUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQ3pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDckI7SUFDTCxDQUFDO0lBQ0QsU0FBUyx1QkFBdUIsQ0FBQyxJQUErQyxFQUMvQyxJQUFZLEVBQ1osR0FBZ0I7UUFDN0MsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLEtBQUssTUFBTSxHQUFHLElBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQTBCLEVBQUU7WUFDMUQsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ3pEO0lBQ0wsQ0FBQztJQUNELElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtRQUN4QixRQUFRLEdBQUcsRUFBRSxDQUFDO0tBQ2pCO0lBRUQsWUFBWSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM3Qyw4QkFBOEI7SUFDOUIseUVBQXlFO0lBQ3pFLHdFQUF3RTtJQUN4RSxvQkFBb0I7SUFDcEIsWUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzFELFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMxRCxZQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDMUQsaURBQWlEO0lBQ2pELGdEQUFnRDtJQUNoRCwwRUFBMEU7SUFDMUUsc0VBQXNFO0lBQ3RFLFlBQVk7SUFDWixZQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0QseUVBQXlFO0lBQ3pFLGtFQUFrRTtJQUNsRSxZQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0QsWUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNELDBDQUEwQztJQUMxQyxZQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDeEQsa0RBQWtEO0lBQ2xELFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBRTlELDRCQUE0QjtJQUM1Qix5RUFBeUU7SUFDekUsc0JBQXNCO0lBQ3RCLHFFQUFxRTtJQUNyRSx1QkFBdUI7SUFDdkIsMEJBQTBCO0lBQzFCLElBQUksRUFBRSxLQUFLLEtBQUssRUFBRTtRQUNkLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztLQUM1RDtTQUFNO1FBQ0gsWUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3ZEO0lBRUQsWUFBWSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDNUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRTtRQUNwQyxtQ0FBbUM7UUFDbkMsc0RBQXNEO1FBQ3RELE9BQU8sRUFBRSxVQUFVO1FBQ25CLE9BQU8sRUFBRSxNQUFNO1FBQ2YsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsUUFBUTtRQUNsQixRQUFRLEVBQUUsK0NBQStDO1FBQ3pELGlFQUFpRTtRQUNqRSxrRUFBa0U7UUFDbEUsUUFBUSxFQUFFLFFBQVE7UUFDbEIsUUFBUSxFQUFFLHNFQUFzRTtLQUNuRixDQUFDLENBQUM7SUFDSCx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsdUJBQXVCLEVBQUU7UUFDdkQsT0FBTyxFQUFFLFVBQVU7UUFDbkIsT0FBTyxFQUFFLE1BQU07UUFDZixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFFBQVEsRUFBRSx5QkFBeUI7S0FDdEMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxRQUFRLENBQUM7QUFDcEIsQ0FBQztBQUVNLE1BQU0sU0FBUyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQzNDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFO1FBQzFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQztBQUVILE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQVksRUFBRSxFQUFFO0lBQ25ELE1BQU07U0FDRCxPQUFPLENBQUMsT0FBTyxDQUFDO1NBQ2hCLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBdUIsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDakUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7SUFDL0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNaLENBQUMsQ0FBQyxDQUFDO0FBRUksU0FBUyxhQUFhO0lBQ3pCLHNCQUFzQjtJQUN0QiwwQkFBMEI7SUFDMUIsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO1FBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztLQUNuRTtJQUNELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztBQUMvQixDQUFDO0FBRU0sU0FBUyxPQUFPO0lBQ25CLE9BQU8sYUFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUVNLFNBQVMsYUFBYSxDQUFDLEdBQVc7SUFDckMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUN6QyxTQUFTLEdBQUcsQ0FBQyxHQUFXO1FBQ3BCLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtZQUNuQixPQUFPLENBQUMsQ0FBQztTQUNaO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBQ0Qsc0JBQXNCO0lBQ3RCLDBCQUEwQjtJQUMxQixJQUFJLGFBQWEsS0FBSyxTQUFTLEVBQUU7UUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx5TEFBeUwsQ0FBQyxDQUFDO0tBQzlNO0lBQ0QsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDM0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDakQsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUM3RCxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQWlCLENBQUMsQ0FBQztBQUMvRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0tNLE1BQU0sY0FBYyxHQUE0QjtJQUNuRCxHQUFHLEVBQUUsU0FBUztJQUNkLEdBQUcsRUFBRSxNQUFNO0lBQ1gsV0FBVyxFQUFFLFFBQVE7SUFDckIsV0FBVyxFQUFFLFFBQVE7SUFDckIsWUFBWSxFQUFFLFNBQVM7SUFDdkIsU0FBUyxFQUFFLE1BQU07SUFDakIsV0FBVyxFQUFFLE1BQU07SUFDbkIsUUFBUSxFQUFFLE9BQU87SUFDakIsS0FBSyxFQUFFLE9BQU87SUFDZCxPQUFPLEVBQUUsTUFBTTtJQUNmLFFBQVEsRUFBRSxPQUFPO0lBQ2pCLElBQUksRUFBRSxNQUFNO0lBQ1osS0FBSyxFQUFFLE9BQU87SUFDZCxLQUFLLEVBQUUsT0FBTztJQUNkLEtBQUssRUFBRSxPQUFPO0lBQ2QsS0FBSyxFQUFFLE9BQU87SUFDZCxLQUFLLEVBQUUsT0FBTztJQUNkLEtBQUssRUFBRSxPQUFPO0lBQ2QsS0FBSyxFQUFFLE9BQU87SUFDZCxLQUFLLEVBQUUsT0FBTztJQUNkLEtBQUssRUFBRSxPQUFPO0lBQ2QsS0FBSyxFQUFFLE9BQU87SUFDZCxJQUFJLEVBQUUsTUFBTTtJQUNaLEtBQUssRUFBRSxPQUFPO0lBQ2QsS0FBSyxFQUFFLE9BQU87SUFDZCxLQUFLLEVBQUUsT0FBTztJQUNkLEtBQUssRUFBRSxPQUFPO0lBQ2QsS0FBSyxFQUFFLE9BQU87SUFDZCxJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLFVBQVUsRUFBRSxZQUFZO0lBQ3hCLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLEtBQUssRUFBRSxPQUFPO0lBQ2QsSUFBSSxFQUFFLFVBQVU7SUFDaEIsR0FBRyxFQUFFLE9BQU87Q0FDZixDQUFDO0FBRUYsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU07S0FDTCxPQUFPLENBQUMsY0FBYyxDQUFDO0tBQ3ZCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFdkUsTUFBTSxrQkFBa0IsR0FBNEI7SUFDaEQsT0FBTyxFQUFPLEVBQUU7SUFDaEIsT0FBTyxFQUFPLEVBQUU7SUFDaEIsS0FBSyxFQUFTLENBQUM7SUFDZixRQUFRLEVBQU0sRUFBRTtJQUNoQixLQUFLLEVBQVMsRUFBRTtJQUNoQixNQUFNLEVBQVEsRUFBRTtJQUNoQixRQUFRLEVBQU0sRUFBRTtJQUNoQixVQUFVLEVBQUksRUFBRTtJQUNoQixRQUFRLEVBQU0sRUFBRTtJQUNoQixXQUFXLEVBQUcsRUFBRTtJQUNoQixXQUFXLEVBQUcsRUFBRTtJQUNoQixZQUFZLEVBQUUsRUFBRTtJQUNoQixTQUFTLEVBQUssRUFBRTtJQUNoQixRQUFRLEVBQU0sRUFBRTtDQUNuQixDQUFDO0FBRUYsMkVBQTJFO0FBQzNFLHNFQUFzRTtBQUN0RSw2RUFBNkU7QUFDN0UsU0FBUztBQUNULFNBQVMsY0FBYyxDQUFDLENBQVM7SUFDN0IsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2QsSUFBSSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0IsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztJQUNuQixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDckIsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1FBQ25CLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2IsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUIsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsTUFBTSxXQUFXLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDcEMsSUFBSSxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDOUMsR0FBRyxHQUFHLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3JDLFFBQVEsR0FBRyxLQUFLLENBQUM7U0FDcEI7YUFBTTtZQUNILFFBQVEsR0FBRyxHQUFHLEtBQUssR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7U0FDOUM7S0FDSjtJQUNELDBFQUEwRTtJQUMxRSxrRUFBa0U7SUFDbEUscUVBQXFFO0lBQ3JFLG1EQUFtRDtJQUNuRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDaEIsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzNCLE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9CO1NBQU0sSUFBSSxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLEVBQUU7UUFDOUMsT0FBTyxHQUFHLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3JDO0lBQ0QsTUFBTSxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUN4RSxPQUFPO1FBQ0gsSUFBSSxhQUFhLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQztRQUNsQyxJQUFJLGFBQWEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO1FBQ25DLElBQUksYUFBYSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUM7S0FDbkMsQ0FBQztBQUNOLENBQUM7QUFFRCw4RUFBOEU7QUFDOUUsc0RBQXNEO0FBQ3RELFNBQVMsV0FBVyxDQUFDLEdBQVc7SUFDNUIsTUFBTSxRQUFRLEdBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQ2pELE9BQU87UUFDSCxJQUFJLGFBQWEsQ0FBQyxTQUFTLEVBQUcsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUMvRCxJQUFJLGFBQWEsQ0FBQyxVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUMvRCxJQUFJLGFBQWEsQ0FBQyxPQUFPLEVBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztLQUNsRSxDQUFDO0FBQ04sQ0FBQztBQUVELDhFQUE4RTtBQUM5RSwwRUFBMEU7QUFDMUUsaUJBQWlCO0FBQ1YsU0FBUyxZQUFZLENBQUMsSUFBYztJQUN2QywyQ0FBMkM7SUFDM0MsdURBQXVEO0lBQ3ZELHVCQUF1QjtJQUN2QixpQkFBaUI7SUFDakIsSUFBSTtJQUNKLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ3BCLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtZQUNoQixPQUFPLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM5QjtRQUNELE9BQU8sV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2QsQ0FBQztBQUVELHlFQUF5RTtBQUNsRSxTQUFTLFlBQVksQ0FBQyxHQUFXO0lBQ3BDLElBQUksY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsRUFBRTtRQUNuQyxPQUFPLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUM5QjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUVELDJFQUEyRTtBQUMzRSxhQUFhO0FBQ04sU0FBUyxXQUFXLENBQUMsR0FBVyxFQUFFLElBQVk7SUFDakQsSUFBSSxLQUFLLENBQUM7SUFDVixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDbkIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUMsRUFBRTtRQUMvQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7U0FBTSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTtRQUN6QyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xCO1NBQU07UUFDSCxHQUFHLEdBQUcsSUFBSSxDQUFDO0tBQ2Q7SUFDRCxPQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsU0FBUyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ25ELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5SkQsSUFBSSxPQUFnQixDQUFDO0FBRXJCLHNDQUFzQztBQUN0QywwQkFBMEI7QUFDMUIsSUFBSyxPQUFlLENBQUMsY0FBYyxLQUFLLFNBQVMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxxQkFBcUIsRUFBRTtJQUNuRyxPQUFPLEdBQUcsYUFBYSxDQUFDO0lBQzVCLG9FQUFvRTtDQUNuRTtLQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssZ0JBQWdCLEVBQUU7SUFDdEQsT0FBTyxHQUFHLFNBQVMsQ0FBQztDQUN2QjtLQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssbUJBQW1CLEVBQUU7SUFDekQsT0FBTyxHQUFHLFFBQVEsQ0FBQztDQUN0QjtBQUVELG9DQUFvQztBQUM3QixTQUFTLFFBQVE7SUFDcEIsOEJBQThCO0lBQzlCLDBCQUEwQjtJQUMxQixJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7UUFDdkIsTUFBTSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztLQUNuRDtJQUNELE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQztBQUNoQyxDQUFDO0FBQ00sU0FBUyxhQUFhO0lBQ3pCLDhCQUE4QjtJQUM5QiwwQkFBMEI7SUFDMUIsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO1FBQ3ZCLE1BQU0sS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7S0FDeEQ7SUFDRCxPQUFPLE9BQU8sS0FBSyxhQUFhLENBQUM7QUFDckMsQ0FBQztBQUVELHlFQUF5RTtBQUN6RSw4RUFBOEU7QUFDOUUsZUFBZTtBQUNSLFNBQVMsYUFBYSxDQUFDLElBQVk7SUFDdEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNuQyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDL0UsTUFBTSxDQUFDLFNBQVMsR0FBRzs7O2lDQUdNLElBQUk7Ozs7Ozs7Ozs7OzthQVl4QixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDaEMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFPLEVBQUUsRUFBRTtZQUNqRCxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNqQztZQUNELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNuQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFFRCw4RUFBOEU7QUFDOUUsUUFBUTtBQUNSLE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQztBQUMvQixNQUFNLGVBQWUsR0FBRztJQUNwQixRQUFRLEVBQUUsQ0FBQyxHQUFzQixFQUFFLEVBQUU7UUFDakMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNwQywwQkFBMEI7WUFDMUIsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDbEIsU0FBUzthQUNaO1lBQ0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNoRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ2QsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDbEIsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDckI7SUFDTCxDQUFDO0lBQ0QsS0FBSyxFQUFFLENBQUMsR0FBc0IsRUFBRSxFQUFFO1FBQzlCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDcEMsOEJBQThCO1lBQzlCLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2xCLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQ2IsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7YUFDcEI7U0FDSjtJQUNMLENBQUM7SUFDRCxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQXVCLEVBQUUsRUFBRSxDQUFFLFNBQW1CLENBQUM7SUFDM0QsWUFBWSxFQUFFLENBQUMsR0FBc0IsRUFBRSxFQUFFO1FBQ3JDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDcEMsaUNBQWlDO1lBQ2pDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2xCLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQ2IsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQ2pCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2FBQ3BCO1NBQ0o7SUFDTCxDQUFDO0NBQ0osQ0FBQztBQUlGLDZFQUE2RTtBQUM3RSx1RUFBdUU7QUFDaEUsU0FBUyxnQkFBZ0IsQ0FBQyxJQUFjLEVBQUUsS0FBSyxHQUFHLEVBQUUsRUFBRSxNQUFNLEdBQUcsRUFBRTtJQUNwRSxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBc0IsQ0FBQztJQUNyRSxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyQyxNQUFNLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7UUFDdEUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqRCxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ0osR0FBRyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7SUFDbEIsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQUVELDJFQUEyRTtBQUMzRSxtQ0FBbUM7QUFDNUIsU0FBUyxVQUFVLENBQUMsWUFBb0IsRUFBRSxHQUFXLEVBQUUsRUFBVSxFQUFFLFFBQWdCO0lBQ3RGLElBQUksU0FBaUQsQ0FBQztJQUN0RCxJQUFJO1FBQ0EsU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzVCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDUiw2REFBNkQ7UUFDN0QsMEJBQTBCO1FBQzFCLFNBQVMsR0FBRyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDO0tBQzdEO0lBRUQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFM0UsTUFBTSxNQUFNLEdBQUcsQ0FBQyxPQUFlLEVBQUUsRUFBRTtRQUMvQixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixRQUFRLE1BQU0sRUFBRTtZQUNaLEtBQUssVUFBVTtnQkFBRSxLQUFLLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQztnQkFBQyxNQUFNO1lBQ25ELEtBQUssVUFBVTtnQkFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFBQyxNQUFNO1lBQzdELEtBQUssVUFBVTtnQkFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUMxRSxLQUFLLFdBQVc7Z0JBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdEUsS0FBSyxXQUFXO2dCQUFFLEtBQUssR0FBRyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFBQyxNQUFNO1lBQ2hFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0NBQWtDLE9BQU8sRUFBRSxDQUFDLENBQUM7U0FDdkU7UUFDRCxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDLENBQUM7SUFFRixJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUM7SUFDMUIsTUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvQyxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7UUFDbEIsS0FBSyxNQUFNLEtBQUssSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxFQUFFO1lBQ3RELE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNqRDtLQUNKO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQUVELDZFQUE2RTtBQUN0RSxTQUFTLG9CQUFvQixDQUFDLFFBQWdCO0lBQ2pELHFEQUFxRDtJQUNyRCxxQkFBcUI7SUFDckIsSUFBSTtJQUNKLHVDQUF1QztJQUN2Qyw2QkFBNkI7SUFDN0Isa0JBQWtCO0lBQ2xCLDZDQUE2QztJQUM3Qyw0Q0FBNEM7SUFDNUMsMkNBQTJDO0lBQzNDLDRDQUE0QztJQUM1Qyw2Q0FBNkM7SUFDN0MsZ0RBQWdEO0lBQ2hELDJDQUEyQztJQUMzQyw2Q0FBNkM7SUFDN0MsZ0RBQWdEO0lBQ2hELDZDQUE2QztJQUM3QyxnREFBZ0Q7SUFDaEQsNkNBQTZDO0lBQzdDLDRDQUE0QztJQUM1Qyw2Q0FBNkM7SUFDN0MsNENBQTRDO0lBQzVDLDJDQUEyQztJQUMzQyw4Q0FBOEM7SUFDOUMsOENBQThDO0lBQzlDLG9EQUFvRDtJQUNwRCw2Q0FBNkM7SUFDN0MsK0NBQStDO0lBQy9DLDZEQUE2RDtJQUM3RCw4Q0FBOEM7SUFDOUMsMkNBQTJDO0lBQzNDLDZDQUE2QztJQUM3Qyw2Q0FBNkM7SUFDN0MsNENBQTRDO0lBQzVDLGdEQUFnRDtJQUNoRCw2Q0FBNkM7SUFDN0MsNkNBQTZDO0lBQzdDLDZDQUE2QztJQUM3Qyw0Q0FBNEM7SUFDNUMsb0RBQW9EO0lBQ3BELDRDQUE0QztJQUM1QyxnREFBZ0Q7SUFDaEQsOENBQThDO0lBQzlDLDZDQUE2QztJQUM3Qyw0Q0FBNEM7SUFDNUMsNENBQTRDO0lBQzVDLDhDQUE4QztJQUM5Qyw4Q0FBOEM7SUFDOUMsOENBQThDO0lBQzlDLDRDQUE0QztJQUM1Qyw0Q0FBNEM7SUFDNUMsOENBQThDO0lBQzlDLDRDQUE0QztJQUM1QywrQ0FBK0M7SUFDL0MsNENBQTRDO0lBQzVDLDZDQUE2QztJQUM3Qyw0Q0FBNEM7SUFDNUMsK0NBQStDO0lBQy9DLDhDQUE4QztJQUM5Qyw2Q0FBNkM7SUFDN0MsNENBQTRDO0lBQzVDLDZDQUE2QztJQUM3Qyw0Q0FBNEM7SUFDNUMsMkNBQTJDO0lBQzNDLDZDQUE2QztJQUM3Qyw0Q0FBNEM7SUFDNUMsNkNBQTZDO0lBQzdDLDZDQUE2QztJQUM3Qyw0Q0FBNEM7SUFDNUMsMkNBQTJDO0lBQzNDLDZDQUE2QztJQUM3Qyw4Q0FBOEM7SUFDOUMsNENBQTRDO0lBQzVDLDZDQUE2QztJQUM3Qyw4Q0FBOEM7SUFDOUMsK0NBQStDO0lBQy9DLDZDQUE2QztJQUM3Qyw4Q0FBOEM7SUFDOUMsNENBQTRDO0lBQzVDLDRDQUE0QztJQUM1Qyw2Q0FBNkM7SUFDN0MsK0NBQStDO0lBQy9DLCtDQUErQztJQUMvQyw2Q0FBNkM7SUFDN0MsOENBQThDO0lBQzlDLDhDQUE4QztJQUM5Qyw0Q0FBNEM7SUFDNUMsNENBQTRDO0lBQzVDLDZDQUE2QztJQUM3Qyw0Q0FBNEM7SUFDNUMsOENBQThDO0lBQzlDLDZDQUE2QztJQUM3Qyw4Q0FBOEM7SUFDOUMsNkNBQTZDO0lBQzdDLElBQUk7SUFDSixPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQztBQUVqQyx5QkFBeUI7QUFDekIsMEJBQTBCO0FBQ25CLFNBQVMsa0JBQWtCLENBQUMsT0FBZSxFQUFFLFFBQWE7SUFDN0QsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzQyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNuQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ25DO1NBQU07UUFDSCxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuRDtJQUNELElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ3RCLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO0tBQ3JEO0lBQ0QsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUN2QyxRQUFRLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNmLEtBQUssR0FBRztnQkFDSixHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFDLE1BQU07WUFDVixLQUFLLEdBQUc7Z0JBQ0osR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLE1BQU0sQ0FBQztnQkFDNUIsTUFBTTtZQUNWLEtBQUssR0FBRztnQkFDSixHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsUUFBUSxDQUFDO2dCQUM3QixNQUFNO1lBQ1YsS0FBSyxHQUFHO2dCQUNKLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLFdBQVcsQ0FBQztnQkFDckMsTUFBTTtZQUNWLEtBQUssR0FBRztnQkFDSixHQUFHLENBQUMsaUJBQWlCLENBQUMsR0FBRyxjQUFjLENBQUM7Z0JBQ3hDLE1BQU07WUFDVixLQUFLLEdBQUcsQ0FBQyxDQUFDLHlEQUF5RDtZQUNuRSxLQUFLLEdBQUcsRUFBRSwwQkFBMEI7Z0JBQ2hDLE1BQU07U0FDYjtRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQyxFQUFFLE1BQWEsQ0FBQyxDQUFDO0FBQzFCLENBQUM7QUFBQSxDQUFDO0FBRUYseURBQXlEO0FBQ3pELHVDQUF1QztBQUN2Qyx5QkFBeUI7QUFDekIsMEJBQTBCO0FBQ25CLFNBQVMsWUFBWSxDQUFDLE9BQWUsRUFBRSxRQUFhO0lBQ3ZELE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDM0MsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzlFLENBQUM7QUFFRCwrQ0FBK0M7QUFDeEMsU0FBUyxlQUFlLENBQUMsT0FBb0I7SUFDaEQsU0FBUyxjQUFjLENBQUMsQ0FBYztRQUNsQyw4RkFBOEY7UUFDOUYsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7WUFDeEMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztZQUN4QyxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUM1QyxPQUFPLEVBQUUsQ0FBQzthQUNiO1NBQ0o7UUFDRCx3Q0FBd0M7UUFDeEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUU7WUFBRSxPQUFPLE1BQU0sQ0FBQztTQUFFO1FBQ3hDLHNDQUFzQztRQUN0QyxNQUFNLEtBQUssR0FDUCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO2FBQy9CLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQzthQUM1QyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLGdCQUFnQixLQUFLLEdBQUcsQ0FBQztJQUNyRixDQUFDO0lBQ0QsT0FBTyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbkMsQ0FBQztBQUVELG9FQUFvRTtBQUM3RCxTQUFTLFFBQVEsQ0FBQyxDQUFTO0lBQzlCLElBQUksQ0FBQyxLQUFLLFNBQVM7UUFDZixPQUFPLFNBQVMsQ0FBQztJQUNyQixNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLHlCQUF5QjtJQUN6QixPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN0RSxDQUFDOzs7Ozs7O1VDbFZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7O0FDTjhDO0FBQ21DO0FBQzVDO0FBQ0s7QUFFMUMsU0FBUyxLQUFLLENBQUUsR0FBRyxJQUFXO0lBQzFCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDL0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUM7UUFDMUUsUUFBUSxFQUFFLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztLQUMvQixDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQzNCLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUU3Qiw2QkFBNkI7QUFDN0IsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNoRCxNQUFNLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQztBQUNyQixNQUFNLENBQUMsYUFBYSxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztBQUNuQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7QUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztBQUMxQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUVsQyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7OztDQVlqQixDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDckIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFakMsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBRTNGLE1BQU0sMkJBQTRCLFNBQVEsbURBQWdCO0lBRXREO1FBQ0ksS0FBSyxFQUFFLENBQUM7UUFGSixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUdwQixNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUNuQixJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNuRixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2IsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM1QyxxRUFBcUU7UUFDckUsK0RBQStEO1FBQy9ELFVBQVUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNELEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBVSxJQUFJLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLFNBQVMsS0FBSyxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0MsS0FBSyxDQUFDLGFBQWEsS0FBSyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBK0MsRUFBQyxDQUFDO0lBQzlILEtBQUssQ0FBQyxpQkFBaUI7UUFDbkIsTUFBTSxPQUFPLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDcEcsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFO1lBQ3JCLE9BQU8sT0FBTyxDQUFDLGFBQWEsQ0FBQztTQUNoQztRQUVELE9BQU8sdURBQXVEO2NBQ3hELDhEQUE4RDtjQUM5RCxnRUFBZ0U7Y0FDaEUsVUFBVSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxLQUFLLENBQUMsVUFBVSxLQUFLLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoRCxLQUFLLENBQUMsVUFBVTtRQUNaLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7WUFDL0IsUUFBUSxFQUFFLENBQUMsYUFBYSxDQUFDO1NBQzVCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRCxLQUFLLENBQUMsU0FBUyxDQUFDLENBQVEsSUFBSSxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdkQsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFTLEVBQUUsRUFBVTtRQUNwQyxrRUFBa0U7UUFDbEUsaUJBQWlCO1FBQ2pCLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFDRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBUyxJQUFJLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFTLEVBQUUsRUFBVSxJQUFJLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztDQUM5RTtBQUVELE1BQU0scUJBQXNCLFNBQVEsdURBQWM7SUFFOUMsWUFBWSxRQUF3QjtRQUNoQyxLQUFLLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7WUFDOUIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDN0IsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUNyQixHQUFHLENBQUMsd0JBQXdCLEVBQUUsQ0FBQzthQUNsQztRQUNMLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNkLFFBQVEsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUMsR0FBUSxFQUFFLEVBQUU7WUFDbEUsSUFBSSxHQUFHLENBQUMsU0FBUyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRTtnQkFDbkMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3BCO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsS0FBSztRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJO1FBQ0EsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUVELEtBQUs7UUFDRCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZixRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3JDLENBQUM7Q0FDSjtBQUVELGdFQUFjLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDdEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxtRUFBYSxFQUFFLENBQUMsQ0FBQztJQUM5RCxNQUFNLElBQUksR0FBRyxJQUFJLDJCQUEyQixFQUFFLENBQUM7SUFDL0MsSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7UUFDN0IsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2xCLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFDSCxrREFBVSxDQUNOLElBQUksRUFDSixNQUFNLEVBQ04sVUFBVSxFQUNWLGlCQUFpQixDQUFDLENBQUM7QUFDM0IsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9GaXJlbnZpbS8uL25vZGVfbW9kdWxlcy9ldmVudC1saXRlL2V2ZW50LWxpdGUuanMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vLi9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL25vZGVfbW9kdWxlcy9pbnQ2NC1idWZmZXIvaW50NjQtYnVmZmVyLmpzIiwid2VicGFjazovL0ZpcmVudmltLy4vbm9kZV9tb2R1bGVzL2lzYXJyYXkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vLi9ub2RlX21vZHVsZXMvbXNncGFjay1saXRlL2xpYi9icm93c2VyLmpzIiwid2VicGFjazovL0ZpcmVudmltLy4vbm9kZV9tb2R1bGVzL21zZ3BhY2stbGl0ZS9saWIvYnVmZmVyLWdsb2JhbC5qcyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL25vZGVfbW9kdWxlcy9tc2dwYWNrLWxpdGUvbGliL2J1ZmZlci1saXRlLmpzIiwid2VicGFjazovL0ZpcmVudmltLy4vbm9kZV9tb2R1bGVzL21zZ3BhY2stbGl0ZS9saWIvYnVmZmVyaXNoLWFycmF5LmpzIiwid2VicGFjazovL0ZpcmVudmltLy4vbm9kZV9tb2R1bGVzL21zZ3BhY2stbGl0ZS9saWIvYnVmZmVyaXNoLWJ1ZmZlci5qcyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL25vZGVfbW9kdWxlcy9tc2dwYWNrLWxpdGUvbGliL2J1ZmZlcmlzaC1wcm90by5qcyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL25vZGVfbW9kdWxlcy9tc2dwYWNrLWxpdGUvbGliL2J1ZmZlcmlzaC11aW50OGFycmF5LmpzIiwid2VicGFjazovL0ZpcmVudmltLy4vbm9kZV9tb2R1bGVzL21zZ3BhY2stbGl0ZS9saWIvYnVmZmVyaXNoLmpzIiwid2VicGFjazovL0ZpcmVudmltLy4vbm9kZV9tb2R1bGVzL21zZ3BhY2stbGl0ZS9saWIvY29kZWMtYmFzZS5qcyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL25vZGVfbW9kdWxlcy9tc2dwYWNrLWxpdGUvbGliL2NvZGVjLmpzIiwid2VicGFjazovL0ZpcmVudmltLy4vbm9kZV9tb2R1bGVzL21zZ3BhY2stbGl0ZS9saWIvZGVjb2RlLWJ1ZmZlci5qcyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL25vZGVfbW9kdWxlcy9tc2dwYWNrLWxpdGUvbGliL2RlY29kZS5qcyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL25vZGVfbW9kdWxlcy9tc2dwYWNrLWxpdGUvbGliL2RlY29kZXIuanMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vLi9ub2RlX21vZHVsZXMvbXNncGFjay1saXRlL2xpYi9lbmNvZGUtYnVmZmVyLmpzIiwid2VicGFjazovL0ZpcmVudmltLy4vbm9kZV9tb2R1bGVzL21zZ3BhY2stbGl0ZS9saWIvZW5jb2RlLmpzIiwid2VicGFjazovL0ZpcmVudmltLy4vbm9kZV9tb2R1bGVzL21zZ3BhY2stbGl0ZS9saWIvZW5jb2Rlci5qcyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL25vZGVfbW9kdWxlcy9tc2dwYWNrLWxpdGUvbGliL2V4dC1idWZmZXIuanMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vLi9ub2RlX21vZHVsZXMvbXNncGFjay1saXRlL2xpYi9leHQtcGFja2VyLmpzIiwid2VicGFjazovL0ZpcmVudmltLy4vbm9kZV9tb2R1bGVzL21zZ3BhY2stbGl0ZS9saWIvZXh0LXVucGFja2VyLmpzIiwid2VicGFjazovL0ZpcmVudmltLy4vbm9kZV9tb2R1bGVzL21zZ3BhY2stbGl0ZS9saWIvZXh0LmpzIiwid2VicGFjazovL0ZpcmVudmltLy4vbm9kZV9tb2R1bGVzL21zZ3BhY2stbGl0ZS9saWIvZmxleC1idWZmZXIuanMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vLi9ub2RlX21vZHVsZXMvbXNncGFjay1saXRlL2xpYi9yZWFkLWNvcmUuanMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vLi9ub2RlX21vZHVsZXMvbXNncGFjay1saXRlL2xpYi9yZWFkLWZvcm1hdC5qcyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL25vZGVfbW9kdWxlcy9tc2dwYWNrLWxpdGUvbGliL3JlYWQtdG9rZW4uanMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vLi9ub2RlX21vZHVsZXMvbXNncGFjay1saXRlL2xpYi93cml0ZS1jb3JlLmpzIiwid2VicGFjazovL0ZpcmVudmltLy4vbm9kZV9tb2R1bGVzL21zZ3BhY2stbGl0ZS9saWIvd3JpdGUtdG9rZW4uanMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vLi9ub2RlX21vZHVsZXMvbXNncGFjay1saXRlL2xpYi93cml0ZS10eXBlLmpzIiwid2VicGFjazovL0ZpcmVudmltLy4vbm9kZV9tb2R1bGVzL21zZ3BhY2stbGl0ZS9saWIvd3JpdGUtdWludDguanMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vLi9zcmMvRXZlbnRFbWl0dGVyLnRzIiwid2VicGFjazovL0ZpcmVudmltLy4vc3JjL0tleUhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vLi9zcmMvTmVvdmltLnRzIiwid2VicGFjazovL0ZpcmVudmltLy4vc3JjL1N0ZGluLnRzIiwid2VicGFjazovL0ZpcmVudmltLy4vc3JjL1N0ZG91dC50cyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL3NyYy9pbnB1dC50cyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL3NyYy9wYWdlLnRzIiwid2VicGFjazovL0ZpcmVudmltLy4vc3JjL3JlbmRlcmVyLnRzIiwid2VicGFjazovL0ZpcmVudmltLy4vc3JjL3V0aWxzL2NvbmZpZ3VyYXRpb24udHMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vLi9zcmMvdXRpbHMva2V5cy50cyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL3NyYy91dGlscy91dGlscy50cyIsIndlYnBhY2s6Ly9GaXJlbnZpbS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9GaXJlbnZpbS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9GaXJlbnZpbS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0ZpcmVudmltLy4vc3JjL2NvbXBvc2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBldmVudC1saXRlLmpzIC0gTGlnaHQtd2VpZ2h0IEV2ZW50RW1pdHRlciAobGVzcyB0aGFuIDFLQiB3aGVuIGd6aXBwZWQpXG4gKlxuICogQGNvcHlyaWdodCBZdXN1a2UgS2F3YXNha2lcbiAqIEBsaWNlbnNlIE1JVFxuICogQGNvbnN0cnVjdG9yXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rYXdhbmV0L2V2ZW50LWxpdGVcbiAqIEBzZWUgaHR0cDovL2thd2FuZXQuZ2l0aHViLmlvL2V2ZW50LWxpdGUvRXZlbnRMaXRlLmh0bWxcbiAqIEBleGFtcGxlXG4gKiB2YXIgRXZlbnRMaXRlID0gcmVxdWlyZShcImV2ZW50LWxpdGVcIik7XG4gKlxuICogZnVuY3Rpb24gTXlDbGFzcygpIHsuLi59ICAgICAgICAgICAgIC8vIHlvdXIgY2xhc3NcbiAqXG4gKiBFdmVudExpdGUubWl4aW4oTXlDbGFzcy5wcm90b3R5cGUpOyAgLy8gaW1wb3J0IGV2ZW50IG1ldGhvZHNcbiAqXG4gKiB2YXIgb2JqID0gbmV3IE15Q2xhc3MoKTtcbiAqIG9iai5vbihcImZvb1wiLCBmdW5jdGlvbigpIHsuLi59KTsgICAgIC8vIGFkZCBldmVudCBsaXN0ZW5lclxuICogb2JqLm9uY2UoXCJiYXJcIiwgZnVuY3Rpb24oKSB7Li4ufSk7ICAgLy8gYWRkIG9uZS10aW1lIGV2ZW50IGxpc3RlbmVyXG4gKiBvYmouZW1pdChcImZvb1wiKTsgICAgICAgICAgICAgICAgICAgICAvLyBkaXNwYXRjaCBldmVudFxuICogb2JqLmVtaXQoXCJiYXJcIik7ICAgICAgICAgICAgICAgICAgICAgLy8gZGlzcGF0Y2ggYW5vdGhlciBldmVudFxuICogb2JqLm9mZihcImZvb1wiKTsgICAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGV2ZW50IGxpc3RlbmVyXG4gKi9cblxuZnVuY3Rpb24gRXZlbnRMaXRlKCkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRXZlbnRMaXRlKSkgcmV0dXJuIG5ldyBFdmVudExpdGUoKTtcbn1cblxuKGZ1bmN0aW9uKEV2ZW50TGl0ZSkge1xuICAvLyBleHBvcnQgdGhlIGNsYXNzIGZvciBub2RlLmpzXG4gIGlmIChcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgbW9kdWxlKSBtb2R1bGUuZXhwb3J0cyA9IEV2ZW50TGl0ZTtcblxuICAvLyBwcm9wZXJ0eSBuYW1lIHRvIGhvbGQgbGlzdGVuZXJzXG4gIHZhciBMSVNURU5FUlMgPSBcImxpc3RlbmVyc1wiO1xuXG4gIC8vIG1ldGhvZHMgdG8gZXhwb3J0XG4gIHZhciBtZXRob2RzID0ge1xuICAgIG9uOiBvbixcbiAgICBvbmNlOiBvbmNlLFxuICAgIG9mZjogb2ZmLFxuICAgIGVtaXQ6IGVtaXRcbiAgfTtcblxuICAvLyBtaXhpbiB0byBzZWxmXG4gIG1peGluKEV2ZW50TGl0ZS5wcm90b3R5cGUpO1xuXG4gIC8vIGV4cG9ydCBtaXhpbiBmdW5jdGlvblxuICBFdmVudExpdGUubWl4aW4gPSBtaXhpbjtcblxuICAvKipcbiAgICogSW1wb3J0IG9uKCksIG9uY2UoKSwgb2ZmKCkgYW5kIGVtaXQoKSBtZXRob2RzIGludG8gdGFyZ2V0IG9iamVjdC5cbiAgICpcbiAgICogQGZ1bmN0aW9uIEV2ZW50TGl0ZS5taXhpblxuICAgKiBAcGFyYW0gdGFyZ2V0IHtQcm90b3R5cGV9XG4gICAqL1xuXG4gIGZ1bmN0aW9uIG1peGluKHRhcmdldCkge1xuICAgIGZvciAodmFyIGtleSBpbiBtZXRob2RzKSB7XG4gICAgICB0YXJnZXRba2V5XSA9IG1ldGhvZHNba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gZXZlbnQgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBFdmVudExpdGUucHJvdG90eXBlLm9uXG4gICAqIEBwYXJhbSB0eXBlIHtzdHJpbmd9XG4gICAqIEBwYXJhbSBmdW5jIHtGdW5jdGlvbn1cbiAgICogQHJldHVybnMge0V2ZW50TGl0ZX0gU2VsZiBmb3IgbWV0aG9kIGNoYWluaW5nXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uKHR5cGUsIGZ1bmMpIHtcbiAgICBnZXRMaXN0ZW5lcnModGhpcywgdHlwZSkucHVzaChmdW5jKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgb25lLXRpbWUgZXZlbnQgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBFdmVudExpdGUucHJvdG90eXBlLm9uY2VcbiAgICogQHBhcmFtIHR5cGUge3N0cmluZ31cbiAgICogQHBhcmFtIGZ1bmMge0Z1bmN0aW9ufVxuICAgKiBAcmV0dXJucyB7RXZlbnRMaXRlfSBTZWxmIGZvciBtZXRob2QgY2hhaW5pbmdcbiAgICovXG5cbiAgZnVuY3Rpb24gb25jZSh0eXBlLCBmdW5jKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHdyYXAub3JpZ2luYWxMaXN0ZW5lciA9IGZ1bmM7XG4gICAgZ2V0TGlzdGVuZXJzKHRoYXQsIHR5cGUpLnB1c2god3JhcCk7XG4gICAgcmV0dXJuIHRoYXQ7XG5cbiAgICBmdW5jdGlvbiB3cmFwKCkge1xuICAgICAgb2ZmLmNhbGwodGhhdCwgdHlwZSwgd3JhcCk7XG4gICAgICBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBldmVudCBsaXN0ZW5lci5cbiAgICpcbiAgICogQGZ1bmN0aW9uIEV2ZW50TGl0ZS5wcm90b3R5cGUub2ZmXG4gICAqIEBwYXJhbSBbdHlwZV0ge3N0cmluZ31cbiAgICogQHBhcmFtIFtmdW5jXSB7RnVuY3Rpb259XG4gICAqIEByZXR1cm5zIHtFdmVudExpdGV9IFNlbGYgZm9yIG1ldGhvZCBjaGFpbmluZ1xuICAgKi9cblxuICBmdW5jdGlvbiBvZmYodHlwZSwgZnVuYykge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgbGlzdG5lcnM7XG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBkZWxldGUgdGhhdFtMSVNURU5FUlNdO1xuICAgIH0gZWxzZSBpZiAoIWZ1bmMpIHtcbiAgICAgIGxpc3RuZXJzID0gdGhhdFtMSVNURU5FUlNdO1xuICAgICAgaWYgKGxpc3RuZXJzKSB7XG4gICAgICAgIGRlbGV0ZSBsaXN0bmVyc1t0eXBlXTtcbiAgICAgICAgaWYgKCFPYmplY3Qua2V5cyhsaXN0bmVycykubGVuZ3RoKSByZXR1cm4gb2ZmLmNhbGwodGhhdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3RuZXJzID0gZ2V0TGlzdGVuZXJzKHRoYXQsIHR5cGUsIHRydWUpO1xuICAgICAgaWYgKGxpc3RuZXJzKSB7XG4gICAgICAgIGxpc3RuZXJzID0gbGlzdG5lcnMuZmlsdGVyKG5lKTtcbiAgICAgICAgaWYgKCFsaXN0bmVycy5sZW5ndGgpIHJldHVybiBvZmYuY2FsbCh0aGF0LCB0eXBlKTtcbiAgICAgICAgdGhhdFtMSVNURU5FUlNdW3R5cGVdID0gbGlzdG5lcnM7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGF0O1xuXG4gICAgZnVuY3Rpb24gbmUodGVzdCkge1xuICAgICAgcmV0dXJuIHRlc3QgIT09IGZ1bmMgJiYgdGVzdC5vcmlnaW5hbExpc3RlbmVyICE9PSBmdW5jO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCAodHJpZ2dlcikgYW4gZXZlbnQuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBFdmVudExpdGUucHJvdG90eXBlLmVtaXRcbiAgICogQHBhcmFtIHR5cGUge3N0cmluZ31cbiAgICogQHBhcmFtIFt2YWx1ZV0geyp9XG4gICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIHdoZW4gYSBsaXN0ZW5lciByZWNlaXZlZCB0aGUgZXZlbnRcbiAgICovXG5cbiAgZnVuY3Rpb24gZW1pdCh0eXBlLCB2YWx1ZSkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgbGlzdGVuZXJzID0gZ2V0TGlzdGVuZXJzKHRoYXQsIHR5cGUsIHRydWUpO1xuICAgIGlmICghbGlzdGVuZXJzKSByZXR1cm4gZmFsc2U7XG4gICAgdmFyIGFyZ2xlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgaWYgKGFyZ2xlbiA9PT0gMSkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goemVyb2FyZyk7XG4gICAgfSBlbHNlIGlmIChhcmdsZW4gPT09IDIpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKG9uZWFyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKG1vcmVhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuICEhbGlzdGVuZXJzLmxlbmd0aDtcblxuICAgIGZ1bmN0aW9uIHplcm9hcmcoZnVuYykge1xuICAgICAgZnVuYy5jYWxsKHRoYXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uZWFyZyhmdW5jKSB7XG4gICAgICBmdW5jLmNhbGwodGhhdCwgdmFsdWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vcmVhcmdzKGZ1bmMpIHtcbiAgICAgIGZ1bmMuYXBwbHkodGhhdCwgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBpZ25vcmVcbiAgICovXG5cbiAgZnVuY3Rpb24gZ2V0TGlzdGVuZXJzKHRoYXQsIHR5cGUsIHJlYWRvbmx5KSB7XG4gICAgaWYgKHJlYWRvbmx5ICYmICF0aGF0W0xJU1RFTkVSU10pIHJldHVybjtcbiAgICB2YXIgbGlzdGVuZXJzID0gdGhhdFtMSVNURU5FUlNdIHx8ICh0aGF0W0xJU1RFTkVSU10gPSB7fSk7XG4gICAgcmV0dXJuIGxpc3RlbmVyc1t0eXBlXSB8fCAobGlzdGVuZXJzW3R5cGVdID0gW10pO1xuICB9XG5cbn0pKEV2ZW50TGl0ZSk7XG4iLCIvKiEgaWVlZTc1NC4gQlNELTMtQ2xhdXNlIExpY2Vuc2UuIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZy9vcGVuc291cmNlPiAqL1xuZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSAoZSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSAobSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICgodmFsdWUgKiBjKSAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwiLy8gaW50NjQtYnVmZmVyLmpzXG5cbi8qanNoaW50IC1XMDE4ICovIC8vIENvbmZ1c2luZyB1c2Ugb2YgJyEnLlxuLypqc2hpbnQgLVcwMzAgKi8gLy8gRXhwZWN0ZWQgYW4gYXNzaWdubWVudCBvciBmdW5jdGlvbiBjYWxsIGFuZCBpbnN0ZWFkIHNhdyBhbiBleHByZXNzaW9uLlxuLypqc2hpbnQgLVcwOTMgKi8gLy8gRGlkIHlvdSBtZWFuIHRvIHJldHVybiBhIGNvbmRpdGlvbmFsIGluc3RlYWQgb2YgYW4gYXNzaWdubWVudD9cblxudmFyIFVpbnQ2NEJFLCBJbnQ2NEJFLCBVaW50NjRMRSwgSW50NjRMRTtcblxuIWZ1bmN0aW9uKGV4cG9ydHMpIHtcbiAgLy8gY29uc3RhbnRzXG5cbiAgdmFyIFVOREVGSU5FRCA9IFwidW5kZWZpbmVkXCI7XG4gIHZhciBCVUZGRVIgPSAoVU5ERUZJTkVEICE9PSB0eXBlb2YgQnVmZmVyKSAmJiBCdWZmZXI7XG4gIHZhciBVSU5UOEFSUkFZID0gKFVOREVGSU5FRCAhPT0gdHlwZW9mIFVpbnQ4QXJyYXkpICYmIFVpbnQ4QXJyYXk7XG4gIHZhciBBUlJBWUJVRkZFUiA9IChVTkRFRklORUQgIT09IHR5cGVvZiBBcnJheUJ1ZmZlcikgJiYgQXJyYXlCdWZmZXI7XG4gIHZhciBaRVJPID0gWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdO1xuICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgX2lzQXJyYXk7XG4gIHZhciBCSVQzMiA9IDQyOTQ5NjcyOTY7XG4gIHZhciBCSVQyNCA9IDE2Nzc3MjE2O1xuXG4gIC8vIHN0b3JhZ2UgY2xhc3NcblxuICB2YXIgc3RvcmFnZTsgLy8gQXJyYXk7XG5cbiAgLy8gZ2VuZXJhdGUgY2xhc3Nlc1xuXG4gIFVpbnQ2NEJFID0gZmFjdG9yeShcIlVpbnQ2NEJFXCIsIHRydWUsIHRydWUpO1xuICBJbnQ2NEJFID0gZmFjdG9yeShcIkludDY0QkVcIiwgdHJ1ZSwgZmFsc2UpO1xuICBVaW50NjRMRSA9IGZhY3RvcnkoXCJVaW50NjRMRVwiLCBmYWxzZSwgdHJ1ZSk7XG4gIEludDY0TEUgPSBmYWN0b3J5KFwiSW50NjRMRVwiLCBmYWxzZSwgZmFsc2UpO1xuXG4gIC8vIGNsYXNzIGZhY3RvcnlcblxuICBmdW5jdGlvbiBmYWN0b3J5KG5hbWUsIGJpZ2VuZGlhbiwgdW5zaWduZWQpIHtcbiAgICB2YXIgcG9zSCA9IGJpZ2VuZGlhbiA/IDAgOiA0O1xuICAgIHZhciBwb3NMID0gYmlnZW5kaWFuID8gNCA6IDA7XG4gICAgdmFyIHBvczAgPSBiaWdlbmRpYW4gPyAwIDogMztcbiAgICB2YXIgcG9zMSA9IGJpZ2VuZGlhbiA/IDEgOiAyO1xuICAgIHZhciBwb3MyID0gYmlnZW5kaWFuID8gMiA6IDE7XG4gICAgdmFyIHBvczMgPSBiaWdlbmRpYW4gPyAzIDogMDtcbiAgICB2YXIgZnJvbVBvc2l0aXZlID0gYmlnZW5kaWFuID8gZnJvbVBvc2l0aXZlQkUgOiBmcm9tUG9zaXRpdmVMRTtcbiAgICB2YXIgZnJvbU5lZ2F0aXZlID0gYmlnZW5kaWFuID8gZnJvbU5lZ2F0aXZlQkUgOiBmcm9tTmVnYXRpdmVMRTtcbiAgICB2YXIgcHJvdG8gPSBJbnQ2NC5wcm90b3R5cGU7XG4gICAgdmFyIGlzTmFtZSA9IFwiaXNcIiArIG5hbWU7XG4gICAgdmFyIF9pc0ludDY0ID0gXCJfXCIgKyBpc05hbWU7XG5cbiAgICAvLyBwcm9wZXJ0aWVzXG4gICAgcHJvdG8uYnVmZmVyID0gdm9pZCAwO1xuICAgIHByb3RvLm9mZnNldCA9IDA7XG4gICAgcHJvdG9bX2lzSW50NjRdID0gdHJ1ZTtcblxuICAgIC8vIG1ldGhvZHNcbiAgICBwcm90by50b051bWJlciA9IHRvTnVtYmVyO1xuICAgIHByb3RvLnRvU3RyaW5nID0gdG9TdHJpbmc7XG4gICAgcHJvdG8udG9KU09OID0gdG9OdW1iZXI7XG4gICAgcHJvdG8udG9BcnJheSA9IHRvQXJyYXk7XG5cbiAgICAvLyBhZGQgLnRvQnVmZmVyKCkgbWV0aG9kIG9ubHkgd2hlbiBCdWZmZXIgYXZhaWxhYmxlXG4gICAgaWYgKEJVRkZFUikgcHJvdG8udG9CdWZmZXIgPSB0b0J1ZmZlcjtcblxuICAgIC8vIGFkZCAudG9BcnJheUJ1ZmZlcigpIG1ldGhvZCBvbmx5IHdoZW4gVWludDhBcnJheSBhdmFpbGFibGVcbiAgICBpZiAoVUlOVDhBUlJBWSkgcHJvdG8udG9BcnJheUJ1ZmZlciA9IHRvQXJyYXlCdWZmZXI7XG5cbiAgICAvLyBpc1VpbnQ2NEJFLCBpc0ludDY0QkVcbiAgICBJbnQ2NFtpc05hbWVdID0gaXNJbnQ2NDtcblxuICAgIC8vIENvbW1vbkpTXG4gICAgZXhwb3J0c1tuYW1lXSA9IEludDY0O1xuXG4gICAgcmV0dXJuIEludDY0O1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBmdW5jdGlvbiBJbnQ2NChidWZmZXIsIG9mZnNldCwgdmFsdWUsIHJhZGRpeCkge1xuICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEludDY0KSkgcmV0dXJuIG5ldyBJbnQ2NChidWZmZXIsIG9mZnNldCwgdmFsdWUsIHJhZGRpeCk7XG4gICAgICByZXR1cm4gaW5pdCh0aGlzLCBidWZmZXIsIG9mZnNldCwgdmFsdWUsIHJhZGRpeCk7XG4gICAgfVxuXG4gICAgLy8gaXNVaW50NjRCRSwgaXNJbnQ2NEJFXG4gICAgZnVuY3Rpb24gaXNJbnQ2NChiKSB7XG4gICAgICByZXR1cm4gISEoYiAmJiBiW19pc0ludDY0XSk7XG4gICAgfVxuXG4gICAgLy8gaW5pdGlhbGl6ZXJcbiAgICBmdW5jdGlvbiBpbml0KHRoYXQsIGJ1ZmZlciwgb2Zmc2V0LCB2YWx1ZSwgcmFkZGl4KSB7XG4gICAgICBpZiAoVUlOVDhBUlJBWSAmJiBBUlJBWUJVRkZFUikge1xuICAgICAgICBpZiAoYnVmZmVyIGluc3RhbmNlb2YgQVJSQVlCVUZGRVIpIGJ1ZmZlciA9IG5ldyBVSU5UOEFSUkFZKGJ1ZmZlcik7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFSUkFZQlVGRkVSKSB2YWx1ZSA9IG5ldyBVSU5UOEFSUkFZKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gSW50NjRCRSgpIHN0eWxlXG4gICAgICBpZiAoIWJ1ZmZlciAmJiAhb2Zmc2V0ICYmICF2YWx1ZSAmJiAhc3RvcmFnZSkge1xuICAgICAgICAvLyBzaG9ydGN1dCB0byBpbml0aWFsaXplIHdpdGggemVyb1xuICAgICAgICB0aGF0LmJ1ZmZlciA9IG5ld0FycmF5KFpFUk8sIDApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIEludDY0QkUodmFsdWUsIHJhZGRpeCkgc3R5bGVcbiAgICAgIGlmICghaXNWYWxpZEJ1ZmZlcihidWZmZXIsIG9mZnNldCkpIHtcbiAgICAgICAgdmFyIF9zdG9yYWdlID0gc3RvcmFnZSB8fCBBcnJheTtcbiAgICAgICAgcmFkZGl4ID0gb2Zmc2V0O1xuICAgICAgICB2YWx1ZSA9IGJ1ZmZlcjtcbiAgICAgICAgb2Zmc2V0ID0gMDtcbiAgICAgICAgYnVmZmVyID0gbmV3IF9zdG9yYWdlKDgpO1xuICAgICAgfVxuXG4gICAgICB0aGF0LmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICAgIHRoYXQub2Zmc2V0ID0gb2Zmc2V0IHw9IDA7XG5cbiAgICAgIC8vIEludDY0QkUoYnVmZmVyLCBvZmZzZXQpIHN0eWxlXG4gICAgICBpZiAoVU5ERUZJTkVEID09PSB0eXBlb2YgdmFsdWUpIHJldHVybjtcblxuICAgICAgLy8gSW50NjRCRShidWZmZXIsIG9mZnNldCwgdmFsdWUsIHJhZGRpeCkgc3R5bGVcbiAgICAgIGlmIChcInN0cmluZ1wiID09PSB0eXBlb2YgdmFsdWUpIHtcbiAgICAgICAgZnJvbVN0cmluZyhidWZmZXIsIG9mZnNldCwgdmFsdWUsIHJhZGRpeCB8fCAxMCk7XG4gICAgICB9IGVsc2UgaWYgKGlzVmFsaWRCdWZmZXIodmFsdWUsIHJhZGRpeCkpIHtcbiAgICAgICAgZnJvbUFycmF5KGJ1ZmZlciwgb2Zmc2V0LCB2YWx1ZSwgcmFkZGl4KTtcbiAgICAgIH0gZWxzZSBpZiAoXCJudW1iZXJcIiA9PT0gdHlwZW9mIHJhZGRpeCkge1xuICAgICAgICB3cml0ZUludDMyKGJ1ZmZlciwgb2Zmc2V0ICsgcG9zSCwgdmFsdWUpOyAvLyBoaWdoXG4gICAgICAgIHdyaXRlSW50MzIoYnVmZmVyLCBvZmZzZXQgKyBwb3NMLCByYWRkaXgpOyAvLyBsb3dcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPiAwKSB7XG4gICAgICAgIGZyb21Qb3NpdGl2ZShidWZmZXIsIG9mZnNldCwgdmFsdWUpOyAvLyBwb3NpdGl2ZVxuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA8IDApIHtcbiAgICAgICAgZnJvbU5lZ2F0aXZlKGJ1ZmZlciwgb2Zmc2V0LCB2YWx1ZSk7IC8vIG5lZ2F0aXZlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcm9tQXJyYXkoYnVmZmVyLCBvZmZzZXQsIFpFUk8sIDApOyAvLyB6ZXJvLCBOYU4gYW5kIG90aGVyc1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb21TdHJpbmcoYnVmZmVyLCBvZmZzZXQsIHN0ciwgcmFkZGl4KSB7XG4gICAgICB2YXIgcG9zID0gMDtcbiAgICAgIHZhciBsZW4gPSBzdHIubGVuZ3RoO1xuICAgICAgdmFyIGhpZ2ggPSAwO1xuICAgICAgdmFyIGxvdyA9IDA7XG4gICAgICBpZiAoc3RyWzBdID09PSBcIi1cIikgcG9zKys7XG4gICAgICB2YXIgc2lnbiA9IHBvcztcbiAgICAgIHdoaWxlIChwb3MgPCBsZW4pIHtcbiAgICAgICAgdmFyIGNociA9IHBhcnNlSW50KHN0cltwb3MrK10sIHJhZGRpeCk7XG4gICAgICAgIGlmICghKGNociA+PSAwKSkgYnJlYWs7IC8vIE5hTlxuICAgICAgICBsb3cgPSBsb3cgKiByYWRkaXggKyBjaHI7XG4gICAgICAgIGhpZ2ggPSBoaWdoICogcmFkZGl4ICsgTWF0aC5mbG9vcihsb3cgLyBCSVQzMik7XG4gICAgICAgIGxvdyAlPSBCSVQzMjtcbiAgICAgIH1cbiAgICAgIGlmIChzaWduKSB7XG4gICAgICAgIGhpZ2ggPSB+aGlnaDtcbiAgICAgICAgaWYgKGxvdykge1xuICAgICAgICAgIGxvdyA9IEJJVDMyIC0gbG93O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhpZ2grKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgd3JpdGVJbnQzMihidWZmZXIsIG9mZnNldCArIHBvc0gsIGhpZ2gpO1xuICAgICAgd3JpdGVJbnQzMihidWZmZXIsIG9mZnNldCArIHBvc0wsIGxvdyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9OdW1iZXIoKSB7XG4gICAgICB2YXIgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgICB2YXIgaGlnaCA9IHJlYWRJbnQzMihidWZmZXIsIG9mZnNldCArIHBvc0gpO1xuICAgICAgdmFyIGxvdyA9IHJlYWRJbnQzMihidWZmZXIsIG9mZnNldCArIHBvc0wpO1xuICAgICAgaWYgKCF1bnNpZ25lZCkgaGlnaCB8PSAwOyAvLyBhIHRyaWNrIHRvIGdldCBzaWduZWRcbiAgICAgIHJldHVybiBoaWdoID8gKGhpZ2ggKiBCSVQzMiArIGxvdykgOiBsb3c7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9TdHJpbmcocmFkaXgpIHtcbiAgICAgIHZhciBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICAgIHZhciBvZmZzZXQgPSB0aGlzLm9mZnNldDtcbiAgICAgIHZhciBoaWdoID0gcmVhZEludDMyKGJ1ZmZlciwgb2Zmc2V0ICsgcG9zSCk7XG4gICAgICB2YXIgbG93ID0gcmVhZEludDMyKGJ1ZmZlciwgb2Zmc2V0ICsgcG9zTCk7XG4gICAgICB2YXIgc3RyID0gXCJcIjtcbiAgICAgIHZhciBzaWduID0gIXVuc2lnbmVkICYmIChoaWdoICYgMHg4MDAwMDAwMCk7XG4gICAgICBpZiAoc2lnbikge1xuICAgICAgICBoaWdoID0gfmhpZ2g7XG4gICAgICAgIGxvdyA9IEJJVDMyIC0gbG93O1xuICAgICAgfVxuICAgICAgcmFkaXggPSByYWRpeCB8fCAxMDtcbiAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgIHZhciBtb2QgPSAoaGlnaCAlIHJhZGl4KSAqIEJJVDMyICsgbG93O1xuICAgICAgICBoaWdoID0gTWF0aC5mbG9vcihoaWdoIC8gcmFkaXgpO1xuICAgICAgICBsb3cgPSBNYXRoLmZsb29yKG1vZCAvIHJhZGl4KTtcbiAgICAgICAgc3RyID0gKG1vZCAlIHJhZGl4KS50b1N0cmluZyhyYWRpeCkgKyBzdHI7XG4gICAgICAgIGlmICghaGlnaCAmJiAhbG93KSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChzaWduKSB7XG4gICAgICAgIHN0ciA9IFwiLVwiICsgc3RyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3cml0ZUludDMyKGJ1ZmZlciwgb2Zmc2V0LCB2YWx1ZSkge1xuICAgICAgYnVmZmVyW29mZnNldCArIHBvczNdID0gdmFsdWUgJiAyNTU7XG4gICAgICB2YWx1ZSA9IHZhbHVlID4+IDg7XG4gICAgICBidWZmZXJbb2Zmc2V0ICsgcG9zMl0gPSB2YWx1ZSAmIDI1NTtcbiAgICAgIHZhbHVlID0gdmFsdWUgPj4gODtcbiAgICAgIGJ1ZmZlcltvZmZzZXQgKyBwb3MxXSA9IHZhbHVlICYgMjU1O1xuICAgICAgdmFsdWUgPSB2YWx1ZSA+PiA4O1xuICAgICAgYnVmZmVyW29mZnNldCArIHBvczBdID0gdmFsdWUgJiAyNTU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVhZEludDMyKGJ1ZmZlciwgb2Zmc2V0KSB7XG4gICAgICByZXR1cm4gKGJ1ZmZlcltvZmZzZXQgKyBwb3MwXSAqIEJJVDI0KSArXG4gICAgICAgIChidWZmZXJbb2Zmc2V0ICsgcG9zMV0gPDwgMTYpICtcbiAgICAgICAgKGJ1ZmZlcltvZmZzZXQgKyBwb3MyXSA8PCA4KSArXG4gICAgICAgIGJ1ZmZlcltvZmZzZXQgKyBwb3MzXTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0b0FycmF5KHJhdykge1xuICAgIHZhciBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICB2YXIgb2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgc3RvcmFnZSA9IG51bGw7IC8vIEFycmF5XG4gICAgaWYgKHJhdyAhPT0gZmFsc2UgJiYgb2Zmc2V0ID09PSAwICYmIGJ1ZmZlci5sZW5ndGggPT09IDggJiYgaXNBcnJheShidWZmZXIpKSByZXR1cm4gYnVmZmVyO1xuICAgIHJldHVybiBuZXdBcnJheShidWZmZXIsIG9mZnNldCk7XG4gIH1cblxuICBmdW5jdGlvbiB0b0J1ZmZlcihyYXcpIHtcbiAgICB2YXIgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgdmFyIG9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICAgIHN0b3JhZ2UgPSBCVUZGRVI7XG4gICAgaWYgKHJhdyAhPT0gZmFsc2UgJiYgb2Zmc2V0ID09PSAwICYmIGJ1ZmZlci5sZW5ndGggPT09IDggJiYgQnVmZmVyLmlzQnVmZmVyKGJ1ZmZlcikpIHJldHVybiBidWZmZXI7XG4gICAgdmFyIGRlc3QgPSBuZXcgQlVGRkVSKDgpO1xuICAgIGZyb21BcnJheShkZXN0LCAwLCBidWZmZXIsIG9mZnNldCk7XG4gICAgcmV0dXJuIGRlc3Q7XG4gIH1cblxuICBmdW5jdGlvbiB0b0FycmF5QnVmZmVyKHJhdykge1xuICAgIHZhciBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICB2YXIgb2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgdmFyIGFycmJ1ZiA9IGJ1ZmZlci5idWZmZXI7XG4gICAgc3RvcmFnZSA9IFVJTlQ4QVJSQVk7XG4gICAgaWYgKHJhdyAhPT0gZmFsc2UgJiYgb2Zmc2V0ID09PSAwICYmIChhcnJidWYgaW5zdGFuY2VvZiBBUlJBWUJVRkZFUikgJiYgYXJyYnVmLmJ5dGVMZW5ndGggPT09IDgpIHJldHVybiBhcnJidWY7XG4gICAgdmFyIGRlc3QgPSBuZXcgVUlOVDhBUlJBWSg4KTtcbiAgICBmcm9tQXJyYXkoZGVzdCwgMCwgYnVmZmVyLCBvZmZzZXQpO1xuICAgIHJldHVybiBkZXN0LmJ1ZmZlcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzVmFsaWRCdWZmZXIoYnVmZmVyLCBvZmZzZXQpIHtcbiAgICB2YXIgbGVuID0gYnVmZmVyICYmIGJ1ZmZlci5sZW5ndGg7XG4gICAgb2Zmc2V0IHw9IDA7XG4gICAgcmV0dXJuIGxlbiAmJiAob2Zmc2V0ICsgOCA8PSBsZW4pICYmIChcInN0cmluZ1wiICE9PSB0eXBlb2YgYnVmZmVyW29mZnNldF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gZnJvbUFycmF5KGRlc3RidWYsIGRlc3RvZmYsIHNyY2J1Ziwgc3Jjb2ZmKSB7XG4gICAgZGVzdG9mZiB8PSAwO1xuICAgIHNyY29mZiB8PSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgICBkZXN0YnVmW2Rlc3RvZmYrK10gPSBzcmNidWZbc3Jjb2ZmKytdICYgMjU1O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld0FycmF5KGJ1ZmZlciwgb2Zmc2V0KSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGJ1ZmZlciwgb2Zmc2V0LCBvZmZzZXQgKyA4KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZyb21Qb3NpdGl2ZUJFKGJ1ZmZlciwgb2Zmc2V0LCB2YWx1ZSkge1xuICAgIHZhciBwb3MgPSBvZmZzZXQgKyA4O1xuICAgIHdoaWxlIChwb3MgPiBvZmZzZXQpIHtcbiAgICAgIGJ1ZmZlclstLXBvc10gPSB2YWx1ZSAmIDI1NTtcbiAgICAgIHZhbHVlIC89IDI1NjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBmcm9tTmVnYXRpdmVCRShidWZmZXIsIG9mZnNldCwgdmFsdWUpIHtcbiAgICB2YXIgcG9zID0gb2Zmc2V0ICsgODtcbiAgICB2YWx1ZSsrO1xuICAgIHdoaWxlIChwb3MgPiBvZmZzZXQpIHtcbiAgICAgIGJ1ZmZlclstLXBvc10gPSAoKC12YWx1ZSkgJiAyNTUpIF4gMjU1O1xuICAgICAgdmFsdWUgLz0gMjU2O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZyb21Qb3NpdGl2ZUxFKGJ1ZmZlciwgb2Zmc2V0LCB2YWx1ZSkge1xuICAgIHZhciBlbmQgPSBvZmZzZXQgKyA4O1xuICAgIHdoaWxlIChvZmZzZXQgPCBlbmQpIHtcbiAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSB2YWx1ZSAmIDI1NTtcbiAgICAgIHZhbHVlIC89IDI1NjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBmcm9tTmVnYXRpdmVMRShidWZmZXIsIG9mZnNldCwgdmFsdWUpIHtcbiAgICB2YXIgZW5kID0gb2Zmc2V0ICsgODtcbiAgICB2YWx1ZSsrO1xuICAgIHdoaWxlIChvZmZzZXQgPCBlbmQpIHtcbiAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSAoKC12YWx1ZSkgJiAyNTUpIF4gMjU1O1xuICAgICAgdmFsdWUgLz0gMjU2O1xuICAgIH1cbiAgfVxuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9yZXRyb2ZveC9pcy1hcnJheVxuICBmdW5jdGlvbiBfaXNBcnJheSh2YWwpIHtcbiAgICByZXR1cm4gISF2YWwgJiYgXCJbb2JqZWN0IEFycmF5XVwiID09IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpO1xuICB9XG5cbn0odHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBleHBvcnRzLm5vZGVOYW1lICE9PSAnc3RyaW5nJyA/IGV4cG9ydHMgOiAodGhpcyB8fCB7fSkpO1xuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXJyKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGFycikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvLyBicm93c2VyLmpzXG5cbmV4cG9ydHMuZW5jb2RlID0gcmVxdWlyZShcIi4vZW5jb2RlXCIpLmVuY29kZTtcbmV4cG9ydHMuZGVjb2RlID0gcmVxdWlyZShcIi4vZGVjb2RlXCIpLmRlY29kZTtcblxuZXhwb3J0cy5FbmNvZGVyID0gcmVxdWlyZShcIi4vZW5jb2RlclwiKS5FbmNvZGVyO1xuZXhwb3J0cy5EZWNvZGVyID0gcmVxdWlyZShcIi4vZGVjb2RlclwiKS5EZWNvZGVyO1xuXG5leHBvcnRzLmNyZWF0ZUNvZGVjID0gcmVxdWlyZShcIi4vZXh0XCIpLmNyZWF0ZUNvZGVjO1xuZXhwb3J0cy5jb2RlYyA9IHJlcXVpcmUoXCIuL2NvZGVjXCIpLmNvZGVjO1xuIiwiLyogZ2xvYmFscyBCdWZmZXIgKi9cblxubW9kdWxlLmV4cG9ydHMgPVxuICBjKChcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgQnVmZmVyKSAmJiBCdWZmZXIpIHx8XG4gIGModGhpcy5CdWZmZXIpIHx8XG4gIGMoKFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiB3aW5kb3cpICYmIHdpbmRvdy5CdWZmZXIpIHx8XG4gIHRoaXMuQnVmZmVyO1xuXG5mdW5jdGlvbiBjKEIpIHtcbiAgcmV0dXJuIEIgJiYgQi5pc0J1ZmZlciAmJiBCO1xufSIsIi8vIGJ1ZmZlci1saXRlLmpzXG5cbnZhciBNQVhCVUZMRU4gPSA4MTkyO1xuXG5leHBvcnRzLmNvcHkgPSBjb3B5O1xuZXhwb3J0cy50b1N0cmluZyA9IHRvU3RyaW5nO1xuZXhwb3J0cy53cml0ZSA9IHdyaXRlO1xuXG4vKipcbiAqIEJ1ZmZlci5wcm90b3R5cGUud3JpdGUoKVxuICpcbiAqIEBwYXJhbSBzdHJpbmcge1N0cmluZ31cbiAqIEBwYXJhbSBbb2Zmc2V0XSB7TnVtYmVyfVxuICogQHJldHVybnMge051bWJlcn1cbiAqL1xuXG5mdW5jdGlvbiB3cml0ZShzdHJpbmcsIG9mZnNldCkge1xuICB2YXIgYnVmZmVyID0gdGhpcztcbiAgdmFyIGluZGV4ID0gb2Zmc2V0IHx8IChvZmZzZXQgfD0gMCk7XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICB2YXIgY2hyID0gMDtcbiAgdmFyIGkgPSAwO1xuICB3aGlsZSAoaSA8IGxlbmd0aCkge1xuICAgIGNociA9IHN0cmluZy5jaGFyQ29kZUF0KGkrKyk7XG5cbiAgICBpZiAoY2hyIDwgMTI4KSB7XG4gICAgICBidWZmZXJbaW5kZXgrK10gPSBjaHI7XG4gICAgfSBlbHNlIGlmIChjaHIgPCAweDgwMCkge1xuICAgICAgLy8gMiBieXRlc1xuICAgICAgYnVmZmVyW2luZGV4KytdID0gMHhDMCB8IChjaHIgPj4+IDYpO1xuICAgICAgYnVmZmVyW2luZGV4KytdID0gMHg4MCB8IChjaHIgJiAweDNGKTtcbiAgICB9IGVsc2UgaWYgKGNociA8IDB4RDgwMCB8fCBjaHIgPiAweERGRkYpIHtcbiAgICAgIC8vIDMgYnl0ZXNcbiAgICAgIGJ1ZmZlcltpbmRleCsrXSA9IDB4RTAgfCAoY2hyICA+Pj4gMTIpO1xuICAgICAgYnVmZmVyW2luZGV4KytdID0gMHg4MCB8ICgoY2hyID4+PiA2KSAgJiAweDNGKTtcbiAgICAgIGJ1ZmZlcltpbmRleCsrXSA9IDB4ODAgfCAoY2hyICAgICAgICAgICYgMHgzRik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIDQgYnl0ZXMgLSBzdXJyb2dhdGUgcGFpclxuICAgICAgY2hyID0gKCgoY2hyIC0gMHhEODAwKSA8PCAxMCkgfCAoc3RyaW5nLmNoYXJDb2RlQXQoaSsrKSAtIDB4REMwMCkpICsgMHgxMDAwMDtcbiAgICAgIGJ1ZmZlcltpbmRleCsrXSA9IDB4RjAgfCAoY2hyID4+PiAxOCk7XG4gICAgICBidWZmZXJbaW5kZXgrK10gPSAweDgwIHwgKChjaHIgPj4+IDEyKSAmIDB4M0YpO1xuICAgICAgYnVmZmVyW2luZGV4KytdID0gMHg4MCB8ICgoY2hyID4+PiA2KSAgJiAweDNGKTtcbiAgICAgIGJ1ZmZlcltpbmRleCsrXSA9IDB4ODAgfCAoY2hyICAgICAgICAgICYgMHgzRik7XG4gICAgfVxuICB9XG4gIHJldHVybiBpbmRleCAtIG9mZnNldDtcbn1cblxuLyoqXG4gKiBCdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nKClcbiAqXG4gKiBAcGFyYW0gW2VuY29kaW5nXSB7U3RyaW5nfSBpZ25vcmVkXG4gKiBAcGFyYW0gW3N0YXJ0XSB7TnVtYmVyfVxuICogQHBhcmFtIFtlbmRdIHtOdW1iZXJ9XG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHRvU3RyaW5nKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBidWZmZXIgPSB0aGlzO1xuICB2YXIgaW5kZXggPSBzdGFydHwwO1xuICBpZiAoIWVuZCkgZW5kID0gYnVmZmVyLmxlbmd0aDtcbiAgdmFyIHN0cmluZyA9ICcnO1xuICB2YXIgY2hyID0gMDtcblxuICB3aGlsZSAoaW5kZXggPCBlbmQpIHtcbiAgICBjaHIgPSBidWZmZXJbaW5kZXgrK107XG4gICAgaWYgKGNociA8IDEyOCkge1xuICAgICAgc3RyaW5nICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICgoY2hyICYgMHhFMCkgPT09IDB4QzApIHtcbiAgICAgIC8vIDIgYnl0ZXNcbiAgICAgIGNociA9IChjaHIgJiAweDFGKSA8PCA2IHxcbiAgICAgICAgICAgIChidWZmZXJbaW5kZXgrK10gJiAweDNGKTtcblxuICAgIH0gZWxzZSBpZiAoKGNociAmIDB4RjApID09PSAweEUwKSB7XG4gICAgICAvLyAzIGJ5dGVzXG4gICAgICBjaHIgPSAoY2hyICYgMHgwRikgICAgICAgICAgICAgPDwgMTIgfFxuICAgICAgICAgICAgKGJ1ZmZlcltpbmRleCsrXSAmIDB4M0YpIDw8IDYgIHxcbiAgICAgICAgICAgIChidWZmZXJbaW5kZXgrK10gJiAweDNGKTtcblxuICAgIH0gZWxzZSBpZiAoKGNociAmIDB4RjgpID09PSAweEYwKSB7XG4gICAgICAvLyA0IGJ5dGVzXG4gICAgICBjaHIgPSAoY2hyICYgMHgwNykgICAgICAgICAgICAgPDwgMTggfFxuICAgICAgICAgICAgKGJ1ZmZlcltpbmRleCsrXSAmIDB4M0YpIDw8IDEyIHxcbiAgICAgICAgICAgIChidWZmZXJbaW5kZXgrK10gJiAweDNGKSA8PCA2ICB8XG4gICAgICAgICAgICAoYnVmZmVyW2luZGV4KytdICYgMHgzRik7XG4gICAgfVxuXG4gICAgaWYgKGNociA+PSAweDAxMDAwMCkge1xuICAgICAgLy8gQSBzdXJyb2dhdGUgcGFpclxuICAgICAgY2hyIC09IDB4MDEwMDAwO1xuXG4gICAgICBzdHJpbmcgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoY2hyID4+PiAxMCkgKyAweEQ4MDAsIChjaHIgJiAweDNGRikgKyAweERDMDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHJpbmcgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjaHIpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdHJpbmc7XG59XG5cbi8qKlxuICogQnVmZmVyLnByb3RvdHlwZS5jb3B5KClcbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IHtCdWZmZXJ9XG4gKiBAcGFyYW0gW3RhcmdldFN0YXJ0XSB7TnVtYmVyfVxuICogQHBhcmFtIFtzdGFydF0ge051bWJlcn1cbiAqIEBwYXJhbSBbZW5kXSB7TnVtYmVyfVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuXG5mdW5jdGlvbiBjb3B5KHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGk7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMDtcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aDtcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwO1xuICB2YXIgbGVuID0gZW5kIC0gc3RhcnQ7XG5cbiAgaWYgKHRhcmdldCA9PT0gdGhpcyAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZ1xuICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gYXNjZW5kaW5nXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbGVuO1xufVxuIiwiLy8gYnVmZmVyaXNoLWFycmF5LmpzXG5cbnZhciBCdWZmZXJpc2ggPSByZXF1aXJlKFwiLi9idWZmZXJpc2hcIik7XG5cbnZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBhbGxvYygwKTtcblxuZXhwb3J0cy5hbGxvYyA9IGFsbG9jO1xuZXhwb3J0cy5jb25jYXQgPSBCdWZmZXJpc2guY29uY2F0O1xuZXhwb3J0cy5mcm9tID0gZnJvbTtcblxuLyoqXG4gKiBAcGFyYW0gc2l6ZSB7TnVtYmVyfVxuICogQHJldHVybnMge0J1ZmZlcnxVaW50OEFycmF5fEFycmF5fVxuICovXG5cbmZ1bmN0aW9uIGFsbG9jKHNpemUpIHtcbiAgcmV0dXJuIG5ldyBBcnJheShzaXplKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gdmFsdWUge0FycmF5fEFycmF5QnVmZmVyfEJ1ZmZlcnxTdHJpbmd9XG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cblxuZnVuY3Rpb24gZnJvbSh2YWx1ZSkge1xuICBpZiAoIUJ1ZmZlcmlzaC5pc0J1ZmZlcih2YWx1ZSkgJiYgQnVmZmVyaXNoLmlzVmlldyh2YWx1ZSkpIHtcbiAgICAvLyBUeXBlZEFycmF5IHRvIFVpbnQ4QXJyYXlcbiAgICB2YWx1ZSA9IEJ1ZmZlcmlzaC5VaW50OEFycmF5LmZyb20odmFsdWUpO1xuICB9IGVsc2UgaWYgKEJ1ZmZlcmlzaC5pc0FycmF5QnVmZmVyKHZhbHVlKSkge1xuICAgIC8vIEFycmF5QnVmZmVyIHRvIFVpbnQ4QXJyYXlcbiAgICB2YWx1ZSA9IG5ldyBVaW50OEFycmF5KHZhbHVlKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAvLyBTdHJpbmcgdG8gQXJyYXlcbiAgICByZXR1cm4gQnVmZmVyaXNoLmZyb20uY2FsbChleHBvcnRzLCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIGEgbnVtYmVyJyk7XG4gIH1cblxuICAvLyBBcnJheS1saWtlIHRvIEFycmF5XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh2YWx1ZSk7XG59XG4iLCIvLyBidWZmZXJpc2gtYnVmZmVyLmpzXG5cbnZhciBCdWZmZXJpc2ggPSByZXF1aXJlKFwiLi9idWZmZXJpc2hcIik7XG52YXIgQnVmZmVyID0gQnVmZmVyaXNoLmdsb2JhbDtcblxudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IEJ1ZmZlcmlzaC5oYXNCdWZmZXIgPyBhbGxvYygwKSA6IFtdO1xuXG5leHBvcnRzLmFsbG9jID0gQnVmZmVyaXNoLmhhc0J1ZmZlciAmJiBCdWZmZXIuYWxsb2MgfHwgYWxsb2M7XG5leHBvcnRzLmNvbmNhdCA9IEJ1ZmZlcmlzaC5jb25jYXQ7XG5leHBvcnRzLmZyb20gPSBmcm9tO1xuXG4vKipcbiAqIEBwYXJhbSBzaXplIHtOdW1iZXJ9XG4gKiBAcmV0dXJucyB7QnVmZmVyfFVpbnQ4QXJyYXl8QXJyYXl9XG4gKi9cblxuZnVuY3Rpb24gYWxsb2Moc2l6ZSkge1xuICByZXR1cm4gbmV3IEJ1ZmZlcihzaXplKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gdmFsdWUge0FycmF5fEFycmF5QnVmZmVyfEJ1ZmZlcnxTdHJpbmd9XG4gKiBAcmV0dXJucyB7QnVmZmVyfVxuICovXG5cbmZ1bmN0aW9uIGZyb20odmFsdWUpIHtcbiAgaWYgKCFCdWZmZXJpc2guaXNCdWZmZXIodmFsdWUpICYmIEJ1ZmZlcmlzaC5pc1ZpZXcodmFsdWUpKSB7XG4gICAgLy8gVHlwZWRBcnJheSB0byBVaW50OEFycmF5XG4gICAgdmFsdWUgPSBCdWZmZXJpc2guVWludDhBcnJheS5mcm9tKHZhbHVlKTtcbiAgfSBlbHNlIGlmIChCdWZmZXJpc2guaXNBcnJheUJ1ZmZlcih2YWx1ZSkpIHtcbiAgICAvLyBBcnJheUJ1ZmZlciB0byBVaW50OEFycmF5XG4gICAgdmFsdWUgPSBuZXcgVWludDhBcnJheSh2YWx1ZSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgLy8gU3RyaW5nIHRvIEJ1ZmZlclxuICAgIHJldHVybiBCdWZmZXJpc2guZnJvbS5jYWxsKGV4cG9ydHMsIHZhbHVlKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKTtcbiAgfVxuXG4gIC8vIEFycmF5LWxpa2UgdG8gQnVmZmVyXG4gIGlmIChCdWZmZXIuZnJvbSAmJiBCdWZmZXIuZnJvbS5sZW5ndGggIT09IDEpIHtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20odmFsdWUpOyAvLyBub2RlIHY2K1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKHZhbHVlKTsgLy8gbm9kZSB2NFxuICB9XG59XG4iLCIvLyBidWZmZXJpc2gtcHJvdG8uanNcblxuLyoganNoaW50IGVxbnVsbDp0cnVlICovXG5cbnZhciBCdWZmZXJMaXRlID0gcmVxdWlyZShcIi4vYnVmZmVyLWxpdGVcIik7XG5cbmV4cG9ydHMuY29weSA9IGNvcHk7XG5leHBvcnRzLnNsaWNlID0gc2xpY2U7XG5leHBvcnRzLnRvU3RyaW5nID0gdG9TdHJpbmc7XG5leHBvcnRzLndyaXRlID0gZ2VuKFwid3JpdGVcIik7XG5cbnZhciBCdWZmZXJpc2ggPSByZXF1aXJlKFwiLi9idWZmZXJpc2hcIik7XG52YXIgQnVmZmVyID0gQnVmZmVyaXNoLmdsb2JhbDtcblxudmFyIGlzQnVmZmVyU2hpbSA9IEJ1ZmZlcmlzaC5oYXNCdWZmZXIgJiYgKFwiVFlQRURfQVJSQVlfU1VQUE9SVFwiIGluIEJ1ZmZlcik7XG52YXIgYnJva2VuVHlwZWRBcnJheSA9IGlzQnVmZmVyU2hpbSAmJiAhQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQ7XG5cbi8qKlxuICogQHBhcmFtIHRhcmdldCB7QnVmZmVyfFVpbnQ4QXJyYXl8QXJyYXl9XG4gKiBAcGFyYW0gW3RhcmdldFN0YXJ0XSB7TnVtYmVyfVxuICogQHBhcmFtIFtzdGFydF0ge051bWJlcn1cbiAqIEBwYXJhbSBbZW5kXSB7TnVtYmVyfVxuICogQHJldHVybnMge0J1ZmZlcnxVaW50OEFycmF5fEFycmF5fVxuICovXG5cbmZ1bmN0aW9uIGNvcHkodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgdGhpc0lzQnVmZmVyID0gQnVmZmVyaXNoLmlzQnVmZmVyKHRoaXMpO1xuICB2YXIgdGFyZ2V0SXNCdWZmZXIgPSBCdWZmZXJpc2guaXNCdWZmZXIodGFyZ2V0KTtcbiAgaWYgKHRoaXNJc0J1ZmZlciAmJiB0YXJnZXRJc0J1ZmZlcikge1xuICAgIC8vIEJ1ZmZlciB0byBCdWZmZXJcbiAgICByZXR1cm4gdGhpcy5jb3B5KHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpO1xuICB9IGVsc2UgaWYgKCFicm9rZW5UeXBlZEFycmF5ICYmICF0aGlzSXNCdWZmZXIgJiYgIXRhcmdldElzQnVmZmVyICYmXG4gICAgQnVmZmVyaXNoLmlzVmlldyh0aGlzKSAmJiBCdWZmZXJpc2guaXNWaWV3KHRhcmdldCkpIHtcbiAgICAvLyBVaW50OEFycmF5IHRvIFVpbnQ4QXJyYXkgKGV4Y2VwdCBmb3IgbWlub3Igc29tZSBicm93c2VycylcbiAgICB2YXIgYnVmZmVyID0gKHN0YXJ0IHx8IGVuZCAhPSBudWxsKSA/IHNsaWNlLmNhbGwodGhpcywgc3RhcnQsIGVuZCkgOiB0aGlzO1xuICAgIHRhcmdldC5zZXQoYnVmZmVyLCB0YXJnZXRTdGFydCk7XG4gICAgcmV0dXJuIGJ1ZmZlci5sZW5ndGg7XG4gIH0gZWxzZSB7XG4gICAgLy8gb3RoZXIgY2FzZXNcbiAgICByZXR1cm4gQnVmZmVyTGl0ZS5jb3B5LmNhbGwodGhpcywgdGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0gW3N0YXJ0XSB7TnVtYmVyfVxuICogQHBhcmFtIFtlbmRdIHtOdW1iZXJ9XG4gKiBAcmV0dXJucyB7QnVmZmVyfFVpbnQ4QXJyYXl8QXJyYXl9XG4gKi9cblxuZnVuY3Rpb24gc2xpY2Uoc3RhcnQsIGVuZCkge1xuICAvLyBmb3IgQnVmZmVyLCBVaW50OEFycmF5IChleGNlcHQgZm9yIG1pbm9yIHNvbWUgYnJvd3NlcnMpIGFuZCBBcnJheVxuICB2YXIgZiA9IHRoaXMuc2xpY2UgfHwgKCFicm9rZW5UeXBlZEFycmF5ICYmIHRoaXMuc3ViYXJyYXkpO1xuICBpZiAoZikgcmV0dXJuIGYuY2FsbCh0aGlzLCBzdGFydCwgZW5kKTtcblxuICAvLyBVaW50OEFycmF5IChmb3IgbWlub3Igc29tZSBicm93c2VycylcbiAgdmFyIHRhcmdldCA9IEJ1ZmZlcmlzaC5hbGxvYy5jYWxsKHRoaXMsIGVuZCAtIHN0YXJ0KTtcbiAgY29weS5jYWxsKHRoaXMsIHRhcmdldCwgMCwgc3RhcnQsIGVuZCk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qKlxuICogQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZygpXG4gKlxuICogQHBhcmFtIFtlbmNvZGluZ10ge1N0cmluZ30gaWdub3JlZFxuICogQHBhcmFtIFtzdGFydF0ge051bWJlcn1cbiAqIEBwYXJhbSBbZW5kXSB7TnVtYmVyfVxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiB0b1N0cmluZyhlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgZiA9ICghaXNCdWZmZXJTaGltICYmIEJ1ZmZlcmlzaC5pc0J1ZmZlcih0aGlzKSkgPyB0aGlzLnRvU3RyaW5nIDogQnVmZmVyTGl0ZS50b1N0cmluZztcbiAgcmV0dXJuIGYuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGdlbihtZXRob2QpIHtcbiAgcmV0dXJuIHdyYXA7XG5cbiAgZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgZiA9IHRoaXNbbWV0aG9kXSB8fCBCdWZmZXJMaXRlW21ldGhvZF07XG4gICAgcmV0dXJuIGYuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxufVxuIiwiLy8gYnVmZmVyaXNoLXVpbnQ4YXJyYXkuanNcblxudmFyIEJ1ZmZlcmlzaCA9IHJlcXVpcmUoXCIuL2J1ZmZlcmlzaFwiKTtcblxudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IEJ1ZmZlcmlzaC5oYXNBcnJheUJ1ZmZlciA/IGFsbG9jKDApIDogW107XG5cbmV4cG9ydHMuYWxsb2MgPSBhbGxvYztcbmV4cG9ydHMuY29uY2F0ID0gQnVmZmVyaXNoLmNvbmNhdDtcbmV4cG9ydHMuZnJvbSA9IGZyb207XG5cbi8qKlxuICogQHBhcmFtIHNpemUge051bWJlcn1cbiAqIEByZXR1cm5zIHtCdWZmZXJ8VWludDhBcnJheXxBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiBhbGxvYyhzaXplKSB7XG4gIHJldHVybiBuZXcgVWludDhBcnJheShzaXplKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gdmFsdWUge0FycmF5fEFycmF5QnVmZmVyfEJ1ZmZlcnxTdHJpbmd9XG4gKiBAcmV0dXJucyB7VWludDhBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiBmcm9tKHZhbHVlKSB7XG4gIGlmIChCdWZmZXJpc2guaXNWaWV3KHZhbHVlKSkge1xuICAgIC8vIFR5cGVkQXJyYXkgdG8gQXJyYXlCdWZmZXJcbiAgICB2YXIgYnl0ZU9mZnNldCA9IHZhbHVlLmJ5dGVPZmZzZXQ7XG4gICAgdmFyIGJ5dGVMZW5ndGggPSB2YWx1ZS5ieXRlTGVuZ3RoO1xuICAgIHZhbHVlID0gdmFsdWUuYnVmZmVyO1xuICAgIGlmICh2YWx1ZS5ieXRlTGVuZ3RoICE9PSBieXRlTGVuZ3RoKSB7XG4gICAgICBpZiAodmFsdWUuc2xpY2UpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZShieXRlT2Zmc2V0LCBieXRlT2Zmc2V0ICsgYnl0ZUxlbmd0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBbmRyb2lkIDQuMSBkb2VzIG5vdCBoYXZlIEFycmF5QnVmZmVyLnByb3RvdHlwZS5zbGljZVxuICAgICAgICB2YWx1ZSA9IG5ldyBVaW50OEFycmF5KHZhbHVlKTtcbiAgICAgICAgaWYgKHZhbHVlLmJ5dGVMZW5ndGggIT09IGJ5dGVMZW5ndGgpIHtcbiAgICAgICAgICAvLyBUeXBlZEFycmF5IHRvIEFycmF5QnVmZmVyIHRvIFVpbnQ4QXJyYXkgdG8gQXJyYXlcbiAgICAgICAgICB2YWx1ZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHZhbHVlLCBieXRlT2Zmc2V0LCBieXRlT2Zmc2V0ICsgYnl0ZUxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgLy8gU3RyaW5nIHRvIFVpbnQ4QXJyYXlcbiAgICByZXR1cm4gQnVmZmVyaXNoLmZyb20uY2FsbChleHBvcnRzLCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIGEgbnVtYmVyJyk7XG4gIH1cblxuICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkodmFsdWUpO1xufVxuIiwiLy8gYnVmZmVyaXNoLmpzXG5cbnZhciBCdWZmZXIgPSBleHBvcnRzLmdsb2JhbCA9IHJlcXVpcmUoXCIuL2J1ZmZlci1nbG9iYWxcIik7XG52YXIgaGFzQnVmZmVyID0gZXhwb3J0cy5oYXNCdWZmZXIgPSBCdWZmZXIgJiYgISFCdWZmZXIuaXNCdWZmZXI7XG52YXIgaGFzQXJyYXlCdWZmZXIgPSBleHBvcnRzLmhhc0FycmF5QnVmZmVyID0gKFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBBcnJheUJ1ZmZlcik7XG5cbnZhciBpc0FycmF5ID0gZXhwb3J0cy5pc0FycmF5ID0gcmVxdWlyZShcImlzYXJyYXlcIik7XG5leHBvcnRzLmlzQXJyYXlCdWZmZXIgPSBoYXNBcnJheUJ1ZmZlciA/IGlzQXJyYXlCdWZmZXIgOiBfZmFsc2U7XG52YXIgaXNCdWZmZXIgPSBleHBvcnRzLmlzQnVmZmVyID0gaGFzQnVmZmVyID8gQnVmZmVyLmlzQnVmZmVyIDogX2ZhbHNlO1xudmFyIGlzVmlldyA9IGV4cG9ydHMuaXNWaWV3ID0gaGFzQXJyYXlCdWZmZXIgPyAoQXJyYXlCdWZmZXIuaXNWaWV3IHx8IF9pcyhcIkFycmF5QnVmZmVyXCIsIFwiYnVmZmVyXCIpKSA6IF9mYWxzZTtcblxuZXhwb3J0cy5hbGxvYyA9IGFsbG9jO1xuZXhwb3J0cy5jb25jYXQgPSBjb25jYXQ7XG5leHBvcnRzLmZyb20gPSBmcm9tO1xuXG52YXIgQnVmZmVyQXJyYXkgPSBleHBvcnRzLkFycmF5ID0gcmVxdWlyZShcIi4vYnVmZmVyaXNoLWFycmF5XCIpO1xudmFyIEJ1ZmZlckJ1ZmZlciA9IGV4cG9ydHMuQnVmZmVyID0gcmVxdWlyZShcIi4vYnVmZmVyaXNoLWJ1ZmZlclwiKTtcbnZhciBCdWZmZXJVaW50OEFycmF5ID0gZXhwb3J0cy5VaW50OEFycmF5ID0gcmVxdWlyZShcIi4vYnVmZmVyaXNoLXVpbnQ4YXJyYXlcIik7XG52YXIgQnVmZmVyUHJvdG8gPSBleHBvcnRzLnByb3RvdHlwZSA9IHJlcXVpcmUoXCIuL2J1ZmZlcmlzaC1wcm90b1wiKTtcblxuLyoqXG4gKiBAcGFyYW0gdmFsdWUge0FycmF5fEFycmF5QnVmZmVyfEJ1ZmZlcnxTdHJpbmd9XG4gKiBAcmV0dXJucyB7QnVmZmVyfFVpbnQ4QXJyYXl8QXJyYXl9XG4gKi9cblxuZnVuY3Rpb24gZnJvbSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcuY2FsbCh0aGlzLCB2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGF1dG8odGhpcykuZnJvbSh2YWx1ZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0gc2l6ZSB7TnVtYmVyfVxuICogQHJldHVybnMge0J1ZmZlcnxVaW50OEFycmF5fEFycmF5fVxuICovXG5cbmZ1bmN0aW9uIGFsbG9jKHNpemUpIHtcbiAgcmV0dXJuIGF1dG8odGhpcykuYWxsb2Moc2l6ZSk7XG59XG5cbi8qKlxuICogQHBhcmFtIGxpc3Qge0FycmF5fSBhcnJheSBvZiAoQnVmZmVyfFVpbnQ4QXJyYXl8QXJyYXkpc1xuICogQHBhcmFtIFtsZW5ndGhdXG4gKiBAcmV0dXJucyB7QnVmZmVyfFVpbnQ4QXJyYXl8QXJyYXl9XG4gKi9cblxuZnVuY3Rpb24gY29uY2F0KGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IDA7XG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChsaXN0LCBkcnlydW4pO1xuICB9XG4gIHZhciByZWYgPSAodGhpcyAhPT0gZXhwb3J0cykgJiYgdGhpcyB8fCBsaXN0WzBdO1xuICB2YXIgcmVzdWx0ID0gYWxsb2MuY2FsbChyZWYsIGxlbmd0aCk7XG4gIHZhciBvZmZzZXQgPSAwO1xuICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGxpc3QsIGFwcGVuZCk7XG4gIHJldHVybiByZXN1bHQ7XG5cbiAgZnVuY3Rpb24gZHJ5cnVuKGJ1ZmZlcikge1xuICAgIGxlbmd0aCArPSBidWZmZXIubGVuZ3RoO1xuICB9XG5cbiAgZnVuY3Rpb24gYXBwZW5kKGJ1ZmZlcikge1xuICAgIG9mZnNldCArPSBCdWZmZXJQcm90by5jb3B5LmNhbGwoYnVmZmVyLCByZXN1bHQsIG9mZnNldCk7XG4gIH1cbn1cblxudmFyIF9pc0FycmF5QnVmZmVyID0gX2lzKFwiQXJyYXlCdWZmZXJcIik7XG5cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB8fCBfaXNBcnJheUJ1ZmZlcih2YWx1ZSk7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmcm9tU3RyaW5nKHZhbHVlKSB7XG4gIHZhciBleHBlY3RlZCA9IHZhbHVlLmxlbmd0aCAqIDM7XG4gIHZhciB0aGF0ID0gYWxsb2MuY2FsbCh0aGlzLCBleHBlY3RlZCk7XG4gIHZhciBhY3R1YWwgPSBCdWZmZXJQcm90by53cml0ZS5jYWxsKHRoYXQsIHZhbHVlKTtcbiAgaWYgKGV4cGVjdGVkICE9PSBhY3R1YWwpIHtcbiAgICB0aGF0ID0gQnVmZmVyUHJvdG8uc2xpY2UuY2FsbCh0aGF0LCAwLCBhY3R1YWwpO1xuICB9XG4gIHJldHVybiB0aGF0O1xufVxuXG5mdW5jdGlvbiBhdXRvKHRoYXQpIHtcbiAgcmV0dXJuIGlzQnVmZmVyKHRoYXQpID8gQnVmZmVyQnVmZmVyXG4gICAgOiBpc1ZpZXcodGhhdCkgPyBCdWZmZXJVaW50OEFycmF5XG4gICAgOiBpc0FycmF5KHRoYXQpID8gQnVmZmVyQXJyYXlcbiAgICA6IGhhc0J1ZmZlciA/IEJ1ZmZlckJ1ZmZlclxuICAgIDogaGFzQXJyYXlCdWZmZXIgPyBCdWZmZXJVaW50OEFycmF5XG4gICAgOiBCdWZmZXJBcnJheTtcbn1cblxuZnVuY3Rpb24gX2ZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF9pcyhuYW1lLCBrZXkpIHtcbiAgLyoganNoaW50IGVxbnVsbDp0cnVlICovXG4gIG5hbWUgPSBcIltvYmplY3QgXCIgKyBuYW1lICsgXCJdXCI7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiAodmFsdWUgIT0gbnVsbCkgJiYge30udG9TdHJpbmcuY2FsbChrZXkgPyB2YWx1ZVtrZXldIDogdmFsdWUpID09PSBuYW1lO1xuICB9O1xufSIsIi8vIGNvZGVjLWJhc2UuanNcblxudmFyIElTX0FSUkFZID0gcmVxdWlyZShcImlzYXJyYXlcIik7XG5cbmV4cG9ydHMuY3JlYXRlQ29kZWMgPSBjcmVhdGVDb2RlYztcbmV4cG9ydHMuaW5zdGFsbCA9IGluc3RhbGw7XG5leHBvcnRzLmZpbHRlciA9IGZpbHRlcjtcblxudmFyIEJ1ZmZlcmlzaCA9IHJlcXVpcmUoXCIuL2J1ZmZlcmlzaFwiKTtcblxuZnVuY3Rpb24gQ29kZWMob3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQ29kZWMpKSByZXR1cm4gbmV3IENvZGVjKG9wdGlvbnMpO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB0aGlzLmluaXQoKTtcbn1cblxuQ29kZWMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy51aW50OGFycmF5KSB7XG4gICAgdGhpcy5idWZmZXJpc2ggPSBCdWZmZXJpc2guVWludDhBcnJheTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuZnVuY3Rpb24gaW5zdGFsbChwcm9wcykge1xuICBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHtcbiAgICBDb2RlYy5wcm90b3R5cGVba2V5XSA9IGFkZChDb2RlYy5wcm90b3R5cGVba2V5XSwgcHJvcHNba2V5XSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkKGEsIGIpIHtcbiAgcmV0dXJuIChhICYmIGIpID8gYWIgOiAoYSB8fCBiKTtcblxuICBmdW5jdGlvbiBhYigpIHtcbiAgICBhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIGIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBqb2luKGZpbHRlcnMpIHtcbiAgZmlsdGVycyA9IGZpbHRlcnMuc2xpY2UoKTtcblxuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZmlsdGVycy5yZWR1Y2UoaXRlcmF0b3IsIHZhbHVlKTtcbiAgfTtcblxuICBmdW5jdGlvbiBpdGVyYXRvcih2YWx1ZSwgZmlsdGVyKSB7XG4gICAgcmV0dXJuIGZpbHRlcih2YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmlsdGVyKGZpbHRlcikge1xuICByZXR1cm4gSVNfQVJSQVkoZmlsdGVyKSA/IGpvaW4oZmlsdGVyKSA6IGZpbHRlcjtcbn1cblxuLy8gQHB1YmxpY1xuLy8gbXNncGFjay5jcmVhdGVDb2RlYygpXG5cbmZ1bmN0aW9uIGNyZWF0ZUNvZGVjKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBDb2RlYyhvcHRpb25zKTtcbn1cblxuLy8gZGVmYXVsdCBzaGFyZWQgY29kZWNcblxuZXhwb3J0cy5wcmVzZXQgPSBjcmVhdGVDb2RlYyh7cHJlc2V0OiB0cnVlfSk7XG4iLCIvLyBjb2RlYy5qc1xuXG4vLyBsb2FkIGJvdGggaW50ZXJmYWNlc1xucmVxdWlyZShcIi4vcmVhZC1jb3JlXCIpO1xucmVxdWlyZShcIi4vd3JpdGUtY29yZVwiKTtcblxuLy8gQHB1YmxpY1xuLy8gbXNncGFjay5jb2RlYy5wcmVzZXRcblxuZXhwb3J0cy5jb2RlYyA9IHtcbiAgcHJlc2V0OiByZXF1aXJlKFwiLi9jb2RlYy1iYXNlXCIpLnByZXNldFxufTtcbiIsIi8vIGRlY29kZS1idWZmZXIuanNcblxuZXhwb3J0cy5EZWNvZGVCdWZmZXIgPSBEZWNvZGVCdWZmZXI7XG5cbnZhciBwcmVzZXQgPSByZXF1aXJlKFwiLi9yZWFkLWNvcmVcIikucHJlc2V0O1xuXG52YXIgRmxleERlY29kZXIgPSByZXF1aXJlKFwiLi9mbGV4LWJ1ZmZlclwiKS5GbGV4RGVjb2RlcjtcblxuRmxleERlY29kZXIubWl4aW4oRGVjb2RlQnVmZmVyLnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIERlY29kZUJ1ZmZlcihvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBEZWNvZGVCdWZmZXIpKSByZXR1cm4gbmV3IERlY29kZUJ1ZmZlcihvcHRpb25zKTtcblxuICBpZiAob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgaWYgKG9wdGlvbnMuY29kZWMpIHtcbiAgICAgIHZhciBjb2RlYyA9IHRoaXMuY29kZWMgPSBvcHRpb25zLmNvZGVjO1xuICAgICAgaWYgKGNvZGVjLmJ1ZmZlcmlzaCkgdGhpcy5idWZmZXJpc2ggPSBjb2RlYy5idWZmZXJpc2g7XG4gICAgfVxuICB9XG59XG5cbkRlY29kZUJ1ZmZlci5wcm90b3R5cGUuY29kZWMgPSBwcmVzZXQ7XG5cbkRlY29kZUJ1ZmZlci5wcm90b3R5cGUuZmV0Y2ggPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuY29kZWMuZGVjb2RlKHRoaXMpO1xufTtcbiIsIi8vIGRlY29kZS5qc1xuXG5leHBvcnRzLmRlY29kZSA9IGRlY29kZTtcblxudmFyIERlY29kZUJ1ZmZlciA9IHJlcXVpcmUoXCIuL2RlY29kZS1idWZmZXJcIikuRGVjb2RlQnVmZmVyO1xuXG5mdW5jdGlvbiBkZWNvZGUoaW5wdXQsIG9wdGlvbnMpIHtcbiAgdmFyIGRlY29kZXIgPSBuZXcgRGVjb2RlQnVmZmVyKG9wdGlvbnMpO1xuICBkZWNvZGVyLndyaXRlKGlucHV0KTtcbiAgcmV0dXJuIGRlY29kZXIucmVhZCgpO1xufSIsIi8vIGRlY29kZXIuanNcblxuZXhwb3J0cy5EZWNvZGVyID0gRGVjb2RlcjtcblxudmFyIEV2ZW50TGl0ZSA9IHJlcXVpcmUoXCJldmVudC1saXRlXCIpO1xudmFyIERlY29kZUJ1ZmZlciA9IHJlcXVpcmUoXCIuL2RlY29kZS1idWZmZXJcIikuRGVjb2RlQnVmZmVyO1xuXG5mdW5jdGlvbiBEZWNvZGVyKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIERlY29kZXIpKSByZXR1cm4gbmV3IERlY29kZXIob3B0aW9ucyk7XG4gIERlY29kZUJ1ZmZlci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xufVxuXG5EZWNvZGVyLnByb3RvdHlwZSA9IG5ldyBEZWNvZGVCdWZmZXIoKTtcblxuRXZlbnRMaXRlLm1peGluKERlY29kZXIucHJvdG90eXBlKTtcblxuRGVjb2Rlci5wcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24oY2h1bmspIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHRoaXMud3JpdGUoY2h1bmspO1xuICB0aGlzLmZsdXNoKCk7XG59O1xuXG5EZWNvZGVyLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oY2h1bmspIHtcbiAgdGhpcy5lbWl0KFwiZGF0YVwiLCBjaHVuayk7XG59O1xuXG5EZWNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihjaHVuaykge1xuICB0aGlzLmRlY29kZShjaHVuayk7XG4gIHRoaXMuZW1pdChcImVuZFwiKTtcbn07XG4iLCIvLyBlbmNvZGUtYnVmZmVyLmpzXG5cbmV4cG9ydHMuRW5jb2RlQnVmZmVyID0gRW5jb2RlQnVmZmVyO1xuXG52YXIgcHJlc2V0ID0gcmVxdWlyZShcIi4vd3JpdGUtY29yZVwiKS5wcmVzZXQ7XG5cbnZhciBGbGV4RW5jb2RlciA9IHJlcXVpcmUoXCIuL2ZsZXgtYnVmZmVyXCIpLkZsZXhFbmNvZGVyO1xuXG5GbGV4RW5jb2Rlci5taXhpbihFbmNvZGVCdWZmZXIucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gRW5jb2RlQnVmZmVyKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEVuY29kZUJ1ZmZlcikpIHJldHVybiBuZXcgRW5jb2RlQnVmZmVyKG9wdGlvbnMpO1xuXG4gIGlmIChvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICBpZiAob3B0aW9ucy5jb2RlYykge1xuICAgICAgdmFyIGNvZGVjID0gdGhpcy5jb2RlYyA9IG9wdGlvbnMuY29kZWM7XG4gICAgICBpZiAoY29kZWMuYnVmZmVyaXNoKSB0aGlzLmJ1ZmZlcmlzaCA9IGNvZGVjLmJ1ZmZlcmlzaDtcbiAgICB9XG4gIH1cbn1cblxuRW5jb2RlQnVmZmVyLnByb3RvdHlwZS5jb2RlYyA9IHByZXNldDtcblxuRW5jb2RlQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gIHRoaXMuY29kZWMuZW5jb2RlKHRoaXMsIGlucHV0KTtcbn07XG4iLCIvLyBlbmNvZGUuanNcblxuZXhwb3J0cy5lbmNvZGUgPSBlbmNvZGU7XG5cbnZhciBFbmNvZGVCdWZmZXIgPSByZXF1aXJlKFwiLi9lbmNvZGUtYnVmZmVyXCIpLkVuY29kZUJ1ZmZlcjtcblxuZnVuY3Rpb24gZW5jb2RlKGlucHV0LCBvcHRpb25zKSB7XG4gIHZhciBlbmNvZGVyID0gbmV3IEVuY29kZUJ1ZmZlcihvcHRpb25zKTtcbiAgZW5jb2Rlci53cml0ZShpbnB1dCk7XG4gIHJldHVybiBlbmNvZGVyLnJlYWQoKTtcbn1cbiIsIi8vIGVuY29kZXIuanNcblxuZXhwb3J0cy5FbmNvZGVyID0gRW5jb2RlcjtcblxudmFyIEV2ZW50TGl0ZSA9IHJlcXVpcmUoXCJldmVudC1saXRlXCIpO1xudmFyIEVuY29kZUJ1ZmZlciA9IHJlcXVpcmUoXCIuL2VuY29kZS1idWZmZXJcIikuRW5jb2RlQnVmZmVyO1xuXG5mdW5jdGlvbiBFbmNvZGVyKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEVuY29kZXIpKSByZXR1cm4gbmV3IEVuY29kZXIob3B0aW9ucyk7XG4gIEVuY29kZUJ1ZmZlci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xufVxuXG5FbmNvZGVyLnByb3RvdHlwZSA9IG5ldyBFbmNvZGVCdWZmZXIoKTtcblxuRXZlbnRMaXRlLm1peGluKEVuY29kZXIucHJvdG90eXBlKTtcblxuRW5jb2Rlci5wcm90b3R5cGUuZW5jb2RlID0gZnVuY3Rpb24oY2h1bmspIHtcbiAgdGhpcy53cml0ZShjaHVuayk7XG4gIHRoaXMuZW1pdChcImRhdGFcIiwgdGhpcy5yZWFkKCkpO1xufTtcblxuRW5jb2Rlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oY2h1bmspIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHRoaXMuZW5jb2RlKGNodW5rKTtcbiAgdGhpcy5mbHVzaCgpO1xuICB0aGlzLmVtaXQoXCJlbmRcIik7XG59O1xuIiwiLy8gZXh0LWJ1ZmZlci5qc1xuXG5leHBvcnRzLkV4dEJ1ZmZlciA9IEV4dEJ1ZmZlcjtcblxudmFyIEJ1ZmZlcmlzaCA9IHJlcXVpcmUoXCIuL2J1ZmZlcmlzaFwiKTtcblxuZnVuY3Rpb24gRXh0QnVmZmVyKGJ1ZmZlciwgdHlwZSkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRXh0QnVmZmVyKSkgcmV0dXJuIG5ldyBFeHRCdWZmZXIoYnVmZmVyLCB0eXBlKTtcbiAgdGhpcy5idWZmZXIgPSBCdWZmZXJpc2guZnJvbShidWZmZXIpO1xuICB0aGlzLnR5cGUgPSB0eXBlO1xufVxuIiwiLy8gZXh0LXBhY2tlci5qc1xuXG5leHBvcnRzLnNldEV4dFBhY2tlcnMgPSBzZXRFeHRQYWNrZXJzO1xuXG52YXIgQnVmZmVyaXNoID0gcmVxdWlyZShcIi4vYnVmZmVyaXNoXCIpO1xudmFyIEJ1ZmZlciA9IEJ1ZmZlcmlzaC5nbG9iYWw7XG52YXIgcGFja1R5cGVkQXJyYXkgPSBCdWZmZXJpc2guVWludDhBcnJheS5mcm9tO1xudmFyIF9lbmNvZGU7XG5cbnZhciBFUlJPUl9DT0xVTU5TID0ge25hbWU6IDEsIG1lc3NhZ2U6IDEsIHN0YWNrOiAxLCBjb2x1bW5OdW1iZXI6IDEsIGZpbGVOYW1lOiAxLCBsaW5lTnVtYmVyOiAxfTtcblxuZnVuY3Rpb24gc2V0RXh0UGFja2Vycyhjb2RlYykge1xuICBjb2RlYy5hZGRFeHRQYWNrZXIoMHgwRSwgRXJyb3IsIFtwYWNrRXJyb3IsIGVuY29kZV0pO1xuICBjb2RlYy5hZGRFeHRQYWNrZXIoMHgwMSwgRXZhbEVycm9yLCBbcGFja0Vycm9yLCBlbmNvZGVdKTtcbiAgY29kZWMuYWRkRXh0UGFja2VyKDB4MDIsIFJhbmdlRXJyb3IsIFtwYWNrRXJyb3IsIGVuY29kZV0pO1xuICBjb2RlYy5hZGRFeHRQYWNrZXIoMHgwMywgUmVmZXJlbmNlRXJyb3IsIFtwYWNrRXJyb3IsIGVuY29kZV0pO1xuICBjb2RlYy5hZGRFeHRQYWNrZXIoMHgwNCwgU3ludGF4RXJyb3IsIFtwYWNrRXJyb3IsIGVuY29kZV0pO1xuICBjb2RlYy5hZGRFeHRQYWNrZXIoMHgwNSwgVHlwZUVycm9yLCBbcGFja0Vycm9yLCBlbmNvZGVdKTtcbiAgY29kZWMuYWRkRXh0UGFja2VyKDB4MDYsIFVSSUVycm9yLCBbcGFja0Vycm9yLCBlbmNvZGVdKTtcblxuICBjb2RlYy5hZGRFeHRQYWNrZXIoMHgwQSwgUmVnRXhwLCBbcGFja1JlZ0V4cCwgZW5jb2RlXSk7XG4gIGNvZGVjLmFkZEV4dFBhY2tlcigweDBCLCBCb29sZWFuLCBbcGFja1ZhbHVlT2YsIGVuY29kZV0pO1xuICBjb2RlYy5hZGRFeHRQYWNrZXIoMHgwQywgU3RyaW5nLCBbcGFja1ZhbHVlT2YsIGVuY29kZV0pO1xuICBjb2RlYy5hZGRFeHRQYWNrZXIoMHgwRCwgRGF0ZSwgW051bWJlciwgZW5jb2RlXSk7XG4gIGNvZGVjLmFkZEV4dFBhY2tlcigweDBGLCBOdW1iZXIsIFtwYWNrVmFsdWVPZiwgZW5jb2RlXSk7XG5cbiAgaWYgKFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBVaW50OEFycmF5KSB7XG4gICAgY29kZWMuYWRkRXh0UGFja2VyKDB4MTEsIEludDhBcnJheSwgcGFja1R5cGVkQXJyYXkpO1xuICAgIGNvZGVjLmFkZEV4dFBhY2tlcigweDEyLCBVaW50OEFycmF5LCBwYWNrVHlwZWRBcnJheSk7XG4gICAgY29kZWMuYWRkRXh0UGFja2VyKDB4MTMsIEludDE2QXJyYXksIHBhY2tUeXBlZEFycmF5KTtcbiAgICBjb2RlYy5hZGRFeHRQYWNrZXIoMHgxNCwgVWludDE2QXJyYXksIHBhY2tUeXBlZEFycmF5KTtcbiAgICBjb2RlYy5hZGRFeHRQYWNrZXIoMHgxNSwgSW50MzJBcnJheSwgcGFja1R5cGVkQXJyYXkpO1xuICAgIGNvZGVjLmFkZEV4dFBhY2tlcigweDE2LCBVaW50MzJBcnJheSwgcGFja1R5cGVkQXJyYXkpO1xuICAgIGNvZGVjLmFkZEV4dFBhY2tlcigweDE3LCBGbG9hdDMyQXJyYXksIHBhY2tUeXBlZEFycmF5KTtcblxuICAgIC8vIFBoYW50b21KUy8xLjkuNyBkb2Vzbid0IGhhdmUgRmxvYXQ2NEFycmF5XG4gICAgaWYgKFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBGbG9hdDY0QXJyYXkpIHtcbiAgICAgIGNvZGVjLmFkZEV4dFBhY2tlcigweDE4LCBGbG9hdDY0QXJyYXksIHBhY2tUeXBlZEFycmF5KTtcbiAgICB9XG5cbiAgICAvLyBJRTEwIGRvZXNuJ3QgaGF2ZSBVaW50OENsYW1wZWRBcnJheVxuICAgIGlmIChcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkpIHtcbiAgICAgIGNvZGVjLmFkZEV4dFBhY2tlcigweDE5LCBVaW50OENsYW1wZWRBcnJheSwgcGFja1R5cGVkQXJyYXkpO1xuICAgIH1cblxuICAgIGNvZGVjLmFkZEV4dFBhY2tlcigweDFBLCBBcnJheUJ1ZmZlciwgcGFja1R5cGVkQXJyYXkpO1xuICAgIGNvZGVjLmFkZEV4dFBhY2tlcigweDFELCBEYXRhVmlldywgcGFja1R5cGVkQXJyYXkpO1xuICB9XG5cbiAgaWYgKEJ1ZmZlcmlzaC5oYXNCdWZmZXIpIHtcbiAgICBjb2RlYy5hZGRFeHRQYWNrZXIoMHgxQiwgQnVmZmVyLCBCdWZmZXJpc2guZnJvbSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZW5jb2RlKGlucHV0KSB7XG4gIGlmICghX2VuY29kZSkgX2VuY29kZSA9IHJlcXVpcmUoXCIuL2VuY29kZVwiKS5lbmNvZGU7IC8vIGxhenkgbG9hZFxuICByZXR1cm4gX2VuY29kZShpbnB1dCk7XG59XG5cbmZ1bmN0aW9uIHBhY2tWYWx1ZU9mKHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUpLnZhbHVlT2YoKTtcbn1cblxuZnVuY3Rpb24gcGFja1JlZ0V4cCh2YWx1ZSkge1xuICB2YWx1ZSA9IFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkuc3BsaXQoXCIvXCIpO1xuICB2YWx1ZS5zaGlmdCgpO1xuICB2YXIgb3V0ID0gW3ZhbHVlLnBvcCgpXTtcbiAgb3V0LnVuc2hpZnQodmFsdWUuam9pbihcIi9cIikpO1xuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBwYWNrRXJyb3IodmFsdWUpIHtcbiAgdmFyIG91dCA9IHt9O1xuICBmb3IgKHZhciBrZXkgaW4gRVJST1JfQ09MVU1OUykge1xuICAgIG91dFtrZXldID0gdmFsdWVba2V5XTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiLy8gZXh0LXVucGFja2VyLmpzXG5cbmV4cG9ydHMuc2V0RXh0VW5wYWNrZXJzID0gc2V0RXh0VW5wYWNrZXJzO1xuXG52YXIgQnVmZmVyaXNoID0gcmVxdWlyZShcIi4vYnVmZmVyaXNoXCIpO1xudmFyIEJ1ZmZlciA9IEJ1ZmZlcmlzaC5nbG9iYWw7XG52YXIgX2RlY29kZTtcblxudmFyIEVSUk9SX0NPTFVNTlMgPSB7bmFtZTogMSwgbWVzc2FnZTogMSwgc3RhY2s6IDEsIGNvbHVtbk51bWJlcjogMSwgZmlsZU5hbWU6IDEsIGxpbmVOdW1iZXI6IDF9O1xuXG5mdW5jdGlvbiBzZXRFeHRVbnBhY2tlcnMoY29kZWMpIHtcbiAgY29kZWMuYWRkRXh0VW5wYWNrZXIoMHgwRSwgW2RlY29kZSwgdW5wYWNrRXJyb3IoRXJyb3IpXSk7XG4gIGNvZGVjLmFkZEV4dFVucGFja2VyKDB4MDEsIFtkZWNvZGUsIHVucGFja0Vycm9yKEV2YWxFcnJvcildKTtcbiAgY29kZWMuYWRkRXh0VW5wYWNrZXIoMHgwMiwgW2RlY29kZSwgdW5wYWNrRXJyb3IoUmFuZ2VFcnJvcildKTtcbiAgY29kZWMuYWRkRXh0VW5wYWNrZXIoMHgwMywgW2RlY29kZSwgdW5wYWNrRXJyb3IoUmVmZXJlbmNlRXJyb3IpXSk7XG4gIGNvZGVjLmFkZEV4dFVucGFja2VyKDB4MDQsIFtkZWNvZGUsIHVucGFja0Vycm9yKFN5bnRheEVycm9yKV0pO1xuICBjb2RlYy5hZGRFeHRVbnBhY2tlcigweDA1LCBbZGVjb2RlLCB1bnBhY2tFcnJvcihUeXBlRXJyb3IpXSk7XG4gIGNvZGVjLmFkZEV4dFVucGFja2VyKDB4MDYsIFtkZWNvZGUsIHVucGFja0Vycm9yKFVSSUVycm9yKV0pO1xuXG4gIGNvZGVjLmFkZEV4dFVucGFja2VyKDB4MEEsIFtkZWNvZGUsIHVucGFja1JlZ0V4cF0pO1xuICBjb2RlYy5hZGRFeHRVbnBhY2tlcigweDBCLCBbZGVjb2RlLCB1bnBhY2tDbGFzcyhCb29sZWFuKV0pO1xuICBjb2RlYy5hZGRFeHRVbnBhY2tlcigweDBDLCBbZGVjb2RlLCB1bnBhY2tDbGFzcyhTdHJpbmcpXSk7XG4gIGNvZGVjLmFkZEV4dFVucGFja2VyKDB4MEQsIFtkZWNvZGUsIHVucGFja0NsYXNzKERhdGUpXSk7XG4gIGNvZGVjLmFkZEV4dFVucGFja2VyKDB4MEYsIFtkZWNvZGUsIHVucGFja0NsYXNzKE51bWJlcildKTtcblxuICBpZiAoXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIFVpbnQ4QXJyYXkpIHtcbiAgICBjb2RlYy5hZGRFeHRVbnBhY2tlcigweDExLCB1bnBhY2tDbGFzcyhJbnQ4QXJyYXkpKTtcbiAgICBjb2RlYy5hZGRFeHRVbnBhY2tlcigweDEyLCB1bnBhY2tDbGFzcyhVaW50OEFycmF5KSk7XG4gICAgY29kZWMuYWRkRXh0VW5wYWNrZXIoMHgxMywgW3VucGFja0FycmF5QnVmZmVyLCB1bnBhY2tDbGFzcyhJbnQxNkFycmF5KV0pO1xuICAgIGNvZGVjLmFkZEV4dFVucGFja2VyKDB4MTQsIFt1bnBhY2tBcnJheUJ1ZmZlciwgdW5wYWNrQ2xhc3MoVWludDE2QXJyYXkpXSk7XG4gICAgY29kZWMuYWRkRXh0VW5wYWNrZXIoMHgxNSwgW3VucGFja0FycmF5QnVmZmVyLCB1bnBhY2tDbGFzcyhJbnQzMkFycmF5KV0pO1xuICAgIGNvZGVjLmFkZEV4dFVucGFja2VyKDB4MTYsIFt1bnBhY2tBcnJheUJ1ZmZlciwgdW5wYWNrQ2xhc3MoVWludDMyQXJyYXkpXSk7XG4gICAgY29kZWMuYWRkRXh0VW5wYWNrZXIoMHgxNywgW3VucGFja0FycmF5QnVmZmVyLCB1bnBhY2tDbGFzcyhGbG9hdDMyQXJyYXkpXSk7XG5cbiAgICAvLyBQaGFudG9tSlMvMS45LjcgZG9lc24ndCBoYXZlIEZsb2F0NjRBcnJheVxuICAgIGlmIChcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgRmxvYXQ2NEFycmF5KSB7XG4gICAgICBjb2RlYy5hZGRFeHRVbnBhY2tlcigweDE4LCBbdW5wYWNrQXJyYXlCdWZmZXIsIHVucGFja0NsYXNzKEZsb2F0NjRBcnJheSldKTtcbiAgICB9XG5cbiAgICAvLyBJRTEwIGRvZXNuJ3QgaGF2ZSBVaW50OENsYW1wZWRBcnJheVxuICAgIGlmIChcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkpIHtcbiAgICAgIGNvZGVjLmFkZEV4dFVucGFja2VyKDB4MTksIHVucGFja0NsYXNzKFVpbnQ4Q2xhbXBlZEFycmF5KSk7XG4gICAgfVxuXG4gICAgY29kZWMuYWRkRXh0VW5wYWNrZXIoMHgxQSwgdW5wYWNrQXJyYXlCdWZmZXIpO1xuICAgIGNvZGVjLmFkZEV4dFVucGFja2VyKDB4MUQsIFt1bnBhY2tBcnJheUJ1ZmZlciwgdW5wYWNrQ2xhc3MoRGF0YVZpZXcpXSk7XG4gIH1cblxuICBpZiAoQnVmZmVyaXNoLmhhc0J1ZmZlcikge1xuICAgIGNvZGVjLmFkZEV4dFVucGFja2VyKDB4MUIsIHVucGFja0NsYXNzKEJ1ZmZlcikpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlY29kZShpbnB1dCkge1xuICBpZiAoIV9kZWNvZGUpIF9kZWNvZGUgPSByZXF1aXJlKFwiLi9kZWNvZGVcIikuZGVjb2RlOyAvLyBsYXp5IGxvYWRcbiAgcmV0dXJuIF9kZWNvZGUoaW5wdXQpO1xufVxuXG5mdW5jdGlvbiB1bnBhY2tSZWdFeHAodmFsdWUpIHtcbiAgcmV0dXJuIFJlZ0V4cC5hcHBseShudWxsLCB2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHVucGFja0Vycm9yKENsYXNzKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBvdXQgPSBuZXcgQ2xhc3MoKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gRVJST1JfQ09MVU1OUykge1xuICAgICAgb3V0W2tleV0gPSB2YWx1ZVtrZXldO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xufVxuXG5mdW5jdGlvbiB1bnBhY2tDbGFzcyhDbGFzcykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHZhbHVlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdW5wYWNrQXJyYXlCdWZmZXIodmFsdWUpIHtcbiAgcmV0dXJuIChuZXcgVWludDhBcnJheSh2YWx1ZSkpLmJ1ZmZlcjtcbn1cbiIsIi8vIGV4dC5qc1xuXG4vLyBsb2FkIGJvdGggaW50ZXJmYWNlc1xucmVxdWlyZShcIi4vcmVhZC1jb3JlXCIpO1xucmVxdWlyZShcIi4vd3JpdGUtY29yZVwiKTtcblxuZXhwb3J0cy5jcmVhdGVDb2RlYyA9IHJlcXVpcmUoXCIuL2NvZGVjLWJhc2VcIikuY3JlYXRlQ29kZWM7XG4iLCIvLyBmbGV4LWJ1ZmZlci5qc1xuXG5leHBvcnRzLkZsZXhEZWNvZGVyID0gRmxleERlY29kZXI7XG5leHBvcnRzLkZsZXhFbmNvZGVyID0gRmxleEVuY29kZXI7XG5cbnZhciBCdWZmZXJpc2ggPSByZXF1aXJlKFwiLi9idWZmZXJpc2hcIik7XG5cbnZhciBNSU5fQlVGRkVSX1NJWkUgPSAyMDQ4O1xudmFyIE1BWF9CVUZGRVJfU0laRSA9IDY1NTM2O1xudmFyIEJVRkZFUl9TSE9SVEFHRSA9IFwiQlVGRkVSX1NIT1JUQUdFXCI7XG5cbmZ1bmN0aW9uIEZsZXhEZWNvZGVyKCkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRmxleERlY29kZXIpKSByZXR1cm4gbmV3IEZsZXhEZWNvZGVyKCk7XG59XG5cbmZ1bmN0aW9uIEZsZXhFbmNvZGVyKCkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRmxleEVuY29kZXIpKSByZXR1cm4gbmV3IEZsZXhFbmNvZGVyKCk7XG59XG5cbkZsZXhEZWNvZGVyLm1peGluID0gbWl4aW5GYWN0b3J5KGdldERlY29kZXJNZXRob2RzKCkpO1xuRmxleERlY29kZXIubWl4aW4oRmxleERlY29kZXIucHJvdG90eXBlKTtcblxuRmxleEVuY29kZXIubWl4aW4gPSBtaXhpbkZhY3RvcnkoZ2V0RW5jb2Rlck1ldGhvZHMoKSk7XG5GbGV4RW5jb2Rlci5taXhpbihGbGV4RW5jb2Rlci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBnZXREZWNvZGVyTWV0aG9kcygpIHtcbiAgcmV0dXJuIHtcbiAgICBidWZmZXJpc2g6IEJ1ZmZlcmlzaCxcbiAgICB3cml0ZTogd3JpdGUsXG4gICAgZmV0Y2g6IGZldGNoLFxuICAgIGZsdXNoOiBmbHVzaCxcbiAgICBwdXNoOiBwdXNoLFxuICAgIHB1bGw6IHB1bGwsXG4gICAgcmVhZDogcmVhZCxcbiAgICByZXNlcnZlOiByZXNlcnZlLFxuICAgIG9mZnNldDogMFxuICB9O1xuXG4gIGZ1bmN0aW9uIHdyaXRlKGNodW5rKSB7XG4gICAgdmFyIHByZXYgPSB0aGlzLm9mZnNldCA/IEJ1ZmZlcmlzaC5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLmJ1ZmZlciwgdGhpcy5vZmZzZXQpIDogdGhpcy5idWZmZXI7XG4gICAgdGhpcy5idWZmZXIgPSBwcmV2ID8gKGNodW5rID8gdGhpcy5idWZmZXJpc2guY29uY2F0KFtwcmV2LCBjaHVua10pIDogcHJldikgOiBjaHVuaztcbiAgICB0aGlzLm9mZnNldCA9IDA7XG4gIH1cblxuICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICB3aGlsZSAodGhpcy5vZmZzZXQgPCB0aGlzLmJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgIHZhciBzdGFydCA9IHRoaXMub2Zmc2V0O1xuICAgICAgdmFyIHZhbHVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmZldGNoKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlICYmIGUubWVzc2FnZSAhPSBCVUZGRVJfU0hPUlRBR0UpIHRocm93IGU7XG4gICAgICAgIC8vIHJvbGxiYWNrXG4gICAgICAgIHRoaXMub2Zmc2V0ID0gc3RhcnQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdGhpcy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXNlcnZlKGxlbmd0aCkge1xuICAgIHZhciBzdGFydCA9IHRoaXMub2Zmc2V0O1xuICAgIHZhciBlbmQgPSBzdGFydCArIGxlbmd0aDtcbiAgICBpZiAoZW5kID4gdGhpcy5idWZmZXIubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoQlVGRkVSX1NIT1JUQUdFKTtcbiAgICB0aGlzLm9mZnNldCA9IGVuZDtcbiAgICByZXR1cm4gc3RhcnQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RW5jb2Rlck1ldGhvZHMoKSB7XG4gIHJldHVybiB7XG4gICAgYnVmZmVyaXNoOiBCdWZmZXJpc2gsXG4gICAgd3JpdGU6IHdyaXRlLFxuICAgIGZldGNoOiBmZXRjaCxcbiAgICBmbHVzaDogZmx1c2gsXG4gICAgcHVzaDogcHVzaCxcbiAgICBwdWxsOiBwdWxsLFxuICAgIHJlYWQ6IHJlYWQsXG4gICAgcmVzZXJ2ZTogcmVzZXJ2ZSxcbiAgICBzZW5kOiBzZW5kLFxuICAgIG1heEJ1ZmZlclNpemU6IE1BWF9CVUZGRVJfU0laRSxcbiAgICBtaW5CdWZmZXJTaXplOiBNSU5fQlVGRkVSX1NJWkUsXG4gICAgb2Zmc2V0OiAwLFxuICAgIHN0YXJ0OiAwXG4gIH07XG5cbiAgZnVuY3Rpb24gZmV0Y2goKSB7XG4gICAgdmFyIHN0YXJ0ID0gdGhpcy5zdGFydDtcbiAgICBpZiAoc3RhcnQgPCB0aGlzLm9mZnNldCkge1xuICAgICAgdmFyIGVuZCA9IHRoaXMuc3RhcnQgPSB0aGlzLm9mZnNldDtcbiAgICAgIHJldHVybiBCdWZmZXJpc2gucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5idWZmZXIsIHN0YXJ0LCBlbmQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHdoaWxlICh0aGlzLnN0YXJ0IDwgdGhpcy5vZmZzZXQpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZmV0Y2goKTtcbiAgICAgIGlmICh2YWx1ZSkgdGhpcy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwdWxsKCkge1xuICAgIHZhciBidWZmZXJzID0gdGhpcy5idWZmZXJzIHx8ICh0aGlzLmJ1ZmZlcnMgPSBbXSk7XG4gICAgdmFyIGNodW5rID0gYnVmZmVycy5sZW5ndGggPiAxID8gdGhpcy5idWZmZXJpc2guY29uY2F0KGJ1ZmZlcnMpIDogYnVmZmVyc1swXTtcbiAgICBidWZmZXJzLmxlbmd0aCA9IDA7IC8vIGJ1ZmZlciBleGhhdXN0ZWRcbiAgICByZXR1cm4gY2h1bms7XG4gIH1cblxuICBmdW5jdGlvbiByZXNlcnZlKGxlbmd0aCkge1xuICAgIHZhciByZXEgPSBsZW5ndGggfCAwO1xuXG4gICAgaWYgKHRoaXMuYnVmZmVyKSB7XG4gICAgICB2YXIgc2l6ZSA9IHRoaXMuYnVmZmVyLmxlbmd0aDtcbiAgICAgIHZhciBzdGFydCA9IHRoaXMub2Zmc2V0IHwgMDtcbiAgICAgIHZhciBlbmQgPSBzdGFydCArIHJlcTtcblxuICAgICAgLy8gaXMgaXQgbG9uZyBlbm91Z2g/XG4gICAgICBpZiAoZW5kIDwgc2l6ZSkge1xuICAgICAgICB0aGlzLm9mZnNldCA9IGVuZDtcbiAgICAgICAgcmV0dXJuIHN0YXJ0O1xuICAgICAgfVxuXG4gICAgICAvLyBmbHVzaCBjdXJyZW50IGJ1ZmZlclxuICAgICAgdGhpcy5mbHVzaCgpO1xuXG4gICAgICAvLyByZXNpemUgaXQgdG8gMnggY3VycmVudCBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IE1hdGgubWF4KGxlbmd0aCwgTWF0aC5taW4oc2l6ZSAqIDIsIHRoaXMubWF4QnVmZmVyU2l6ZSkpO1xuICAgIH1cblxuICAgIC8vIG1pbmltdW0gYnVmZmVyIHNpemVcbiAgICBsZW5ndGggPSBNYXRoLm1heChsZW5ndGgsIHRoaXMubWluQnVmZmVyU2l6ZSk7XG5cbiAgICAvLyBhbGxvY2F0ZSBuZXcgYnVmZmVyXG4gICAgdGhpcy5idWZmZXIgPSB0aGlzLmJ1ZmZlcmlzaC5hbGxvYyhsZW5ndGgpO1xuICAgIHRoaXMuc3RhcnQgPSAwO1xuICAgIHRoaXMub2Zmc2V0ID0gcmVxO1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gc2VuZChidWZmZXIpIHtcbiAgICB2YXIgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoID4gdGhpcy5taW5CdWZmZXJTaXplKSB7XG4gICAgICB0aGlzLmZsdXNoKCk7XG4gICAgICB0aGlzLnB1c2goYnVmZmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG9mZnNldCA9IHRoaXMucmVzZXJ2ZShsZW5ndGgpO1xuICAgICAgQnVmZmVyaXNoLnByb3RvdHlwZS5jb3B5LmNhbGwoYnVmZmVyLCB0aGlzLmJ1ZmZlciwgb2Zmc2V0KTtcbiAgICB9XG4gIH1cbn1cblxuLy8gY29tbW9uIG1ldGhvZHNcblxuZnVuY3Rpb24gd3JpdGUoKSB7XG4gIHRocm93IG5ldyBFcnJvcihcIm1ldGhvZCBub3QgaW1wbGVtZW50ZWQ6IHdyaXRlKClcIik7XG59XG5cbmZ1bmN0aW9uIGZldGNoKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoXCJtZXRob2Qgbm90IGltcGxlbWVudGVkOiBmZXRjaCgpXCIpO1xufVxuXG5mdW5jdGlvbiByZWFkKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5idWZmZXJzICYmIHRoaXMuYnVmZmVycy5sZW5ndGg7XG5cbiAgLy8gZmV0Y2ggdGhlIGZpcnN0IHJlc3VsdFxuICBpZiAoIWxlbmd0aCkgcmV0dXJuIHRoaXMuZmV0Y2goKTtcblxuICAvLyBmbHVzaCBjdXJyZW50IGJ1ZmZlclxuICB0aGlzLmZsdXNoKCk7XG5cbiAgLy8gcmVhZCBmcm9tIHRoZSByZXN1bHRzXG4gIHJldHVybiB0aGlzLnB1bGwoKTtcbn1cblxuZnVuY3Rpb24gcHVzaChjaHVuaykge1xuICB2YXIgYnVmZmVycyA9IHRoaXMuYnVmZmVycyB8fCAodGhpcy5idWZmZXJzID0gW10pO1xuICBidWZmZXJzLnB1c2goY2h1bmspO1xufVxuXG5mdW5jdGlvbiBwdWxsKCkge1xuICB2YXIgYnVmZmVycyA9IHRoaXMuYnVmZmVycyB8fCAodGhpcy5idWZmZXJzID0gW10pO1xuICByZXR1cm4gYnVmZmVycy5zaGlmdCgpO1xufVxuXG5mdW5jdGlvbiBtaXhpbkZhY3Rvcnkoc291cmNlKSB7XG4gIHJldHVybiBtaXhpbjtcblxuICBmdW5jdGlvbiBtaXhpbih0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG59XG4iLCIvLyByZWFkLWNvcmUuanNcblxudmFyIEV4dEJ1ZmZlciA9IHJlcXVpcmUoXCIuL2V4dC1idWZmZXJcIikuRXh0QnVmZmVyO1xudmFyIEV4dFVucGFja2VyID0gcmVxdWlyZShcIi4vZXh0LXVucGFja2VyXCIpO1xudmFyIHJlYWRVaW50OCA9IHJlcXVpcmUoXCIuL3JlYWQtZm9ybWF0XCIpLnJlYWRVaW50ODtcbnZhciBSZWFkVG9rZW4gPSByZXF1aXJlKFwiLi9yZWFkLXRva2VuXCIpO1xudmFyIENvZGVjQmFzZSA9IHJlcXVpcmUoXCIuL2NvZGVjLWJhc2VcIik7XG5cbkNvZGVjQmFzZS5pbnN0YWxsKHtcbiAgYWRkRXh0VW5wYWNrZXI6IGFkZEV4dFVucGFja2VyLFxuICBnZXRFeHRVbnBhY2tlcjogZ2V0RXh0VW5wYWNrZXIsXG4gIGluaXQ6IGluaXRcbn0pO1xuXG5leHBvcnRzLnByZXNldCA9IGluaXQuY2FsbChDb2RlY0Jhc2UucHJlc2V0KTtcblxuZnVuY3Rpb24gZ2V0RGVjb2RlcihvcHRpb25zKSB7XG4gIHZhciByZWFkVG9rZW4gPSBSZWFkVG9rZW4uZ2V0UmVhZFRva2VuKG9wdGlvbnMpO1xuICByZXR1cm4gZGVjb2RlO1xuXG4gIGZ1bmN0aW9uIGRlY29kZShkZWNvZGVyKSB7XG4gICAgdmFyIHR5cGUgPSByZWFkVWludDgoZGVjb2Rlcik7XG4gICAgdmFyIGZ1bmMgPSByZWFkVG9rZW5bdHlwZV07XG4gICAgaWYgKCFmdW5jKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHR5cGU6IFwiICsgKHR5cGUgPyAoXCIweFwiICsgdHlwZS50b1N0cmluZygxNikpIDogdHlwZSkpO1xuICAgIHJldHVybiBmdW5jKGRlY29kZXIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICB0aGlzLmRlY29kZSA9IGdldERlY29kZXIob3B0aW9ucyk7XG5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5wcmVzZXQpIHtcbiAgICBFeHRVbnBhY2tlci5zZXRFeHRVbnBhY2tlcnModGhpcyk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24gYWRkRXh0VW5wYWNrZXIoZXR5cGUsIHVucGFja2VyKSB7XG4gIHZhciB1bnBhY2tlcnMgPSB0aGlzLmV4dFVucGFja2VycyB8fCAodGhpcy5leHRVbnBhY2tlcnMgPSBbXSk7XG4gIHVucGFja2Vyc1tldHlwZV0gPSBDb2RlY0Jhc2UuZmlsdGVyKHVucGFja2VyKTtcbn1cblxuZnVuY3Rpb24gZ2V0RXh0VW5wYWNrZXIodHlwZSkge1xuICB2YXIgdW5wYWNrZXJzID0gdGhpcy5leHRVbnBhY2tlcnMgfHwgKHRoaXMuZXh0VW5wYWNrZXJzID0gW10pO1xuICByZXR1cm4gdW5wYWNrZXJzW3R5cGVdIHx8IGV4dFVucGFja2VyO1xuXG4gIGZ1bmN0aW9uIGV4dFVucGFja2VyKGJ1ZmZlcikge1xuICAgIHJldHVybiBuZXcgRXh0QnVmZmVyKGJ1ZmZlciwgdHlwZSk7XG4gIH1cbn1cbiIsIi8vIHJlYWQtZm9ybWF0LmpzXG5cbnZhciBpZWVlNzU0ID0gcmVxdWlyZShcImllZWU3NTRcIik7XG52YXIgSW50NjRCdWZmZXIgPSByZXF1aXJlKFwiaW50NjQtYnVmZmVyXCIpO1xudmFyIFVpbnQ2NEJFID0gSW50NjRCdWZmZXIuVWludDY0QkU7XG52YXIgSW50NjRCRSA9IEludDY0QnVmZmVyLkludDY0QkU7XG5cbmV4cG9ydHMuZ2V0UmVhZEZvcm1hdCA9IGdldFJlYWRGb3JtYXQ7XG5leHBvcnRzLnJlYWRVaW50OCA9IHVpbnQ4O1xuXG52YXIgQnVmZmVyaXNoID0gcmVxdWlyZShcIi4vYnVmZmVyaXNoXCIpO1xudmFyIEJ1ZmZlclByb3RvID0gcmVxdWlyZShcIi4vYnVmZmVyaXNoLXByb3RvXCIpO1xuXG52YXIgSEFTX01BUCA9IChcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgTWFwKTtcbnZhciBOT19BU1NFUlQgPSB0cnVlO1xuXG5mdW5jdGlvbiBnZXRSZWFkRm9ybWF0KG9wdGlvbnMpIHtcbiAgdmFyIGJpbmFycmF5YnVmZmVyID0gQnVmZmVyaXNoLmhhc0FycmF5QnVmZmVyICYmIG9wdGlvbnMgJiYgb3B0aW9ucy5iaW5hcnJheWJ1ZmZlcjtcbiAgdmFyIGludDY0ID0gb3B0aW9ucyAmJiBvcHRpb25zLmludDY0O1xuICB2YXIgdXNlbWFwID0gSEFTX01BUCAmJiBvcHRpb25zICYmIG9wdGlvbnMudXNlbWFwO1xuXG4gIHZhciByZWFkRm9ybWF0ID0ge1xuICAgIG1hcDogKHVzZW1hcCA/IG1hcF90b19tYXAgOiBtYXBfdG9fb2JqKSxcbiAgICBhcnJheTogYXJyYXksXG4gICAgc3RyOiBzdHIsXG4gICAgYmluOiAoYmluYXJyYXlidWZmZXIgPyBiaW5fYXJyYXlidWZmZXIgOiBiaW5fYnVmZmVyKSxcbiAgICBleHQ6IGV4dCxcbiAgICB1aW50ODogdWludDgsXG4gICAgdWludDE2OiB1aW50MTYsXG4gICAgdWludDMyOiB1aW50MzIsXG4gICAgdWludDY0OiByZWFkKDgsIGludDY0ID8gcmVhZFVJbnQ2NEJFX2ludDY0IDogcmVhZFVJbnQ2NEJFKSxcbiAgICBpbnQ4OiBpbnQ4LFxuICAgIGludDE2OiBpbnQxNixcbiAgICBpbnQzMjogaW50MzIsXG4gICAgaW50NjQ6IHJlYWQoOCwgaW50NjQgPyByZWFkSW50NjRCRV9pbnQ2NCA6IHJlYWRJbnQ2NEJFKSxcbiAgICBmbG9hdDMyOiByZWFkKDQsIHJlYWRGbG9hdEJFKSxcbiAgICBmbG9hdDY0OiByZWFkKDgsIHJlYWREb3VibGVCRSlcbiAgfTtcblxuICByZXR1cm4gcmVhZEZvcm1hdDtcbn1cblxuZnVuY3Rpb24gbWFwX3RvX29iaihkZWNvZGVyLCBsZW4pIHtcbiAgdmFyIHZhbHVlID0ge307XG4gIHZhciBpO1xuICB2YXIgayA9IG5ldyBBcnJheShsZW4pO1xuICB2YXIgdiA9IG5ldyBBcnJheShsZW4pO1xuXG4gIHZhciBkZWNvZGUgPSBkZWNvZGVyLmNvZGVjLmRlY29kZTtcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAga1tpXSA9IGRlY29kZShkZWNvZGVyKTtcbiAgICB2W2ldID0gZGVjb2RlKGRlY29kZXIpO1xuICB9XG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIHZhbHVlW2tbaV1dID0gdltpXTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIG1hcF90b19tYXAoZGVjb2RlciwgbGVuKSB7XG4gIHZhciB2YWx1ZSA9IG5ldyBNYXAoKTtcbiAgdmFyIGk7XG4gIHZhciBrID0gbmV3IEFycmF5KGxlbik7XG4gIHZhciB2ID0gbmV3IEFycmF5KGxlbik7XG5cbiAgdmFyIGRlY29kZSA9IGRlY29kZXIuY29kZWMuZGVjb2RlO1xuICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBrW2ldID0gZGVjb2RlKGRlY29kZXIpO1xuICAgIHZbaV0gPSBkZWNvZGUoZGVjb2Rlcik7XG4gIH1cbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFsdWUuc2V0KGtbaV0sIHZbaV0pO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gYXJyYXkoZGVjb2RlciwgbGVuKSB7XG4gIHZhciB2YWx1ZSA9IG5ldyBBcnJheShsZW4pO1xuICB2YXIgZGVjb2RlID0gZGVjb2Rlci5jb2RlYy5kZWNvZGU7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YWx1ZVtpXSA9IGRlY29kZShkZWNvZGVyKTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHN0cihkZWNvZGVyLCBsZW4pIHtcbiAgdmFyIHN0YXJ0ID0gZGVjb2Rlci5yZXNlcnZlKGxlbik7XG4gIHZhciBlbmQgPSBzdGFydCArIGxlbjtcbiAgcmV0dXJuIEJ1ZmZlclByb3RvLnRvU3RyaW5nLmNhbGwoZGVjb2Rlci5idWZmZXIsIFwidXRmLThcIiwgc3RhcnQsIGVuZCk7XG59XG5cbmZ1bmN0aW9uIGJpbl9idWZmZXIoZGVjb2RlciwgbGVuKSB7XG4gIHZhciBzdGFydCA9IGRlY29kZXIucmVzZXJ2ZShsZW4pO1xuICB2YXIgZW5kID0gc3RhcnQgKyBsZW47XG4gIHZhciBidWYgPSBCdWZmZXJQcm90by5zbGljZS5jYWxsKGRlY29kZXIuYnVmZmVyLCBzdGFydCwgZW5kKTtcbiAgcmV0dXJuIEJ1ZmZlcmlzaC5mcm9tKGJ1Zik7XG59XG5cbmZ1bmN0aW9uIGJpbl9hcnJheWJ1ZmZlcihkZWNvZGVyLCBsZW4pIHtcbiAgdmFyIHN0YXJ0ID0gZGVjb2Rlci5yZXNlcnZlKGxlbik7XG4gIHZhciBlbmQgPSBzdGFydCArIGxlbjtcbiAgdmFyIGJ1ZiA9IEJ1ZmZlclByb3RvLnNsaWNlLmNhbGwoZGVjb2Rlci5idWZmZXIsIHN0YXJ0LCBlbmQpO1xuICByZXR1cm4gQnVmZmVyaXNoLlVpbnQ4QXJyYXkuZnJvbShidWYpLmJ1ZmZlcjtcbn1cblxuZnVuY3Rpb24gZXh0KGRlY29kZXIsIGxlbikge1xuICB2YXIgc3RhcnQgPSBkZWNvZGVyLnJlc2VydmUobGVuKzEpO1xuICB2YXIgdHlwZSA9IGRlY29kZXIuYnVmZmVyW3N0YXJ0KytdO1xuICB2YXIgZW5kID0gc3RhcnQgKyBsZW47XG4gIHZhciB1bnBhY2sgPSBkZWNvZGVyLmNvZGVjLmdldEV4dFVucGFja2VyKHR5cGUpO1xuICBpZiAoIXVucGFjaykgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBleHQgdHlwZTogXCIgKyAodHlwZSA/IChcIjB4XCIgKyB0eXBlLnRvU3RyaW5nKDE2KSkgOiB0eXBlKSk7XG4gIHZhciBidWYgPSBCdWZmZXJQcm90by5zbGljZS5jYWxsKGRlY29kZXIuYnVmZmVyLCBzdGFydCwgZW5kKTtcbiAgcmV0dXJuIHVucGFjayhidWYpO1xufVxuXG5mdW5jdGlvbiB1aW50OChkZWNvZGVyKSB7XG4gIHZhciBzdGFydCA9IGRlY29kZXIucmVzZXJ2ZSgxKTtcbiAgcmV0dXJuIGRlY29kZXIuYnVmZmVyW3N0YXJ0XTtcbn1cblxuZnVuY3Rpb24gaW50OChkZWNvZGVyKSB7XG4gIHZhciBzdGFydCA9IGRlY29kZXIucmVzZXJ2ZSgxKTtcbiAgdmFyIHZhbHVlID0gZGVjb2Rlci5idWZmZXJbc3RhcnRdO1xuICByZXR1cm4gKHZhbHVlICYgMHg4MCkgPyB2YWx1ZSAtIDB4MTAwIDogdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHVpbnQxNihkZWNvZGVyKSB7XG4gIHZhciBzdGFydCA9IGRlY29kZXIucmVzZXJ2ZSgyKTtcbiAgdmFyIGJ1ZmZlciA9IGRlY29kZXIuYnVmZmVyO1xuICByZXR1cm4gKGJ1ZmZlcltzdGFydCsrXSA8PCA4KSB8IGJ1ZmZlcltzdGFydF07XG59XG5cbmZ1bmN0aW9uIGludDE2KGRlY29kZXIpIHtcbiAgdmFyIHN0YXJ0ID0gZGVjb2Rlci5yZXNlcnZlKDIpO1xuICB2YXIgYnVmZmVyID0gZGVjb2Rlci5idWZmZXI7XG4gIHZhciB2YWx1ZSA9IChidWZmZXJbc3RhcnQrK10gPDwgOCkgfCBidWZmZXJbc3RhcnRdO1xuICByZXR1cm4gKHZhbHVlICYgMHg4MDAwKSA/IHZhbHVlIC0gMHgxMDAwMCA6IHZhbHVlO1xufVxuXG5mdW5jdGlvbiB1aW50MzIoZGVjb2Rlcikge1xuICB2YXIgc3RhcnQgPSBkZWNvZGVyLnJlc2VydmUoNCk7XG4gIHZhciBidWZmZXIgPSBkZWNvZGVyLmJ1ZmZlcjtcbiAgcmV0dXJuIChidWZmZXJbc3RhcnQrK10gKiAxNjc3NzIxNikgKyAoYnVmZmVyW3N0YXJ0KytdIDw8IDE2KSArIChidWZmZXJbc3RhcnQrK10gPDwgOCkgKyBidWZmZXJbc3RhcnRdO1xufVxuXG5mdW5jdGlvbiBpbnQzMihkZWNvZGVyKSB7XG4gIHZhciBzdGFydCA9IGRlY29kZXIucmVzZXJ2ZSg0KTtcbiAgdmFyIGJ1ZmZlciA9IGRlY29kZXIuYnVmZmVyO1xuICByZXR1cm4gKGJ1ZmZlcltzdGFydCsrXSA8PCAyNCkgfCAoYnVmZmVyW3N0YXJ0KytdIDw8IDE2KSB8IChidWZmZXJbc3RhcnQrK10gPDwgOCkgfCBidWZmZXJbc3RhcnRdO1xufVxuXG5mdW5jdGlvbiByZWFkKGxlbiwgbWV0aG9kKSB7XG4gIHJldHVybiBmdW5jdGlvbihkZWNvZGVyKSB7XG4gICAgdmFyIHN0YXJ0ID0gZGVjb2Rlci5yZXNlcnZlKGxlbik7XG4gICAgcmV0dXJuIG1ldGhvZC5jYWxsKGRlY29kZXIuYnVmZmVyLCBzdGFydCwgTk9fQVNTRVJUKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVhZFVJbnQ2NEJFKHN0YXJ0KSB7XG4gIHJldHVybiBuZXcgVWludDY0QkUodGhpcywgc3RhcnQpLnRvTnVtYmVyKCk7XG59XG5cbmZ1bmN0aW9uIHJlYWRJbnQ2NEJFKHN0YXJ0KSB7XG4gIHJldHVybiBuZXcgSW50NjRCRSh0aGlzLCBzdGFydCkudG9OdW1iZXIoKTtcbn1cblxuZnVuY3Rpb24gcmVhZFVJbnQ2NEJFX2ludDY0KHN0YXJ0KSB7XG4gIHJldHVybiBuZXcgVWludDY0QkUodGhpcywgc3RhcnQpO1xufVxuXG5mdW5jdGlvbiByZWFkSW50NjRCRV9pbnQ2NChzdGFydCkge1xuICByZXR1cm4gbmV3IEludDY0QkUodGhpcywgc3RhcnQpO1xufVxuXG5mdW5jdGlvbiByZWFkRmxvYXRCRShzdGFydCkge1xuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIHN0YXJ0LCBmYWxzZSwgMjMsIDQpO1xufVxuXG5mdW5jdGlvbiByZWFkRG91YmxlQkUoc3RhcnQpIHtcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBzdGFydCwgZmFsc2UsIDUyLCA4KTtcbn0iLCIvLyByZWFkLXRva2VuLmpzXG5cbnZhciBSZWFkRm9ybWF0ID0gcmVxdWlyZShcIi4vcmVhZC1mb3JtYXRcIik7XG5cbmV4cG9ydHMuZ2V0UmVhZFRva2VuID0gZ2V0UmVhZFRva2VuO1xuXG5mdW5jdGlvbiBnZXRSZWFkVG9rZW4ob3B0aW9ucykge1xuICB2YXIgZm9ybWF0ID0gUmVhZEZvcm1hdC5nZXRSZWFkRm9ybWF0KG9wdGlvbnMpO1xuXG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMudXNlcmF3KSB7XG4gICAgcmV0dXJuIGluaXRfdXNlcmF3KGZvcm1hdCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGluaXRfdG9rZW4oZm9ybWF0KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0X3Rva2VuKGZvcm1hdCkge1xuICB2YXIgaTtcbiAgdmFyIHRva2VuID0gbmV3IEFycmF5KDI1Nik7XG5cbiAgLy8gcG9zaXRpdmUgZml4aW50IC0tIDB4MDAgLSAweDdmXG4gIGZvciAoaSA9IDB4MDA7IGkgPD0gMHg3ZjsgaSsrKSB7XG4gICAgdG9rZW5baV0gPSBjb25zdGFudChpKTtcbiAgfVxuXG4gIC8vIGZpeG1hcCAtLSAweDgwIC0gMHg4ZlxuICBmb3IgKGkgPSAweDgwOyBpIDw9IDB4OGY7IGkrKykge1xuICAgIHRva2VuW2ldID0gZml4KGkgLSAweDgwLCBmb3JtYXQubWFwKTtcbiAgfVxuXG4gIC8vIGZpeGFycmF5IC0tIDB4OTAgLSAweDlmXG4gIGZvciAoaSA9IDB4OTA7IGkgPD0gMHg5ZjsgaSsrKSB7XG4gICAgdG9rZW5baV0gPSBmaXgoaSAtIDB4OTAsIGZvcm1hdC5hcnJheSk7XG4gIH1cblxuICAvLyBmaXhzdHIgLS0gMHhhMCAtIDB4YmZcbiAgZm9yIChpID0gMHhhMDsgaSA8PSAweGJmOyBpKyspIHtcbiAgICB0b2tlbltpXSA9IGZpeChpIC0gMHhhMCwgZm9ybWF0LnN0cik7XG4gIH1cblxuICAvLyBuaWwgLS0gMHhjMFxuICB0b2tlblsweGMwXSA9IGNvbnN0YW50KG51bGwpO1xuXG4gIC8vIChuZXZlciB1c2VkKSAtLSAweGMxXG4gIHRva2VuWzB4YzFdID0gbnVsbDtcblxuICAvLyBmYWxzZSAtLSAweGMyXG4gIC8vIHRydWUgLS0gMHhjM1xuICB0b2tlblsweGMyXSA9IGNvbnN0YW50KGZhbHNlKTtcbiAgdG9rZW5bMHhjM10gPSBjb25zdGFudCh0cnVlKTtcblxuICAvLyBiaW4gOCAtLSAweGM0XG4gIC8vIGJpbiAxNiAtLSAweGM1XG4gIC8vIGJpbiAzMiAtLSAweGM2XG4gIHRva2VuWzB4YzRdID0gZmxleChmb3JtYXQudWludDgsIGZvcm1hdC5iaW4pO1xuICB0b2tlblsweGM1XSA9IGZsZXgoZm9ybWF0LnVpbnQxNiwgZm9ybWF0LmJpbik7XG4gIHRva2VuWzB4YzZdID0gZmxleChmb3JtYXQudWludDMyLCBmb3JtYXQuYmluKTtcblxuICAvLyBleHQgOCAtLSAweGM3XG4gIC8vIGV4dCAxNiAtLSAweGM4XG4gIC8vIGV4dCAzMiAtLSAweGM5XG4gIHRva2VuWzB4YzddID0gZmxleChmb3JtYXQudWludDgsIGZvcm1hdC5leHQpO1xuICB0b2tlblsweGM4XSA9IGZsZXgoZm9ybWF0LnVpbnQxNiwgZm9ybWF0LmV4dCk7XG4gIHRva2VuWzB4YzldID0gZmxleChmb3JtYXQudWludDMyLCBmb3JtYXQuZXh0KTtcblxuICAvLyBmbG9hdCAzMiAtLSAweGNhXG4gIC8vIGZsb2F0IDY0IC0tIDB4Y2JcbiAgdG9rZW5bMHhjYV0gPSBmb3JtYXQuZmxvYXQzMjtcbiAgdG9rZW5bMHhjYl0gPSBmb3JtYXQuZmxvYXQ2NDtcblxuICAvLyB1aW50IDggLS0gMHhjY1xuICAvLyB1aW50IDE2IC0tIDB4Y2RcbiAgLy8gdWludCAzMiAtLSAweGNlXG4gIC8vIHVpbnQgNjQgLS0gMHhjZlxuICB0b2tlblsweGNjXSA9IGZvcm1hdC51aW50ODtcbiAgdG9rZW5bMHhjZF0gPSBmb3JtYXQudWludDE2O1xuICB0b2tlblsweGNlXSA9IGZvcm1hdC51aW50MzI7XG4gIHRva2VuWzB4Y2ZdID0gZm9ybWF0LnVpbnQ2NDtcblxuICAvLyBpbnQgOCAtLSAweGQwXG4gIC8vIGludCAxNiAtLSAweGQxXG4gIC8vIGludCAzMiAtLSAweGQyXG4gIC8vIGludCA2NCAtLSAweGQzXG4gIHRva2VuWzB4ZDBdID0gZm9ybWF0LmludDg7XG4gIHRva2VuWzB4ZDFdID0gZm9ybWF0LmludDE2O1xuICB0b2tlblsweGQyXSA9IGZvcm1hdC5pbnQzMjtcbiAgdG9rZW5bMHhkM10gPSBmb3JtYXQuaW50NjQ7XG5cbiAgLy8gZml4ZXh0IDEgLS0gMHhkNFxuICAvLyBmaXhleHQgMiAtLSAweGQ1XG4gIC8vIGZpeGV4dCA0IC0tIDB4ZDZcbiAgLy8gZml4ZXh0IDggLS0gMHhkN1xuICAvLyBmaXhleHQgMTYgLS0gMHhkOFxuICB0b2tlblsweGQ0XSA9IGZpeCgxLCBmb3JtYXQuZXh0KTtcbiAgdG9rZW5bMHhkNV0gPSBmaXgoMiwgZm9ybWF0LmV4dCk7XG4gIHRva2VuWzB4ZDZdID0gZml4KDQsIGZvcm1hdC5leHQpO1xuICB0b2tlblsweGQ3XSA9IGZpeCg4LCBmb3JtYXQuZXh0KTtcbiAgdG9rZW5bMHhkOF0gPSBmaXgoMTYsIGZvcm1hdC5leHQpO1xuXG4gIC8vIHN0ciA4IC0tIDB4ZDlcbiAgLy8gc3RyIDE2IC0tIDB4ZGFcbiAgLy8gc3RyIDMyIC0tIDB4ZGJcbiAgdG9rZW5bMHhkOV0gPSBmbGV4KGZvcm1hdC51aW50OCwgZm9ybWF0LnN0cik7XG4gIHRva2VuWzB4ZGFdID0gZmxleChmb3JtYXQudWludDE2LCBmb3JtYXQuc3RyKTtcbiAgdG9rZW5bMHhkYl0gPSBmbGV4KGZvcm1hdC51aW50MzIsIGZvcm1hdC5zdHIpO1xuXG4gIC8vIGFycmF5IDE2IC0tIDB4ZGNcbiAgLy8gYXJyYXkgMzIgLS0gMHhkZFxuICB0b2tlblsweGRjXSA9IGZsZXgoZm9ybWF0LnVpbnQxNiwgZm9ybWF0LmFycmF5KTtcbiAgdG9rZW5bMHhkZF0gPSBmbGV4KGZvcm1hdC51aW50MzIsIGZvcm1hdC5hcnJheSk7XG5cbiAgLy8gbWFwIDE2IC0tIDB4ZGVcbiAgLy8gbWFwIDMyIC0tIDB4ZGZcbiAgdG9rZW5bMHhkZV0gPSBmbGV4KGZvcm1hdC51aW50MTYsIGZvcm1hdC5tYXApO1xuICB0b2tlblsweGRmXSA9IGZsZXgoZm9ybWF0LnVpbnQzMiwgZm9ybWF0Lm1hcCk7XG5cbiAgLy8gbmVnYXRpdmUgZml4aW50IC0tIDB4ZTAgLSAweGZmXG4gIGZvciAoaSA9IDB4ZTA7IGkgPD0gMHhmZjsgaSsrKSB7XG4gICAgdG9rZW5baV0gPSBjb25zdGFudChpIC0gMHgxMDApO1xuICB9XG5cbiAgcmV0dXJuIHRva2VuO1xufVxuXG5mdW5jdGlvbiBpbml0X3VzZXJhdyhmb3JtYXQpIHtcbiAgdmFyIGk7XG4gIHZhciB0b2tlbiA9IGluaXRfdG9rZW4oZm9ybWF0KS5zbGljZSgpO1xuXG4gIC8vIHJhdyA4IC0tIDB4ZDlcbiAgLy8gcmF3IDE2IC0tIDB4ZGFcbiAgLy8gcmF3IDMyIC0tIDB4ZGJcbiAgdG9rZW5bMHhkOV0gPSB0b2tlblsweGM0XTtcbiAgdG9rZW5bMHhkYV0gPSB0b2tlblsweGM1XTtcbiAgdG9rZW5bMHhkYl0gPSB0b2tlblsweGM2XTtcblxuICAvLyBmaXhyYXcgLS0gMHhhMCAtIDB4YmZcbiAgZm9yIChpID0gMHhhMDsgaSA8PSAweGJmOyBpKyspIHtcbiAgICB0b2tlbltpXSA9IGZpeChpIC0gMHhhMCwgZm9ybWF0LmJpbik7XG4gIH1cblxuICByZXR1cm4gdG9rZW47XG59XG5cbmZ1bmN0aW9uIGNvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGZsZXgobGVuRnVuYywgZGVjb2RlRnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24oZGVjb2Rlcikge1xuICAgIHZhciBsZW4gPSBsZW5GdW5jKGRlY29kZXIpO1xuICAgIHJldHVybiBkZWNvZGVGdW5jKGRlY29kZXIsIGxlbik7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGZpeChsZW4sIG1ldGhvZCkge1xuICByZXR1cm4gZnVuY3Rpb24oZGVjb2Rlcikge1xuICAgIHJldHVybiBtZXRob2QoZGVjb2RlciwgbGVuKTtcbiAgfTtcbn1cbiIsIi8vIHdyaXRlLWNvcmUuanNcblxudmFyIEV4dEJ1ZmZlciA9IHJlcXVpcmUoXCIuL2V4dC1idWZmZXJcIikuRXh0QnVmZmVyO1xudmFyIEV4dFBhY2tlciA9IHJlcXVpcmUoXCIuL2V4dC1wYWNrZXJcIik7XG52YXIgV3JpdGVUeXBlID0gcmVxdWlyZShcIi4vd3JpdGUtdHlwZVwiKTtcbnZhciBDb2RlY0Jhc2UgPSByZXF1aXJlKFwiLi9jb2RlYy1iYXNlXCIpO1xuXG5Db2RlY0Jhc2UuaW5zdGFsbCh7XG4gIGFkZEV4dFBhY2tlcjogYWRkRXh0UGFja2VyLFxuICBnZXRFeHRQYWNrZXI6IGdldEV4dFBhY2tlcixcbiAgaW5pdDogaW5pdFxufSk7XG5cbmV4cG9ydHMucHJlc2V0ID0gaW5pdC5jYWxsKENvZGVjQmFzZS5wcmVzZXQpO1xuXG5mdW5jdGlvbiBnZXRFbmNvZGVyKG9wdGlvbnMpIHtcbiAgdmFyIHdyaXRlVHlwZSA9IFdyaXRlVHlwZS5nZXRXcml0ZVR5cGUob3B0aW9ucyk7XG4gIHJldHVybiBlbmNvZGU7XG5cbiAgZnVuY3Rpb24gZW5jb2RlKGVuY29kZXIsIHZhbHVlKSB7XG4gICAgdmFyIGZ1bmMgPSB3cml0ZVR5cGVbdHlwZW9mIHZhbHVlXTtcbiAgICBpZiAoIWZ1bmMpIHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIHR5cGUgXFxcIlwiICsgKHR5cGVvZiB2YWx1ZSkgKyBcIlxcXCI6IFwiICsgdmFsdWUpO1xuICAgIGZ1bmMoZW5jb2RlciwgdmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICB0aGlzLmVuY29kZSA9IGdldEVuY29kZXIob3B0aW9ucyk7XG5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5wcmVzZXQpIHtcbiAgICBFeHRQYWNrZXIuc2V0RXh0UGFja2Vycyh0aGlzKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufVxuXG5mdW5jdGlvbiBhZGRFeHRQYWNrZXIoZXR5cGUsIENsYXNzLCBwYWNrZXIpIHtcbiAgcGFja2VyID0gQ29kZWNCYXNlLmZpbHRlcihwYWNrZXIpO1xuICB2YXIgbmFtZSA9IENsYXNzLm5hbWU7XG4gIGlmIChuYW1lICYmIG5hbWUgIT09IFwiT2JqZWN0XCIpIHtcbiAgICB2YXIgcGFja2VycyA9IHRoaXMuZXh0UGFja2VycyB8fCAodGhpcy5leHRQYWNrZXJzID0ge30pO1xuICAgIHBhY2tlcnNbbmFtZV0gPSBleHRQYWNrZXI7XG4gIH0gZWxzZSB7XG4gICAgLy8gZmFsbGJhY2sgZm9yIElFXG4gICAgdmFyIGxpc3QgPSB0aGlzLmV4dEVuY29kZXJMaXN0IHx8ICh0aGlzLmV4dEVuY29kZXJMaXN0ID0gW10pO1xuICAgIGxpc3QudW5zaGlmdChbQ2xhc3MsIGV4dFBhY2tlcl0pO1xuICB9XG5cbiAgZnVuY3Rpb24gZXh0UGFja2VyKHZhbHVlKSB7XG4gICAgaWYgKHBhY2tlcikgdmFsdWUgPSBwYWNrZXIodmFsdWUpO1xuICAgIHJldHVybiBuZXcgRXh0QnVmZmVyKHZhbHVlLCBldHlwZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RXh0UGFja2VyKHZhbHVlKSB7XG4gIHZhciBwYWNrZXJzID0gdGhpcy5leHRQYWNrZXJzIHx8ICh0aGlzLmV4dFBhY2tlcnMgPSB7fSk7XG4gIHZhciBjID0gdmFsdWUuY29uc3RydWN0b3I7XG4gIHZhciBlID0gYyAmJiBjLm5hbWUgJiYgcGFja2Vyc1tjLm5hbWVdO1xuICBpZiAoZSkgcmV0dXJuIGU7XG5cbiAgLy8gZmFsbGJhY2sgZm9yIElFXG4gIHZhciBsaXN0ID0gdGhpcy5leHRFbmNvZGVyTGlzdCB8fCAodGhpcy5leHRFbmNvZGVyTGlzdCA9IFtdKTtcbiAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIHBhaXIgPSBsaXN0W2ldO1xuICAgIGlmIChjID09PSBwYWlyWzBdKSByZXR1cm4gcGFpclsxXTtcbiAgfVxufVxuIiwiLy8gd3JpdGUtdG9rZW4uanNcblxudmFyIGllZWU3NTQgPSByZXF1aXJlKFwiaWVlZTc1NFwiKTtcbnZhciBJbnQ2NEJ1ZmZlciA9IHJlcXVpcmUoXCJpbnQ2NC1idWZmZXJcIik7XG52YXIgVWludDY0QkUgPSBJbnQ2NEJ1ZmZlci5VaW50NjRCRTtcbnZhciBJbnQ2NEJFID0gSW50NjRCdWZmZXIuSW50NjRCRTtcblxudmFyIHVpbnQ4ID0gcmVxdWlyZShcIi4vd3JpdGUtdWludDhcIikudWludDg7XG52YXIgQnVmZmVyaXNoID0gcmVxdWlyZShcIi4vYnVmZmVyaXNoXCIpO1xudmFyIEJ1ZmZlciA9IEJ1ZmZlcmlzaC5nbG9iYWw7XG52YXIgSVNfQlVGRkVSX1NISU0gPSBCdWZmZXJpc2guaGFzQnVmZmVyICYmIChcIlRZUEVEX0FSUkFZX1NVUFBPUlRcIiBpbiBCdWZmZXIpO1xudmFyIE5PX1RZUEVEX0FSUkFZID0gSVNfQlVGRkVSX1NISU0gJiYgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUO1xudmFyIEJ1ZmZlcl9wcm90b3R5cGUgPSBCdWZmZXJpc2guaGFzQnVmZmVyICYmIEJ1ZmZlci5wcm90b3R5cGUgfHwge307XG5cbmV4cG9ydHMuZ2V0V3JpdGVUb2tlbiA9IGdldFdyaXRlVG9rZW47XG5cbmZ1bmN0aW9uIGdldFdyaXRlVG9rZW4ob3B0aW9ucykge1xuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnVpbnQ4YXJyYXkpIHtcbiAgICByZXR1cm4gaW5pdF91aW50OGFycmF5KCk7XG4gIH0gZWxzZSBpZiAoTk9fVFlQRURfQVJSQVkgfHwgKEJ1ZmZlcmlzaC5oYXNCdWZmZXIgJiYgb3B0aW9ucyAmJiBvcHRpb25zLnNhZmUpKSB7XG4gICAgcmV0dXJuIGluaXRfc2FmZSgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBpbml0X3Rva2VuKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdF91aW50OGFycmF5KCkge1xuICB2YXIgdG9rZW4gPSBpbml0X3Rva2VuKCk7XG5cbiAgLy8gZmxvYXQgMzIgLS0gMHhjYVxuICAvLyBmbG9hdCA2NCAtLSAweGNiXG4gIHRva2VuWzB4Y2FdID0gd3JpdGVOKDB4Y2EsIDQsIHdyaXRlRmxvYXRCRSk7XG4gIHRva2VuWzB4Y2JdID0gd3JpdGVOKDB4Y2IsIDgsIHdyaXRlRG91YmxlQkUpO1xuXG4gIHJldHVybiB0b2tlbjtcbn1cblxuLy8gTm9kZS5qcyBhbmQgYnJvd3NlcnMgd2l0aCBUeXBlZEFycmF5XG5cbmZ1bmN0aW9uIGluaXRfdG9rZW4oKSB7XG4gIC8vIChpbW1lZGlhdGUgdmFsdWVzKVxuICAvLyBwb3NpdGl2ZSBmaXhpbnQgLS0gMHgwMCAtIDB4N2ZcbiAgLy8gbmlsIC0tIDB4YzBcbiAgLy8gZmFsc2UgLS0gMHhjMlxuICAvLyB0cnVlIC0tIDB4YzNcbiAgLy8gbmVnYXRpdmUgZml4aW50IC0tIDB4ZTAgLSAweGZmXG4gIHZhciB0b2tlbiA9IHVpbnQ4LnNsaWNlKCk7XG5cbiAgLy8gYmluIDggLS0gMHhjNFxuICAvLyBiaW4gMTYgLS0gMHhjNVxuICAvLyBiaW4gMzIgLS0gMHhjNlxuICB0b2tlblsweGM0XSA9IHdyaXRlMSgweGM0KTtcbiAgdG9rZW5bMHhjNV0gPSB3cml0ZTIoMHhjNSk7XG4gIHRva2VuWzB4YzZdID0gd3JpdGU0KDB4YzYpO1xuXG4gIC8vIGV4dCA4IC0tIDB4YzdcbiAgLy8gZXh0IDE2IC0tIDB4YzhcbiAgLy8gZXh0IDMyIC0tIDB4YzlcbiAgdG9rZW5bMHhjN10gPSB3cml0ZTEoMHhjNyk7XG4gIHRva2VuWzB4YzhdID0gd3JpdGUyKDB4YzgpO1xuICB0b2tlblsweGM5XSA9IHdyaXRlNCgweGM5KTtcblxuICAvLyBmbG9hdCAzMiAtLSAweGNhXG4gIC8vIGZsb2F0IDY0IC0tIDB4Y2JcbiAgdG9rZW5bMHhjYV0gPSB3cml0ZU4oMHhjYSwgNCwgKEJ1ZmZlcl9wcm90b3R5cGUud3JpdGVGbG9hdEJFIHx8IHdyaXRlRmxvYXRCRSksIHRydWUpO1xuICB0b2tlblsweGNiXSA9IHdyaXRlTigweGNiLCA4LCAoQnVmZmVyX3Byb3RvdHlwZS53cml0ZURvdWJsZUJFIHx8IHdyaXRlRG91YmxlQkUpLCB0cnVlKTtcblxuICAvLyB1aW50IDggLS0gMHhjY1xuICAvLyB1aW50IDE2IC0tIDB4Y2RcbiAgLy8gdWludCAzMiAtLSAweGNlXG4gIC8vIHVpbnQgNjQgLS0gMHhjZlxuICB0b2tlblsweGNjXSA9IHdyaXRlMSgweGNjKTtcbiAgdG9rZW5bMHhjZF0gPSB3cml0ZTIoMHhjZCk7XG4gIHRva2VuWzB4Y2VdID0gd3JpdGU0KDB4Y2UpO1xuICB0b2tlblsweGNmXSA9IHdyaXRlTigweGNmLCA4LCB3cml0ZVVJbnQ2NEJFKTtcblxuICAvLyBpbnQgOCAtLSAweGQwXG4gIC8vIGludCAxNiAtLSAweGQxXG4gIC8vIGludCAzMiAtLSAweGQyXG4gIC8vIGludCA2NCAtLSAweGQzXG4gIHRva2VuWzB4ZDBdID0gd3JpdGUxKDB4ZDApO1xuICB0b2tlblsweGQxXSA9IHdyaXRlMigweGQxKTtcbiAgdG9rZW5bMHhkMl0gPSB3cml0ZTQoMHhkMik7XG4gIHRva2VuWzB4ZDNdID0gd3JpdGVOKDB4ZDMsIDgsIHdyaXRlSW50NjRCRSk7XG5cbiAgLy8gc3RyIDggLS0gMHhkOVxuICAvLyBzdHIgMTYgLS0gMHhkYVxuICAvLyBzdHIgMzIgLS0gMHhkYlxuICB0b2tlblsweGQ5XSA9IHdyaXRlMSgweGQ5KTtcbiAgdG9rZW5bMHhkYV0gPSB3cml0ZTIoMHhkYSk7XG4gIHRva2VuWzB4ZGJdID0gd3JpdGU0KDB4ZGIpO1xuXG4gIC8vIGFycmF5IDE2IC0tIDB4ZGNcbiAgLy8gYXJyYXkgMzIgLS0gMHhkZFxuICB0b2tlblsweGRjXSA9IHdyaXRlMigweGRjKTtcbiAgdG9rZW5bMHhkZF0gPSB3cml0ZTQoMHhkZCk7XG5cbiAgLy8gbWFwIDE2IC0tIDB4ZGVcbiAgLy8gbWFwIDMyIC0tIDB4ZGZcbiAgdG9rZW5bMHhkZV0gPSB3cml0ZTIoMHhkZSk7XG4gIHRva2VuWzB4ZGZdID0gd3JpdGU0KDB4ZGYpO1xuXG4gIHJldHVybiB0b2tlbjtcbn1cblxuLy8gc2FmZSBtb2RlOiBmb3Igb2xkIGJyb3dzZXJzIGFuZCB3aG8gbmVlZHMgYXNzZXJ0c1xuXG5mdW5jdGlvbiBpbml0X3NhZmUoKSB7XG4gIC8vIChpbW1lZGlhdGUgdmFsdWVzKVxuICAvLyBwb3NpdGl2ZSBmaXhpbnQgLS0gMHgwMCAtIDB4N2ZcbiAgLy8gbmlsIC0tIDB4YzBcbiAgLy8gZmFsc2UgLS0gMHhjMlxuICAvLyB0cnVlIC0tIDB4YzNcbiAgLy8gbmVnYXRpdmUgZml4aW50IC0tIDB4ZTAgLSAweGZmXG4gIHZhciB0b2tlbiA9IHVpbnQ4LnNsaWNlKCk7XG5cbiAgLy8gYmluIDggLS0gMHhjNFxuICAvLyBiaW4gMTYgLS0gMHhjNVxuICAvLyBiaW4gMzIgLS0gMHhjNlxuICB0b2tlblsweGM0XSA9IHdyaXRlTigweGM0LCAxLCBCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDgpO1xuICB0b2tlblsweGM1XSA9IHdyaXRlTigweGM1LCAyLCBCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUpO1xuICB0b2tlblsweGM2XSA9IHdyaXRlTigweGM2LCA0LCBCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUpO1xuXG4gIC8vIGV4dCA4IC0tIDB4YzdcbiAgLy8gZXh0IDE2IC0tIDB4YzhcbiAgLy8gZXh0IDMyIC0tIDB4YzlcbiAgdG9rZW5bMHhjN10gPSB3cml0ZU4oMHhjNywgMSwgQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4KTtcbiAgdG9rZW5bMHhjOF0gPSB3cml0ZU4oMHhjOCwgMiwgQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFKTtcbiAgdG9rZW5bMHhjOV0gPSB3cml0ZU4oMHhjOSwgNCwgQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFKTtcblxuICAvLyBmbG9hdCAzMiAtLSAweGNhXG4gIC8vIGZsb2F0IDY0IC0tIDB4Y2JcbiAgdG9rZW5bMHhjYV0gPSB3cml0ZU4oMHhjYSwgNCwgQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUpO1xuICB0b2tlblsweGNiXSA9IHdyaXRlTigweGNiLCA4LCBCdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUpO1xuXG4gIC8vIHVpbnQgOCAtLSAweGNjXG4gIC8vIHVpbnQgMTYgLS0gMHhjZFxuICAvLyB1aW50IDMyIC0tIDB4Y2VcbiAgLy8gdWludCA2NCAtLSAweGNmXG4gIHRva2VuWzB4Y2NdID0gd3JpdGVOKDB4Y2MsIDEsIEJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCk7XG4gIHRva2VuWzB4Y2RdID0gd3JpdGVOKDB4Y2QsIDIsIEJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSk7XG4gIHRva2VuWzB4Y2VdID0gd3JpdGVOKDB4Y2UsIDQsIEJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSk7XG4gIHRva2VuWzB4Y2ZdID0gd3JpdGVOKDB4Y2YsIDgsIHdyaXRlVUludDY0QkUpO1xuXG4gIC8vIGludCA4IC0tIDB4ZDBcbiAgLy8gaW50IDE2IC0tIDB4ZDFcbiAgLy8gaW50IDMyIC0tIDB4ZDJcbiAgLy8gaW50IDY0IC0tIDB4ZDNcbiAgdG9rZW5bMHhkMF0gPSB3cml0ZU4oMHhkMCwgMSwgQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDgpO1xuICB0b2tlblsweGQxXSA9IHdyaXRlTigweGQxLCAyLCBCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSk7XG4gIHRva2VuWzB4ZDJdID0gd3JpdGVOKDB4ZDIsIDQsIEJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFKTtcbiAgdG9rZW5bMHhkM10gPSB3cml0ZU4oMHhkMywgOCwgd3JpdGVJbnQ2NEJFKTtcblxuICAvLyBzdHIgOCAtLSAweGQ5XG4gIC8vIHN0ciAxNiAtLSAweGRhXG4gIC8vIHN0ciAzMiAtLSAweGRiXG4gIHRva2VuWzB4ZDldID0gd3JpdGVOKDB4ZDksIDEsIEJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCk7XG4gIHRva2VuWzB4ZGFdID0gd3JpdGVOKDB4ZGEsIDIsIEJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSk7XG4gIHRva2VuWzB4ZGJdID0gd3JpdGVOKDB4ZGIsIDQsIEJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSk7XG5cbiAgLy8gYXJyYXkgMTYgLS0gMHhkY1xuICAvLyBhcnJheSAzMiAtLSAweGRkXG4gIHRva2VuWzB4ZGNdID0gd3JpdGVOKDB4ZGMsIDIsIEJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSk7XG4gIHRva2VuWzB4ZGRdID0gd3JpdGVOKDB4ZGQsIDQsIEJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSk7XG5cbiAgLy8gbWFwIDE2IC0tIDB4ZGVcbiAgLy8gbWFwIDMyIC0tIDB4ZGZcbiAgdG9rZW5bMHhkZV0gPSB3cml0ZU4oMHhkZSwgMiwgQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFKTtcbiAgdG9rZW5bMHhkZl0gPSB3cml0ZU4oMHhkZiwgNCwgQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFKTtcblxuICByZXR1cm4gdG9rZW47XG59XG5cbmZ1bmN0aW9uIHdyaXRlMSh0eXBlKSB7XG4gIHJldHVybiBmdW5jdGlvbihlbmNvZGVyLCB2YWx1ZSkge1xuICAgIHZhciBvZmZzZXQgPSBlbmNvZGVyLnJlc2VydmUoMik7XG4gICAgdmFyIGJ1ZmZlciA9IGVuY29kZXIuYnVmZmVyO1xuICAgIGJ1ZmZlcltvZmZzZXQrK10gPSB0eXBlO1xuICAgIGJ1ZmZlcltvZmZzZXRdID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHdyaXRlMih0eXBlKSB7XG4gIHJldHVybiBmdW5jdGlvbihlbmNvZGVyLCB2YWx1ZSkge1xuICAgIHZhciBvZmZzZXQgPSBlbmNvZGVyLnJlc2VydmUoMyk7XG4gICAgdmFyIGJ1ZmZlciA9IGVuY29kZXIuYnVmZmVyO1xuICAgIGJ1ZmZlcltvZmZzZXQrK10gPSB0eXBlO1xuICAgIGJ1ZmZlcltvZmZzZXQrK10gPSB2YWx1ZSA+Pj4gODtcbiAgICBidWZmZXJbb2Zmc2V0XSA9IHZhbHVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiB3cml0ZTQodHlwZSkge1xuICByZXR1cm4gZnVuY3Rpb24oZW5jb2RlciwgdmFsdWUpIHtcbiAgICB2YXIgb2Zmc2V0ID0gZW5jb2Rlci5yZXNlcnZlKDUpO1xuICAgIHZhciBidWZmZXIgPSBlbmNvZGVyLmJ1ZmZlcjtcbiAgICBidWZmZXJbb2Zmc2V0KytdID0gdHlwZTtcbiAgICBidWZmZXJbb2Zmc2V0KytdID0gdmFsdWUgPj4+IDI0O1xuICAgIGJ1ZmZlcltvZmZzZXQrK10gPSB2YWx1ZSA+Pj4gMTY7XG4gICAgYnVmZmVyW29mZnNldCsrXSA9IHZhbHVlID4+PiA4O1xuICAgIGJ1ZmZlcltvZmZzZXRdID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHdyaXRlTih0eXBlLCBsZW4sIG1ldGhvZCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGVuY29kZXIsIHZhbHVlKSB7XG4gICAgdmFyIG9mZnNldCA9IGVuY29kZXIucmVzZXJ2ZShsZW4gKyAxKTtcbiAgICBlbmNvZGVyLmJ1ZmZlcltvZmZzZXQrK10gPSB0eXBlO1xuICAgIG1ldGhvZC5jYWxsKGVuY29kZXIuYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHdyaXRlVUludDY0QkUodmFsdWUsIG9mZnNldCkge1xuICBuZXcgVWludDY0QkUodGhpcywgb2Zmc2V0LCB2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlSW50NjRCRSh2YWx1ZSwgb2Zmc2V0KSB7XG4gIG5ldyBJbnQ2NEJFKHRoaXMsIG9mZnNldCwgdmFsdWUpO1xufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0QkUodmFsdWUsIG9mZnNldCkge1xuICBpZWVlNzU0LndyaXRlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCAyMywgNCk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlQkUodmFsdWUsIG9mZnNldCkge1xuICBpZWVlNzU0LndyaXRlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCA1MiwgOCk7XG59XG4iLCIvLyB3cml0ZS10eXBlLmpzXG5cbnZhciBJU19BUlJBWSA9IHJlcXVpcmUoXCJpc2FycmF5XCIpO1xudmFyIEludDY0QnVmZmVyID0gcmVxdWlyZShcImludDY0LWJ1ZmZlclwiKTtcbnZhciBVaW50NjRCRSA9IEludDY0QnVmZmVyLlVpbnQ2NEJFO1xudmFyIEludDY0QkUgPSBJbnQ2NEJ1ZmZlci5JbnQ2NEJFO1xuXG52YXIgQnVmZmVyaXNoID0gcmVxdWlyZShcIi4vYnVmZmVyaXNoXCIpO1xudmFyIEJ1ZmZlclByb3RvID0gcmVxdWlyZShcIi4vYnVmZmVyaXNoLXByb3RvXCIpO1xudmFyIFdyaXRlVG9rZW4gPSByZXF1aXJlKFwiLi93cml0ZS10b2tlblwiKTtcbnZhciB1aW50OCA9IHJlcXVpcmUoXCIuL3dyaXRlLXVpbnQ4XCIpLnVpbnQ4O1xudmFyIEV4dEJ1ZmZlciA9IHJlcXVpcmUoXCIuL2V4dC1idWZmZXJcIikuRXh0QnVmZmVyO1xuXG52YXIgSEFTX1VJTlQ4QVJSQVkgPSAoXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIFVpbnQ4QXJyYXkpO1xudmFyIEhBU19NQVAgPSAoXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIE1hcCk7XG5cbnZhciBleHRtYXAgPSBbXTtcbmV4dG1hcFsxXSA9IDB4ZDQ7XG5leHRtYXBbMl0gPSAweGQ1O1xuZXh0bWFwWzRdID0gMHhkNjtcbmV4dG1hcFs4XSA9IDB4ZDc7XG5leHRtYXBbMTZdID0gMHhkODtcblxuZXhwb3J0cy5nZXRXcml0ZVR5cGUgPSBnZXRXcml0ZVR5cGU7XG5cbmZ1bmN0aW9uIGdldFdyaXRlVHlwZShvcHRpb25zKSB7XG4gIHZhciB0b2tlbiA9IFdyaXRlVG9rZW4uZ2V0V3JpdGVUb2tlbihvcHRpb25zKTtcbiAgdmFyIHVzZXJhdyA9IG9wdGlvbnMgJiYgb3B0aW9ucy51c2VyYXc7XG4gIHZhciBiaW5hcnJheWJ1ZmZlciA9IEhBU19VSU5UOEFSUkFZICYmIG9wdGlvbnMgJiYgb3B0aW9ucy5iaW5hcnJheWJ1ZmZlcjtcbiAgdmFyIGlzQnVmZmVyID0gYmluYXJyYXlidWZmZXIgPyBCdWZmZXJpc2guaXNBcnJheUJ1ZmZlciA6IEJ1ZmZlcmlzaC5pc0J1ZmZlcjtcbiAgdmFyIGJpbiA9IGJpbmFycmF5YnVmZmVyID8gYmluX2FycmF5YnVmZmVyIDogYmluX2J1ZmZlcjtcbiAgdmFyIHVzZW1hcCA9IEhBU19NQVAgJiYgb3B0aW9ucyAmJiBvcHRpb25zLnVzZW1hcDtcbiAgdmFyIG1hcCA9IHVzZW1hcCA/IG1hcF90b19tYXAgOiBvYmpfdG9fbWFwO1xuXG4gIHZhciB3cml0ZVR5cGUgPSB7XG4gICAgXCJib29sZWFuXCI6IGJvb2wsXG4gICAgXCJmdW5jdGlvblwiOiBuaWwsXG4gICAgXCJudW1iZXJcIjogbnVtYmVyLFxuICAgIFwib2JqZWN0XCI6ICh1c2VyYXcgPyBvYmplY3RfcmF3IDogb2JqZWN0KSxcbiAgICBcInN0cmluZ1wiOiBfc3RyaW5nKHVzZXJhdyA/IHJhd19oZWFkX3NpemUgOiBzdHJfaGVhZF9zaXplKSxcbiAgICBcInN5bWJvbFwiOiBuaWwsXG4gICAgXCJ1bmRlZmluZWRcIjogbmlsXG4gIH07XG5cbiAgcmV0dXJuIHdyaXRlVHlwZTtcblxuICAvLyBmYWxzZSAtLSAweGMyXG4gIC8vIHRydWUgLS0gMHhjM1xuICBmdW5jdGlvbiBib29sKGVuY29kZXIsIHZhbHVlKSB7XG4gICAgdmFyIHR5cGUgPSB2YWx1ZSA/IDB4YzMgOiAweGMyO1xuICAgIHRva2VuW3R5cGVdKGVuY29kZXIsIHZhbHVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG51bWJlcihlbmNvZGVyLCB2YWx1ZSkge1xuICAgIHZhciBpdmFsdWUgPSB2YWx1ZSB8IDA7XG4gICAgdmFyIHR5cGU7XG4gICAgaWYgKHZhbHVlICE9PSBpdmFsdWUpIHtcbiAgICAgIC8vIGZsb2F0IDY0IC0tIDB4Y2JcbiAgICAgIHR5cGUgPSAweGNiO1xuICAgICAgdG9rZW5bdHlwZV0oZW5jb2RlciwgdmFsdWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoLTB4MjAgPD0gaXZhbHVlICYmIGl2YWx1ZSA8PSAweDdGKSB7XG4gICAgICAvLyBwb3NpdGl2ZSBmaXhpbnQgLS0gMHgwMCAtIDB4N2ZcbiAgICAgIC8vIG5lZ2F0aXZlIGZpeGludCAtLSAweGUwIC0gMHhmZlxuICAgICAgdHlwZSA9IGl2YWx1ZSAmIDB4RkY7XG4gICAgfSBlbHNlIGlmICgwIDw9IGl2YWx1ZSkge1xuICAgICAgLy8gdWludCA4IC0tIDB4Y2NcbiAgICAgIC8vIHVpbnQgMTYgLS0gMHhjZFxuICAgICAgLy8gdWludCAzMiAtLSAweGNlXG4gICAgICB0eXBlID0gKGl2YWx1ZSA8PSAweEZGKSA/IDB4Y2MgOiAoaXZhbHVlIDw9IDB4RkZGRikgPyAweGNkIDogMHhjZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaW50IDggLS0gMHhkMFxuICAgICAgLy8gaW50IDE2IC0tIDB4ZDFcbiAgICAgIC8vIGludCAzMiAtLSAweGQyXG4gICAgICB0eXBlID0gKC0weDgwIDw9IGl2YWx1ZSkgPyAweGQwIDogKC0weDgwMDAgPD0gaXZhbHVlKSA/IDB4ZDEgOiAweGQyO1xuICAgIH1cbiAgICB0b2tlblt0eXBlXShlbmNvZGVyLCBpdmFsdWUpO1xuICB9XG5cbiAgLy8gdWludCA2NCAtLSAweGNmXG4gIGZ1bmN0aW9uIHVpbnQ2NChlbmNvZGVyLCB2YWx1ZSkge1xuICAgIHZhciB0eXBlID0gMHhjZjtcbiAgICB0b2tlblt0eXBlXShlbmNvZGVyLCB2YWx1ZS50b0FycmF5KCkpO1xuICB9XG5cbiAgLy8gaW50IDY0IC0tIDB4ZDNcbiAgZnVuY3Rpb24gaW50NjQoZW5jb2RlciwgdmFsdWUpIHtcbiAgICB2YXIgdHlwZSA9IDB4ZDM7XG4gICAgdG9rZW5bdHlwZV0oZW5jb2RlciwgdmFsdWUudG9BcnJheSgpKTtcbiAgfVxuXG4gIC8vIHN0ciA4IC0tIDB4ZDlcbiAgLy8gc3RyIDE2IC0tIDB4ZGFcbiAgLy8gc3RyIDMyIC0tIDB4ZGJcbiAgLy8gZml4c3RyIC0tIDB4YTAgLSAweGJmXG4gIGZ1bmN0aW9uIHN0cl9oZWFkX3NpemUobGVuZ3RoKSB7XG4gICAgcmV0dXJuIChsZW5ndGggPCAzMikgPyAxIDogKGxlbmd0aCA8PSAweEZGKSA/IDIgOiAobGVuZ3RoIDw9IDB4RkZGRikgPyAzIDogNTtcbiAgfVxuXG4gIC8vIHJhdyAxNiAtLSAweGRhXG4gIC8vIHJhdyAzMiAtLSAweGRiXG4gIC8vIGZpeHJhdyAtLSAweGEwIC0gMHhiZlxuICBmdW5jdGlvbiByYXdfaGVhZF9zaXplKGxlbmd0aCkge1xuICAgIHJldHVybiAobGVuZ3RoIDwgMzIpID8gMSA6IChsZW5ndGggPD0gMHhGRkZGKSA/IDMgOiA1O1xuICB9XG5cbiAgZnVuY3Rpb24gX3N0cmluZyhoZWFkX3NpemUpIHtcbiAgICByZXR1cm4gc3RyaW5nO1xuXG4gICAgZnVuY3Rpb24gc3RyaW5nKGVuY29kZXIsIHZhbHVlKSB7XG4gICAgICAvLyBwcmVwYXJlIGJ1ZmZlclxuICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcbiAgICAgIHZhciBtYXhzaXplID0gNSArIGxlbmd0aCAqIDM7XG4gICAgICBlbmNvZGVyLm9mZnNldCA9IGVuY29kZXIucmVzZXJ2ZShtYXhzaXplKTtcbiAgICAgIHZhciBidWZmZXIgPSBlbmNvZGVyLmJ1ZmZlcjtcblxuICAgICAgLy8gZXhwZWN0ZWQgaGVhZGVyIHNpemVcbiAgICAgIHZhciBleHBlY3RlZCA9IGhlYWRfc2l6ZShsZW5ndGgpO1xuXG4gICAgICAvLyBleHBlY3RlZCBzdGFydCBwb2ludFxuICAgICAgdmFyIHN0YXJ0ID0gZW5jb2Rlci5vZmZzZXQgKyBleHBlY3RlZDtcblxuICAgICAgLy8gd3JpdGUgc3RyaW5nXG4gICAgICBsZW5ndGggPSBCdWZmZXJQcm90by53cml0ZS5jYWxsKGJ1ZmZlciwgdmFsdWUsIHN0YXJ0KTtcblxuICAgICAgLy8gYWN0dWFsIGhlYWRlciBzaXplXG4gICAgICB2YXIgYWN0dWFsID0gaGVhZF9zaXplKGxlbmd0aCk7XG5cbiAgICAgIC8vIG1vdmUgY29udGVudCB3aGVuIG5lZWRlZFxuICAgICAgaWYgKGV4cGVjdGVkICE9PSBhY3R1YWwpIHtcbiAgICAgICAgdmFyIHRhcmdldFN0YXJ0ID0gc3RhcnQgKyBhY3R1YWwgLSBleHBlY3RlZDtcbiAgICAgICAgdmFyIGVuZCA9IHN0YXJ0ICsgbGVuZ3RoO1xuICAgICAgICBCdWZmZXJQcm90by5jb3B5LmNhbGwoYnVmZmVyLCBidWZmZXIsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKTtcbiAgICAgIH1cblxuICAgICAgLy8gd3JpdGUgaGVhZGVyXG4gICAgICB2YXIgdHlwZSA9IChhY3R1YWwgPT09IDEpID8gKDB4YTAgKyBsZW5ndGgpIDogKGFjdHVhbCA8PSAzKSA/ICgweGQ3ICsgYWN0dWFsKSA6IDB4ZGI7XG4gICAgICB0b2tlblt0eXBlXShlbmNvZGVyLCBsZW5ndGgpO1xuXG4gICAgICAvLyBtb3ZlIGN1cnNvclxuICAgICAgZW5jb2Rlci5vZmZzZXQgKz0gbGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9iamVjdChlbmNvZGVyLCB2YWx1ZSkge1xuICAgIC8vIG51bGxcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHJldHVybiBuaWwoZW5jb2RlciwgdmFsdWUpO1xuXG4gICAgLy8gQnVmZmVyXG4gICAgaWYgKGlzQnVmZmVyKHZhbHVlKSkgcmV0dXJuIGJpbihlbmNvZGVyLCB2YWx1ZSk7XG5cbiAgICAvLyBBcnJheVxuICAgIGlmIChJU19BUlJBWSh2YWx1ZSkpIHJldHVybiBhcnJheShlbmNvZGVyLCB2YWx1ZSk7XG5cbiAgICAvLyBpbnQ2NC1idWZmZXIgb2JqZWN0c1xuICAgIGlmIChVaW50NjRCRS5pc1VpbnQ2NEJFKHZhbHVlKSkgcmV0dXJuIHVpbnQ2NChlbmNvZGVyLCB2YWx1ZSk7XG4gICAgaWYgKEludDY0QkUuaXNJbnQ2NEJFKHZhbHVlKSkgcmV0dXJuIGludDY0KGVuY29kZXIsIHZhbHVlKTtcblxuICAgIC8vIGV4dCBmb3JtYXRzXG4gICAgdmFyIHBhY2tlciA9IGVuY29kZXIuY29kZWMuZ2V0RXh0UGFja2VyKHZhbHVlKTtcbiAgICBpZiAocGFja2VyKSB2YWx1ZSA9IHBhY2tlcih2YWx1ZSk7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRXh0QnVmZmVyKSByZXR1cm4gZXh0KGVuY29kZXIsIHZhbHVlKTtcblxuICAgIC8vIHBsYWluIG9sZCBPYmplY3RzIG9yIE1hcFxuICAgIG1hcChlbmNvZGVyLCB2YWx1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBvYmplY3RfcmF3KGVuY29kZXIsIHZhbHVlKSB7XG4gICAgLy8gQnVmZmVyXG4gICAgaWYgKGlzQnVmZmVyKHZhbHVlKSkgcmV0dXJuIHJhdyhlbmNvZGVyLCB2YWx1ZSk7XG5cbiAgICAvLyBvdGhlcnNcbiAgICBvYmplY3QoZW5jb2RlciwgdmFsdWUpO1xuICB9XG5cbiAgLy8gbmlsIC0tIDB4YzBcbiAgZnVuY3Rpb24gbmlsKGVuY29kZXIsIHZhbHVlKSB7XG4gICAgdmFyIHR5cGUgPSAweGMwO1xuICAgIHRva2VuW3R5cGVdKGVuY29kZXIsIHZhbHVlKTtcbiAgfVxuXG4gIC8vIGZpeGFycmF5IC0tIDB4OTAgLSAweDlmXG4gIC8vIGFycmF5IDE2IC0tIDB4ZGNcbiAgLy8gYXJyYXkgMzIgLS0gMHhkZFxuICBmdW5jdGlvbiBhcnJheShlbmNvZGVyLCB2YWx1ZSkge1xuICAgIHZhciBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7XG4gICAgdmFyIHR5cGUgPSAobGVuZ3RoIDwgMTYpID8gKDB4OTAgKyBsZW5ndGgpIDogKGxlbmd0aCA8PSAweEZGRkYpID8gMHhkYyA6IDB4ZGQ7XG4gICAgdG9rZW5bdHlwZV0oZW5jb2RlciwgbGVuZ3RoKTtcblxuICAgIHZhciBlbmNvZGUgPSBlbmNvZGVyLmNvZGVjLmVuY29kZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBlbmNvZGUoZW5jb2RlciwgdmFsdWVbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIGJpbiA4IC0tIDB4YzRcbiAgLy8gYmluIDE2IC0tIDB4YzVcbiAgLy8gYmluIDMyIC0tIDB4YzZcbiAgZnVuY3Rpb24gYmluX2J1ZmZlcihlbmNvZGVyLCB2YWx1ZSkge1xuICAgIHZhciBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7XG4gICAgdmFyIHR5cGUgPSAobGVuZ3RoIDwgMHhGRikgPyAweGM0IDogKGxlbmd0aCA8PSAweEZGRkYpID8gMHhjNSA6IDB4YzY7XG4gICAgdG9rZW5bdHlwZV0oZW5jb2RlciwgbGVuZ3RoKTtcbiAgICBlbmNvZGVyLnNlbmQodmFsdWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gYmluX2FycmF5YnVmZmVyKGVuY29kZXIsIHZhbHVlKSB7XG4gICAgYmluX2J1ZmZlcihlbmNvZGVyLCBuZXcgVWludDhBcnJheSh2YWx1ZSkpO1xuICB9XG5cbiAgLy8gZml4ZXh0IDEgLS0gMHhkNFxuICAvLyBmaXhleHQgMiAtLSAweGQ1XG4gIC8vIGZpeGV4dCA0IC0tIDB4ZDZcbiAgLy8gZml4ZXh0IDggLS0gMHhkN1xuICAvLyBmaXhleHQgMTYgLS0gMHhkOFxuICAvLyBleHQgOCAtLSAweGM3XG4gIC8vIGV4dCAxNiAtLSAweGM4XG4gIC8vIGV4dCAzMiAtLSAweGM5XG4gIGZ1bmN0aW9uIGV4dChlbmNvZGVyLCB2YWx1ZSkge1xuICAgIHZhciBidWZmZXIgPSB2YWx1ZS5idWZmZXI7XG4gICAgdmFyIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gICAgdmFyIHR5cGUgPSBleHRtYXBbbGVuZ3RoXSB8fCAoKGxlbmd0aCA8IDB4RkYpID8gMHhjNyA6IChsZW5ndGggPD0gMHhGRkZGKSA/IDB4YzggOiAweGM5KTtcbiAgICB0b2tlblt0eXBlXShlbmNvZGVyLCBsZW5ndGgpO1xuICAgIHVpbnQ4W3ZhbHVlLnR5cGVdKGVuY29kZXIpO1xuICAgIGVuY29kZXIuc2VuZChidWZmZXIpO1xuICB9XG5cbiAgLy8gZml4bWFwIC0tIDB4ODAgLSAweDhmXG4gIC8vIG1hcCAxNiAtLSAweGRlXG4gIC8vIG1hcCAzMiAtLSAweGRmXG4gIGZ1bmN0aW9uIG9ial90b19tYXAoZW5jb2RlciwgdmFsdWUpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHR5cGUgPSAobGVuZ3RoIDwgMTYpID8gKDB4ODAgKyBsZW5ndGgpIDogKGxlbmd0aCA8PSAweEZGRkYpID8gMHhkZSA6IDB4ZGY7XG4gICAgdG9rZW5bdHlwZV0oZW5jb2RlciwgbGVuZ3RoKTtcblxuICAgIHZhciBlbmNvZGUgPSBlbmNvZGVyLmNvZGVjLmVuY29kZTtcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBlbmNvZGUoZW5jb2Rlciwga2V5KTtcbiAgICAgIGVuY29kZShlbmNvZGVyLCB2YWx1ZVtrZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGZpeG1hcCAtLSAweDgwIC0gMHg4ZlxuICAvLyBtYXAgMTYgLS0gMHhkZVxuICAvLyBtYXAgMzIgLS0gMHhkZlxuICBmdW5jdGlvbiBtYXBfdG9fbWFwKGVuY29kZXIsIHZhbHVlKSB7XG4gICAgaWYgKCEodmFsdWUgaW5zdGFuY2VvZiBNYXApKSByZXR1cm4gb2JqX3RvX21hcChlbmNvZGVyLCB2YWx1ZSk7XG5cbiAgICB2YXIgbGVuZ3RoID0gdmFsdWUuc2l6ZTtcbiAgICB2YXIgdHlwZSA9IChsZW5ndGggPCAxNikgPyAoMHg4MCArIGxlbmd0aCkgOiAobGVuZ3RoIDw9IDB4RkZGRikgPyAweGRlIDogMHhkZjtcbiAgICB0b2tlblt0eXBlXShlbmNvZGVyLCBsZW5ndGgpO1xuXG4gICAgdmFyIGVuY29kZSA9IGVuY29kZXIuY29kZWMuZW5jb2RlO1xuICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24odmFsLCBrZXksIG0pIHtcbiAgICAgIGVuY29kZShlbmNvZGVyLCBrZXkpO1xuICAgICAgZW5jb2RlKGVuY29kZXIsIHZhbCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyByYXcgMTYgLS0gMHhkYVxuICAvLyByYXcgMzIgLS0gMHhkYlxuICAvLyBmaXhyYXcgLS0gMHhhMCAtIDB4YmZcbiAgZnVuY3Rpb24gcmF3KGVuY29kZXIsIHZhbHVlKSB7XG4gICAgdmFyIGxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcbiAgICB2YXIgdHlwZSA9IChsZW5ndGggPCAzMikgPyAoMHhhMCArIGxlbmd0aCkgOiAobGVuZ3RoIDw9IDB4RkZGRikgPyAweGRhIDogMHhkYjtcbiAgICB0b2tlblt0eXBlXShlbmNvZGVyLCBsZW5ndGgpO1xuICAgIGVuY29kZXIuc2VuZCh2YWx1ZSk7XG4gIH1cbn1cbiIsIi8vIHdyaXRlLXVuaXQ4LmpzXG5cbnZhciBjb25zdGFudCA9IGV4cG9ydHMudWludDggPSBuZXcgQXJyYXkoMjU2KTtcblxuZm9yICh2YXIgaSA9IDB4MDA7IGkgPD0gMHhGRjsgaSsrKSB7XG4gIGNvbnN0YW50W2ldID0gd3JpdGUwKGkpO1xufVxuXG5mdW5jdGlvbiB3cml0ZTAodHlwZSkge1xuICByZXR1cm4gZnVuY3Rpb24oZW5jb2Rlcikge1xuICAgIHZhciBvZmZzZXQgPSBlbmNvZGVyLnJlc2VydmUoMSk7XG4gICAgZW5jb2Rlci5idWZmZXJbb2Zmc2V0XSA9IHR5cGU7XG4gIH07XG59XG4iLCJcbmV4cG9ydCBjbGFzcyBFdmVudEVtaXR0ZXI8VCBleHRlbmRzIHN0cmluZywgVSBleHRlbmRzICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZD4ge1xuICAgIHByaXZhdGUgbGlzdGVuZXJzID0gbmV3IE1hcDxULCBVW10+KCk7XG5cbiAgICBvbihldmVudDogVCwgaGFuZGxlcjogVSkge1xuICAgICAgICBsZXQgaGFuZGxlcnMgPSB0aGlzLmxpc3RlbmVycy5nZXQoZXZlbnQpO1xuICAgICAgICBpZiAoaGFuZGxlcnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaGFuZGxlcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnNldChldmVudCwgaGFuZGxlcnMpO1xuICAgICAgICB9XG4gICAgICAgIGhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgZW1pdChldmVudDogVCwgLi4uZGF0YTogYW55KSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXJzID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGV2ZW50KTtcbiAgICAgICAgaWYgKGhhbmRsZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9ycyA6IEVycm9yW10gPSBbXTtcbiAgICAgICAgICAgIGhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKC4uLmRhdGEpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvKiBFcnJvciBjb25kaXRpb25zIGhlcmUgYXJlIGltcG9zc2libGUgdG8gdGVzdCBmb3IgZnJvbSBzZWxlbml1bVxuICAgICAgICAgICAgICogYmVjYXVzZSBpdCB3b3VsZCBhcmlzZSBmcm9tIHRoZSB3cm9uZyB1c2Ugb2YgdGhlIEFQSSwgd2hpY2ggd2VcbiAgICAgICAgICAgICAqIGNhbid0IHNoaXAgaW4gdGhlIGV4dGVuc2lvbiwgc28gZG9uJ3QgdHJ5IHRvIGluc3RydW1lbnQuICovXG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKEpTT04uc3RyaW5naWZ5KGVycm9ycykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSBcIi4vRXZlbnRFbWl0dGVyXCI7XG5pbXBvcnQgeyBHbG9iYWxTZXR0aW5ncywgTnZpbU1vZGUgfSBmcm9tIFwiLi91dGlscy9jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBhZGRNb2RpZmllciwgbm9uTGl0ZXJhbEtleXMsIHRyYW5zbGF0ZUtleSB9IGZyb20gXCIuL3V0aWxzL2tleXNcIjtcblxuLy8gS2V5SGFuZGxlciBpcyB0aGUgaW50ZXJmYWNlIGV4cGVjdGVkIGJ5IGdldElucHV0XG5leHBvcnQgaW50ZXJmYWNlIEtleUhhbmRsZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXI8XCJpbnB1dFwiLCAoczogc3RyaW5nKSA9PiB2b2lkPiB7XG4gICAgc2V0TW9kZTogKG06IE52aW1Nb2RlKSA9PiB2b2lkLFxuICAgIGZvY3VzOiAoKSA9PiB2b2lkLFxuICAgIG1vdmVUbzogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiB2b2lkLFxufVxuXG50eXBlIEtleWRvd25FbWl0dGluZ09iamVjdCA9IHtcbiAgICBhZGRFdmVudExpc3RlbmVyOiAoczogXCJrZXlkb3duXCIsIGg6ICgoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZCkpID0+IHZvaWQsXG4gICAgZm9jdXM6ICgpID0+IHZvaWRcbn07XG5cbi8vIFRoaXMgY2xhc3MgaW1wbGVtZW50cyB0aGUga2V5ZG93biBsb2dpYyB0aGF0IGRlYWxzIHdpdGggbW9kaWZpZXJzIGFuZCBpc1xuLy8gc2hhcmVkIGFjcm9zcyBib3RoIGJyb3dzZXJzIGFuZCB0aHVuZGVyYmlyZFxuZXhwb3J0IGNsYXNzIEtleWRvd25IYW5kbGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyPFwiaW5wdXRcIiwgKHM6IHN0cmluZykgPT4gdm9pZD4gaW1wbGVtZW50cyBLZXlIYW5kbGVyIHtcbiAgICBwcml2YXRlIGN1cnJlbnRNb2RlIDogTnZpbU1vZGU7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtOiBLZXlkb3duRW1pdHRpbmdPYmplY3QsIHNldHRpbmdzOiBHbG9iYWxTZXR0aW5ncykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBjb25zdCBpZ25vcmVLZXlzID0gc2V0dGluZ3MuaWdub3JlS2V5cztcbiAgICAgICAgdGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldnQpID0+IHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYSB3b3JrYXJvdW5kIGZvciBvc3ggd2hlcmUgcHJlc3Npbmcgbm9uLWFscGhhbnVtZXJpY1xuICAgICAgICAgICAgLy8gY2hhcmFjdGVycyBsaWtlIFwiQFwiIHJlcXVpcmVzIHByZXNzaW5nIDxBLWE+LCB3aGljaCByZXN1bHRzXG4gICAgICAgICAgICAvLyBpbiB0aGUgYnJvd3NlciBzZW5kaW5nIGFuIDxBLUA+IGV2ZW50LCB3aGljaCB3ZSB3YW50IHRvXG4gICAgICAgICAgICAvLyB0cmVhdCBhcyBhIHJlZ3VsYXIgQC5cbiAgICAgICAgICAgIC8vIFNvIGlmIHdlJ3JlIHNlZWluZyBhbiBhbHQgb24gYSBub24tYWxwaGFudW1lcmljIGNoYXJhY3RlcixcbiAgICAgICAgICAgIC8vIHdlIGp1c3QgaWdub3JlIGl0IGFuZCBsZXQgdGhlIGlucHV0IGV2ZW50IGhhbmRsZXIgZG8gaXRzXG4gICAgICAgICAgICAvLyBtYWdpYy4gVGhpcyBjYW4gb25seSBiZSB0ZXN0ZWQgb24gT1NYLCBhcyBnZW5lcmF0aW5nIGFuXG4gICAgICAgICAgICAvLyA8QS1APiBrZXlkb3duIGV2ZW50IHdpdGggc2VsZW5pdW0gd29uJ3QgcmVzdWx0IGluIGFuIGlucHV0XG4gICAgICAgICAgICAvLyBldmVudC5cbiAgICAgICAgICAgIC8vIFNpbmNlIGNvdmVyYWdlIHJlcG9ydHMgYXJlIG9ubHkgcmV0cmlldmVkIG9uIGxpbnV4LCB3ZSBkb24ndFxuICAgICAgICAgICAgLy8gaW5zdHJ1bWVudCB0aGlzIGNvbmRpdGlvbi5cbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgICAgICBpZiAoZXZ0LmFsdEtleSAmJiBzZXR0aW5ncy5hbHQgPT09IFwiYWxwaGFudW1cIiAmJiAhL1thLXpBLVowLTldLy50ZXN0KGV2dC5rZXkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTm90ZTogb3JkZXIgb2YgdGhpcyBhcnJheSBpcyBpbXBvcnRhbnQsIHdlIG5lZWQgdG8gY2hlY2sgT1MgYmVmb3JlIGNoZWNraW5nIG1ldGFcbiAgICAgICAgICAgIGNvbnN0IHNwZWNpYWxLZXlzID0gW1tcIkFsdFwiLCBcIkFcIl0sIFtcIkNvbnRyb2xcIiwgXCJDXCJdLCBbXCJPU1wiLCBcIkRcIl0sIFtcIk1ldGFcIiwgXCJEXCJdXTtcbiAgICAgICAgICAgIC8vIFRoZSBldmVudCBoYXMgdG8gYmUgdHJ1c3RlZCBhbmQgZWl0aGVyIGhhdmUgYSBtb2RpZmllciBvciBhIG5vbi1saXRlcmFsIHJlcHJlc2VudGF0aW9uXG4gICAgICAgICAgICBpZiAoZXZ0LmlzVHJ1c3RlZFxuICAgICAgICAgICAgICAgICYmIChub25MaXRlcmFsS2V5c1tldnQua2V5XSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIHx8IHNwZWNpYWxLZXlzLmZpbmQoKFttb2QsIF9dOiBbc3RyaW5nLCBzdHJpbmddKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2dC5rZXkgIT09IG1vZCAmJiAoZXZ0IGFzIGFueSkuZ2V0TW9kaWZpZXJTdGF0ZShtb2QpKSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gc3BlY2lhbEtleXMuY29uY2F0KFtbXCJTaGlmdFwiLCBcIlNcIl1dKVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGtleTogc3RyaW5nLCBbYXR0ciwgbW9kXTogW3N0cmluZywgc3RyaW5nXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKGV2dCBhcyBhbnkpLmdldE1vZGlmaWVyU3RhdGUoYXR0cikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhZGRNb2RpZmllcihtb2QsIGtleSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgICAgICAgICB9LCB0cmFuc2xhdGVLZXkoZXZ0LmtleSkpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGtleXMgOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGlmIChpZ25vcmVLZXlzW3RoaXMuY3VycmVudE1vZGVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAga2V5cyA9IGlnbm9yZUtleXNbdGhpcy5jdXJyZW50TW9kZV0uc2xpY2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGlnbm9yZUtleXMuYWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAga2V5cy5wdXNoLmFwcGx5KGtleXMsIGlnbm9yZUtleXMuYWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFrZXlzLmluY2x1ZGVzKHRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcImlucHV0XCIsIHRleHQpO1xuICAgICAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZXZ0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmb2N1cygpIHtcbiAgICAgICAgdGhpcy5lbGVtLmZvY3VzKCk7XG4gICAgfVxuXG4gICAgbW92ZVRvKF86IG51bWJlciwgX186IG51bWJlcikge1xuICAgICAgICAvLyBEb24ndCBkbyBudXRoaW5cbiAgICB9XG5cbiAgICBzZXRNb2RlKHM6IE52aW1Nb2RlKSB7XG4gICAgICAgIHRoaXMuY3VycmVudE1vZGUgPSBzO1xuICAgIH1cbn07XG4iLCJpbXBvcnQgeyBQYWdlVHlwZSB9IGZyb20gXCIuL3BhZ2VcIlxuaW1wb3J0ICogYXMgQ2FudmFzUmVuZGVyZXIgZnJvbSBcIi4vcmVuZGVyZXJcIjtcbmltcG9ydCB7IFN0ZGluIH0gZnJvbSBcIi4vU3RkaW5cIjtcbmltcG9ydCB7IFN0ZG91dCB9IGZyb20gXCIuL1N0ZG91dFwiO1xuaW1wb3J0IHsgdG9GaWxlTmFtZSB9IGZyb20gXCIuL3V0aWxzL3V0aWxzXCI7XG5pbXBvcnQgeyBnZXRDb25mRm9yVXJsIH0gZnJvbSBcIi4vdXRpbHMvY29uZmlndXJhdGlvblwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbmVvdmltKFxuICAgICAgICBwYWdlOiBQYWdlVHlwZSxcbiAgICAgICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCxcbiAgICAgICAgeyBwb3J0LCBwYXNzd29yZCB9OiB7IHBvcnQ6IG51bWJlciwgcGFzc3dvcmQ6IHN0cmluZyB9LFxuICAgICkge1xuICAgIGNvbnN0IGZ1bmN0aW9uczogYW55ID0ge307XG4gICAgY29uc3QgcmVxdWVzdHMgPSBuZXcgTWFwPG51bWJlciwgeyByZXNvbHZlOiBhbnksIHJlamVjdDogYW55IH0+KCk7XG5cbiAgICBDYW52YXNSZW5kZXJlci5zZXRDYW52YXMoY2FudmFzKTtcbiAgICBDYW52YXNSZW5kZXJlci5ldmVudHMub24oXCJyZXNpemVcIiwgKHtncmlkLCB3aWR0aCwgaGVpZ2h0fTogYW55KSA9PiB7XG4gICAgICAgIChmdW5jdGlvbnMgYXMgYW55KS51aV90cnlfcmVzaXplX2dyaWQoZ3JpZCwgd2lkdGgsIGhlaWdodCk7XG4gICAgfSk7XG4gICAgQ2FudmFzUmVuZGVyZXIuZXZlbnRzLm9uKFwiZnJhbWVSZXNpemVcIiwgKHt3aWR0aCwgaGVpZ2h0fTogYW55KSA9PiB7XG4gICAgICAgIHBhZ2UucmVzaXplRWRpdG9yKHdpZHRoLCBoZWlnaHQpO1xuICAgIH0pO1xuXG4gICAgbGV0IHByZXZOb3RpZmljYXRpb25Qcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgY29uc3Qgc29ja2V0ID0gbmV3IFdlYlNvY2tldChgd3M6Ly8xMjcuMC4wLjE6JHtwb3J0fS8ke3Bhc3N3b3JkfWApO1xuICAgIHNvY2tldC5iaW5hcnlUeXBlID0gXCJhcnJheWJ1ZmZlclwiO1xuICAgIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwiY2xvc2VcIiwgKChfOiBhbnkpID0+IHtcbiAgICAgICAgcHJldk5vdGlmaWNhdGlvblByb21pc2UgPSBwcmV2Tm90aWZpY2F0aW9uUHJvbWlzZS5maW5hbGx5KCgpID0+IHBhZ2Uua2lsbEVkaXRvcigpKTtcbiAgICB9KSk7XG4gICAgYXdhaXQgKG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgIH0pKSk7XG4gICAgY29uc3Qgc3RkaW4gPSBuZXcgU3RkaW4oc29ja2V0KTtcbiAgICBjb25zdCBzdGRvdXQgPSBuZXcgU3Rkb3V0KHNvY2tldCk7XG5cbiAgICBsZXQgcmVxSWQgPSAwO1xuICAgIGNvbnN0IHJlcXVlc3QgPSAoYXBpOiBzdHJpbmcsIGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICByZXFJZCArPSAxO1xuICAgICAgICAgICAgcmVxdWVzdHMuc2V0KHJlcUlkLCB7cmVzb2x2ZSwgcmVqZWN0fSk7XG4gICAgICAgICAgICBzdGRpbi53cml0ZShyZXFJZCwgYXBpLCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBzdGRvdXQub24oXCJyZXF1ZXN0XCIsIChpZDogbnVtYmVyLCBuYW1lOiBhbnksIGFyZ3M6IGFueSkgPT4ge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJmaXJlbnZpbTogdW5oYW5kbGVkIHJlcXVlc3QgZnJvbSBuZW92aW1cIiwgaWQsIG5hbWUsIGFyZ3MpO1xuICAgIH0pO1xuICAgIHN0ZG91dC5vbihcInJlc3BvbnNlXCIsIChpZDogYW55LCBlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCByID0gcmVxdWVzdHMuZ2V0KGlkKTtcbiAgICAgICAgaWYgKCFyKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGNhbid0IGhhcHBlbiBhbmQgeWV0IGl0IHNvbWV0aW1lcyBkb2VzLCBwb3NzaWJseSBkdWUgdG8gYSBmaXJlZm94IGJ1Z1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgUmVjZWl2ZWQgYW5zd2VyIHRvICR7aWR9IGJ1dCBubyBoYW5kbGVyIGZvdW5kIWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVxdWVzdHMuZGVsZXRlKGlkKTtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHIucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgci5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBsYXN0TG9zdEZvY3VzID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgc3Rkb3V0Lm9uKFwibm90aWZpY2F0aW9uXCIsIGFzeW5jIChuYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgIGlmIChuYW1lID09PSBcInJlZHJhd1wiICYmIGFyZ3MpIHtcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmVyLm9uUmVkcmF3KGFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHByZXZOb3RpZmljYXRpb25Qcm9taXNlID0gcHJldk5vdGlmaWNhdGlvblByb21pc2UuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgICAvLyBBIHZlcnkgdHJpY2t5IHNlcXVlbmNlIG9mIGV2ZW50cyBjb3VsZCBoYXBwZW4gaGVyZTpcbiAgICAgICAgICAgIC8vIC0gZmlyZW52aW1fYnVmd3JpdGUgaXMgcmVjZWl2ZWQgcGFnZS5zZXRFbGVtZW50Q29udGVudCBpcyBjYWxsZWRcbiAgICAgICAgICAgIC8vICAgYXN5bmNocm9ub3VzbHlcbiAgICAgICAgICAgIC8vIC0gZmlyZW52aW1fZm9jdXNfcGFnZSBpcyBjYWxsZWQsIHBhZ2UuZm9jdXNQYWdlKCkgaXMgY2FsbGVkXG4gICAgICAgICAgICAvLyAgIGFzeW5jaHJvbm91c2x5LCBsYXN0TG9zdEZvY3VzIGlzIHNldCB0byBub3dcbiAgICAgICAgICAgIC8vIC0gcGFnZS5zZXRFbGVtZW50Q29udGVudCBjb21wbGV0ZXMsIGxhc3RMb3N0Rm9jdXMgaXMgY2hlY2tlZCB0byBzZWVcbiAgICAgICAgICAgIC8vICAgaWYgZm9jdXMgc2hvdWxkIGJlIGdyYWJiZWQgb3Igbm90XG4gICAgICAgICAgICAvLyBUaGF0J3Mgd2h5IHdlIGhhdmUgdG8gY2hlY2sgZm9yIGxhc3RMb3N0Rm9jdXMgYWZ0ZXJcbiAgICAgICAgICAgIC8vIHBhZ2Uuc2V0RWxlbWVudENvbnRlbnQvQ3Vyc29yISBTYW1lIHRoaW5nIGZvciBmaXJlbnZpbV9wcmVzc19rZXlzXG4gICAgICAgICAgICBjb25zdCBoYWRGb2N1cyA9IGRvY3VtZW50Lmhhc0ZvY3VzKCk7XG4gICAgICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiZmlyZW52aW1fc3luY193aXRoX2VsbVwiOiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW3BhZ2UuZ2V0RWxlbWVudENvbnRlbnQoKSwgcGFnZS5nZXRFZGl0b3JJbmZvKCldKS50aGVuKChbY29udGVudCwgW3VybCwgc2VsZWN0b3IsIGN1cnNvciwgbGFuZ3VhZ2VdXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybFNldHRpbmdzID0gZ2V0Q29uZkZvclVybCh1cmwpO1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVuYW1lID0gdG9GaWxlTmFtZSh1cmxTZXR0aW5ncy5maWxlbmFtZSwgdXJsLCBzZWxlY3RvciwgbGFuZ3VhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFtsaW5lLCBjb2xdID0gY3Vyc29yO1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbnMuY2FsbF9mdW5jdGlvbihcIndyaXRlZmlsZVwiLCBbY29udGVudC5zcGxpdChcIlxcblwiKSwgZmlsZW5hbWVdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gZnVuY3Rpb25zLmNvbW1hbmQoYGVkaXQgJHtmaWxlbmFtZX0gYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgYHwgY2FsbCBudmltX3dpbl9zZXRfY3Vyc29yKDAsIFske2xpbmV9LCAke2NvbH1dKWApKTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgXCJmaXJlbnZpbV9idWZ3cml0ZVwiOlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhcmdzWzBdIGFzIHsgdGV4dDogc3RyaW5nW10sIGN1cnNvcjogW251bWJlciwgbnVtYmVyXSB9O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFnZS5zZXRFbGVtZW50Q29udGVudChkYXRhLnRleHQuam9pbihcIlxcblwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHBhZ2Uuc2V0RWxlbWVudEN1cnNvciguLi4oZGF0YS5jdXJzb3IpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFkRm9jdXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgIWRvY3VtZW50Lmhhc0ZvY3VzKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKHBlcmZvcm1hbmNlLm5vdygpIC0gbGFzdExvc3RGb2N1cyA+IDMwMDApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBcImZpcmVudmltX2V2YWxfanNcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2UuZXZhbEluUGFnZShhcmdzWzBdKS5jYXRjaChfID0+IF8pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmdzWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdChcIm52aW1fY2FsbF9mdW5jdGlvblwiLCBbYXJnc1sxXSwgW0pTT04uc3RyaW5naWZ5KHJlc3VsdCldXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJmaXJlbnZpbV9mb2N1c19wYWdlXCI6XG4gICAgICAgICAgICAgICAgICAgIGxhc3RMb3N0Rm9jdXMgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2UuZm9jdXNQYWdlKCk7XG4gICAgICAgICAgICAgICAgY2FzZSBcImZpcmVudmltX2ZvY3VzX2lucHV0XCI6XG4gICAgICAgICAgICAgICAgICAgIGxhc3RMb3N0Rm9jdXMgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2UuZm9jdXNJbnB1dCgpO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJmaXJlbnZpbV9oaWRlX2ZyYW1lXCI6XG4gICAgICAgICAgICAgICAgICAgIGxhc3RMb3N0Rm9jdXMgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2UuaGlkZUVkaXRvcigpO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJmaXJlbnZpbV9wcmVzc19rZXlzXCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYWdlLnByZXNzS2V5cyhhcmdzWzBdKTtcbiAgICAgICAgICAgICAgICBjYXNlIFwiZmlyZW52aW1fdmltbGVhdmVcIjpcbiAgICAgICAgICAgICAgICAgICAgbGFzdExvc3RGb2N1cyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFnZS5raWxsRWRpdG9yKCk7XG4gICAgICAgICAgICAgICAgY2FzZSBcImZpcmVudmltX3RodW5kZXJiaXJkX3NlbmRcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmNOYW1lOiBbXCJ0aHVuZGVyYmlyZFNlbmRcIl0sXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHsgMDogY2hhbm5lbCwgMTogYXBpSW5mbyB9ID0gKGF3YWl0IHJlcXVlc3QoXCJudmltX2dldF9hcGlfaW5mb1wiLCBbXSkpIGFzIElOdmltQXBpSW5mbztcblxuICAgIHN0ZG91dC5zZXRUeXBlcyhhcGlJbmZvLnR5cGVzKTtcblxuICAgIE9iamVjdC5hc3NpZ24oZnVuY3Rpb25zLCBhcGlJbmZvLmZ1bmN0aW9uc1xuICAgICAgICAuZmlsdGVyKGYgPT4gZi5kZXByZWNhdGVkX3NpbmNlID09PSB1bmRlZmluZWQpXG4gICAgICAgIC5yZWR1Y2UoKGFjYywgY3VyKSA9PiB7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IGN1ci5uYW1lO1xuICAgICAgICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aChcIm52aW1fXCIpKSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IG5hbWUuc2xpY2UoNSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY2NbbmFtZV0gPSAoLi4uYXJnczogYW55W10pID0+IHJlcXVlc3QoY3VyLm5hbWUsIGFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30gYXMge1trOiBzdHJpbmddOiAoLi4uYXJnczogYW55W10pID0+IGFueX0pKTtcbiAgICBmdW5jdGlvbnMuZ2V0X2N1cnJlbnRfY2hhbm5lbCA9ICgpID0+IGNoYW5uZWw7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucztcbn1cbiIsImltcG9ydCAqIGFzIG1zZ3BhY2sgZnJvbSBcIm1zZ3BhY2stbGl0ZVwiO1xuXG5leHBvcnQgY2xhc3MgU3RkaW4ge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBzb2NrZXQ6IFdlYlNvY2tldCkge31cblxuICAgIHB1YmxpYyB3cml0ZShyZXFJZDogbnVtYmVyLCBtZXRob2Q6IHN0cmluZywgYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgcmVxID0gWzAsIHJlcUlkLCBtZXRob2QsIGFyZ3NdO1xuICAgICAgICBjb25zdCBlbmNvZGVkID0gbXNncGFjay5lbmNvZGUocmVxKTtcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChlbmNvZGVkKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCAqIGFzIG1zZ3BhY2sgZnJvbSBcIm1zZ3BhY2stbGl0ZVwiO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSBcIi4vRXZlbnRFbWl0dGVyXCI7XG5cbnR5cGUgTWVzc2FnZUtpbmQgPSBcInJlcXVlc3RcIiB8IFwicmVzcG9uc2VcIiB8IFwibm90aWZpY2F0aW9uXCI7XG50eXBlIFJlcXVlc3RIYW5kbGVyID0gKGlkOiBudW1iZXIsIG5hbWU6IHN0cmluZywgYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIFJlc3BvbnNlSGFuZGxlciA9IChpZDogbnVtYmVyLCBlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZDtcbnR5cGUgTm90aWZpY2F0aW9uSGFuZGxlciA9IChuYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xudHlwZSBNZXNzYWdlSGFuZGxlciA9IFJlcXVlc3RIYW5kbGVyIHwgUmVzcG9uc2VIYW5kbGVyIHwgTm90aWZpY2F0aW9uSGFuZGxlcjtcbmV4cG9ydCBjbGFzcyBTdGRvdXQgZXh0ZW5kcyBFdmVudEVtaXR0ZXI8TWVzc2FnZUtpbmQsIE1lc3NhZ2VIYW5kbGVyPntcbiAgICBwcml2YXRlIG1lc3NhZ2VOYW1lcyA9IG5ldyBNYXA8bnVtYmVyLCBNZXNzYWdlS2luZD4oW1swLCBcInJlcXVlc3RcIl0sIFsxLCBcInJlc3BvbnNlXCJdLCBbMiwgXCJub3RpZmljYXRpb25cIl1dKTtcbiAgICAvLyBIb2xkcyBwcmV2aW91c2x5LXJlY2VpdmVkLCBpbmNvbXBsZXRlIGFuZCB1bnByb2Nlc3NlZCBtZXNzYWdlc1xuICAgIHByaXZhdGUgcHJldiA9IG5ldyBVaW50OEFycmF5KDApO1xuICAgIHByaXZhdGUgbXNncGFja0NvbmZpZyA9IHt9IGFzIG1zZ3BhY2suRGVjb2Rlck9wdGlvbnM7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNvY2tldDogV2ViU29ja2V0KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIHRoaXMub25NZXNzYWdlLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRUeXBlcyh0eXBlczoge1trZXk6IHN0cmluZ106IHsgaWQ6IG51bWJlciB9fSkge1xuICAgICAgICB0aGlzLm1zZ3BhY2tDb25maWcuY29kZWMgPSBtc2dwYWNrLmNyZWF0ZUNvZGVjKHsgcHJlc2V0OiB0cnVlIH0pO1xuICAgICAgICBPYmplY3RcbiAgICAgICAgICAgIC5lbnRyaWVzKHR5cGVzKVxuICAgICAgICAgICAgLmZvckVhY2goKFtfLCB7IGlkIH1dKSA9PlxuICAgICAgICAgICAgICAgICAgICAgdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgLm1zZ3BhY2tDb25maWdcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb2RlY1xuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZEV4dFVucGFja2VyKGlkLCAoZGF0YTogYW55KSA9PiBkYXRhKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbk1lc3NhZ2UobXNnOiBhbnkpIHtcbiAgICAgICAgY29uc3QgbXNnRGF0YSA9IG5ldyBVaW50OEFycmF5KG1zZy5kYXRhKTtcbiAgICAgICAgbGV0IGRhdGEgPSBuZXcgVWludDhBcnJheShtc2dEYXRhLmJ5dGVMZW5ndGggKyB0aGlzLnByZXYuYnl0ZUxlbmd0aCk7XG4gICAgICAgIGRhdGEuc2V0KHRoaXMucHJldik7XG4gICAgICAgIGRhdGEuc2V0KG1zZ0RhdGEsIHRoaXMucHJldi5sZW5ndGgpO1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgbGV0IGRlY29kZWQ7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGRlY29kZWQgPSBtc2dwYWNrLmRlY29kZShkYXRhLCB0aGlzLm1zZ3BhY2tDb25maWcpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJldiA9IGRhdGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZW5jb2RlZCA9IG1zZ3BhY2suZW5jb2RlKGRlY29kZWQpO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEuc2xpY2UoZW5jb2RlZC5ieXRlTGVuZ3RoKTtcbiAgICAgICAgICAgIGNvbnN0IFtraW5kLCByZXFJZCwgZGF0YTEsIGRhdGEyXSA9IGRlY29kZWQ7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5tZXNzYWdlTmFtZXMuZ2V0KGtpbmQpO1xuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KG5hbWUsIHJlcUlkLCBkYXRhMSwgZGF0YTIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBDYW4ndCBiZSB0ZXN0ZWQgYmVjYXVzZSB0aGlzIHdvdWxkIG1lYW4gbWVzc2FnZXMgdGhhdCBicmVha1xuICAgICAgICAgICAgICAgIC8vIHRoZSBtc2dwYWNrLXJwYyBzcGVjLCBzbyBjb3ZlcmFnZSBpbXBvc3NpYmxlIHRvIGdldC5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBVbmhhbmRsZWQgbWVzc2FnZSBraW5kICR7bmFtZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IG5lb3ZpbSB9IGZyb20gXCIuL05lb3ZpbVwiO1xuaW1wb3J0IHsgZ2V0R3JpZElkLCBnZXRMb2dpY2FsU2l6ZSwgY29tcHV0ZUdyaWREaW1lbnNpb25zRm9yLCBnZXRHcmlkQ29vcmRpbmF0ZXMsIGV2ZW50cyBhcyByZW5kZXJlckV2ZW50cyB9IGZyb20gXCIuL3JlbmRlcmVyXCI7XG5pbXBvcnQgeyBjb25mUmVhZHksIGdldENvbmZGb3JVcmwsIE52aW1Nb2RlIH0gZnJvbSBcIi4vdXRpbHMvY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgdG9GaWxlTmFtZSB9IGZyb20gXCIuL3V0aWxzL3V0aWxzXCI7XG5pbXBvcnQgeyBQYWdlVHlwZSB9IGZyb20gXCIuL3BhZ2VcIjtcbmltcG9ydCB7IEtleUhhbmRsZXIgfSBmcm9tIFwiLi9LZXlIYW5kbGVyXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXR1cElucHV0KFxuICAgIHBhZ2U6IFBhZ2VUeXBlLFxuICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsXG4gICAga2V5SGFuZGxlcjogS2V5SGFuZGxlcixcbiAgICBjb25uZWN0aW9uUHJvbWlzZTogUHJvbWlzZTx7IHBvcnQ6IG51bWJlciwgcGFzc3dvcmQ6IHN0cmluZyB9Pixcbikge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IFtbdXJsLCBzZWxlY3RvciwgY3Vyc29yLCBsYW5ndWFnZV0sIGNvbm5lY3Rpb25EYXRhXSA9XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbcGFnZS5nZXRFZGl0b3JJbmZvKCksIGNvbm5lY3Rpb25Qcm9taXNlXSk7XG4gICAgICAgIGNvbnN0IG52aW1Qcm9taXNlID0gbmVvdmltKHBhZ2UsIGNhbnZhcywgY29ubmVjdGlvbkRhdGEpO1xuICAgICAgICBjb25zdCBjb250ZW50UHJvbWlzZSA9IHBhZ2UuZ2V0RWxlbWVudENvbnRlbnQoKTtcblxuICAgICAgICBjb25zdCBbY29scywgcm93c10gPSBnZXRMb2dpY2FsU2l6ZSgpO1xuXG4gICAgICAgIGNvbnN0IG52aW0gPSBhd2FpdCBudmltUHJvbWlzZTtcblxuICAgICAgICBrZXlIYW5kbGVyLm9uKFwiaW5wdXRcIiwgKHM6IHN0cmluZykgPT4gbnZpbS5pbnB1dChzKSk7XG4gICAgICAgIHJlbmRlcmVyRXZlbnRzLm9uKFwibW9kZUNoYW5nZVwiLCAoczogTnZpbU1vZGUpID0+IGtleUhhbmRsZXIuc2V0TW9kZShzKSk7XG5cbiAgICAgICAgLy8gV2UgbmVlZCB0byBzZXQgY2xpZW50IGluZm8gYmVmb3JlIHJ1bm5pbmcgdWlfYXR0YWNoIGJlY2F1c2Ugd2Ugd2FudCB0aGlzXG4gICAgICAgIC8vIGluZm8gdG8gYmUgYXZhaWxhYmxlIHdoZW4gVUlFbnRlciBpcyB0cmlnZ2VyZWRcbiAgICAgICAgY29uc3QgZXh0SW5mbyA9IGJyb3dzZXIucnVudGltZS5nZXRNYW5pZmVzdCgpO1xuICAgICAgICBjb25zdCBbbWFqb3IsIG1pbm9yLCBwYXRjaF0gPSBleHRJbmZvLnZlcnNpb24uc3BsaXQoXCIuXCIpO1xuICAgICAgICBudmltLnNldF9jbGllbnRfaW5mbyhleHRJbmZvLm5hbWUsXG4gICAgICAgICAgICB7IG1ham9yLCBtaW5vciwgcGF0Y2ggfSxcbiAgICAgICAgICAgIFwidWlcIixcbiAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAge30sXG4gICAgICAgICk7XG5cbiAgICAgICAgYXdhaXQgY29uZlJlYWR5O1xuICAgICAgICBjb25zdCB1cmxTZXR0aW5ncyA9IGdldENvbmZGb3JVcmwodXJsKTtcbiAgICAgICAgbnZpbS51aV9hdHRhY2goXG4gICAgICAgICAgICBjb2xzIDwgMSA/IDEgOiBjb2xzLFxuICAgICAgICAgICAgcm93cyA8IDEgPyAxIDogcm93cyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBleHRfbGluZWdyaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgZXh0X21lc3NhZ2VzOiB1cmxTZXR0aW5ncy5jbWRsaW5lID09PSBcImZpcmVudmltXCIsXG4gICAgICAgICAgICAgICAgcmdiOiB0cnVlLFxuICAgICAgICB9KS5jYXRjaChjb25zb2xlLmxvZyk7XG5cbiAgICAgICAgbGV0IHJlc2l6ZVJlcUlkID0gMDtcbiAgICAgICAgcGFnZS5vbihcInJlc2l6ZVwiLCAoW2lkLCB3aWR0aCwgaGVpZ2h0XTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSA9PiB7XG4gICAgICAgICAgICBpZiAoaWQgPiByZXNpemVSZXFJZCkge1xuICAgICAgICAgICAgICAgIHJlc2l6ZVJlcUlkID0gaWQ7XG4gICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBwdXQgdGhlIGtleUhhbmRsZXIgYXQgdGhlIG9yaWdpbiBpbiBvcmRlciB0byBhdm9pZFxuICAgICAgICAgICAgICAgIC8vIGlzc3VlcyB3aGVuIGl0IHNsaXBzIG91dCBvZiB0aGUgdmlld3BvcnRcbiAgICAgICAgICAgICAgICBrZXlIYW5kbGVyLm1vdmVUbygwLCAwKTtcbiAgICAgICAgICAgICAgICAvLyBJdCdzIHRlbXB0aW5nIHRvIHRyeSB0byBvcHRpbWl6ZSB0aGlzIGJ5IG9ubHkgY2FsbGluZ1xuICAgICAgICAgICAgICAgIC8vIHVpX3RyeV9yZXNpemUgd2hlbiBuQ29scyBpcyBkaWZmZXJlbnQgZnJvbSBjb2xzIGFuZCBuUm93cyBpc1xuICAgICAgICAgICAgICAgIC8vIGRpZmZlcmVudCBmcm9tIHJvd3MgYnV0IHdlIGNhbid0IGJlY2F1c2UgcmVkcmF3IG5vdGlmaWNhdGlvbnNcbiAgICAgICAgICAgICAgICAvLyBtaWdodCBoYXBwZW4gd2l0aG91dCB1cyBhY3R1YWxseSBjYWxsaW5nIHVpX3RyeV9yZXNpemUgYW5kIHRoZW5cbiAgICAgICAgICAgICAgICAvLyB0aGUgc2l6ZXMgd291bGRuJ3QgYmUgaW4gc3luYyBhbnltb3JlXG4gICAgICAgICAgICAgICAgY29uc3QgW25Db2xzLCBuUm93c10gPSBjb21wdXRlR3JpZERpbWVuc2lvbnNGb3IoXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoICogd2luZG93LmRldmljZVBpeGVsUmF0aW8sXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBudmltLnVpX3RyeV9yZXNpemVfZ3JpZChnZXRHcmlkSWQoKSwgbkNvbHMsIG5Sb3dzKTtcbiAgICAgICAgICAgICAgICBwYWdlLnJlc2l6ZUVkaXRvcihNYXRoLmZsb29yKHdpZHRoIC8gbkNvbHMpICogbkNvbHMsIE1hdGguZmxvb3IoaGVpZ2h0IC8gblJvd3MpICogblJvd3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcGFnZS5vbihcImZyYW1lX3NlbmRLZXlcIiwgKGFyZ3MpID0+IG52aW0uaW5wdXQoYXJncy5qb2luKFwiXCIpKSk7XG4gICAgICAgIHBhZ2Uub24oXCJnZXRfYnVmX2NvbnRlbnRcIiwgKHI6IGFueSkgPT4gcihudmltLmJ1Zl9nZXRfbGluZXMoMCwgMCwgLTEsIDApKSk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGZpbGUsIHNldCBpdHMgY29udGVudCB0byB0aGUgdGV4dGFyZWEncywgd3JpdGUgaXRcbiAgICAgICAgY29uc3QgZmlsZW5hbWUgPSB0b0ZpbGVOYW1lKHVybFNldHRpbmdzLmZpbGVuYW1lLCB1cmwsIHNlbGVjdG9yLCBsYW5ndWFnZSk7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBjb250ZW50UHJvbWlzZTtcbiAgICAgICAgY29uc3QgW2xpbmUsIGNvbF0gPSBjdXJzb3I7XG4gICAgICAgIGNvbnN0IHdyaXRlRmlsZVByb21pc2UgPSBudmltLmNhbGxfZnVuY3Rpb24oXCJ3cml0ZWZpbGVcIiwgW2NvbnRlbnQuc3BsaXQoXCJcXG5cIiksIGZpbGVuYW1lXSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IG52aW0uY29tbWFuZChgZWRpdCAke2ZpbGVuYW1lfSBgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBgfCBjYWxsIG52aW1fd2luX3NldF9jdXJzb3IoMCwgWyR7bGluZX0sICR7Y29sfV0pYCkpO1xuXG4gICAgICAgIC8vIENhbid0IGdldCBjb3ZlcmFnZSBmb3IgdGhpcyBhcyBicm93c2VycyBkb24ndCBsZXQgdXMgcmVsaWFibHlcbiAgICAgICAgLy8gcHVzaCBkYXRhIHRvIHRoZSBzZXJ2ZXIgb24gYmVmb3JldW5sb2FkLlxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImJlZm9yZXVubG9hZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBudmltLnVpX2RldGFjaCgpO1xuICAgICAgICAgICAgbnZpbS5jb21tYW5kKFwicWFsbCFcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEtlZXAgdHJhY2sgb2YgbGFzdCBhY3RpdmUgaW5zdGFuY2UgKG5lY2Vzc2FyeSBmb3IgZmlyZW52aW0jZm9jdXNfaW5wdXQoKSAmIG90aGVycylcbiAgICAgICAgY29uc3QgY2hhbiA9IG52aW0uZ2V0X2N1cnJlbnRfY2hhbm5lbCgpO1xuICAgICAgICBmdW5jdGlvbiBzZXRDdXJyZW50Q2hhbigpIHtcbiAgICAgICAgICAgIG52aW0uc2V0X3ZhcihcImxhc3RfZm9jdXNlZF9maXJlbnZpbV9jaGFubmVsXCIsIGNoYW4pO1xuICAgICAgICB9XG4gICAgICAgIHNldEN1cnJlbnRDaGFuKCk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgc2V0Q3VycmVudENoYW4pO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNldEN1cnJlbnRDaGFuKTtcblxuICAgICAgICBjb25zdCBhdWdyb3VwTmFtZSA9IGBGaXJlbnZpbUF1Z3JvdXBDaGFuJHtjaGFufWA7XG4gICAgICAgIC8vIENsZWFudXAgbWVhbnM6XG4gICAgICAgIC8vIC0gbm90aWZ5IGZyb250ZW5kIHRoYXQgd2UncmUgc2h1dHRpbmcgZG93blxuICAgICAgICAvLyAtIGRlbGV0ZSBmaWxlXG4gICAgICAgIC8vIC0gcmVtb3ZlIG93biBhdWdyb3VwXG4gICAgICAgIGNvbnN0IGNsZWFudXAgPSBgY2FsbCBycGNub3RpZnkoJHtjaGFufSwgJ2ZpcmVudmltX3ZpbWxlYXZlJykgfCBgXG4gICAgICAgICAgICAgICAgICAgICsgYGNhbGwgZGVsZXRlKCcke2ZpbGVuYW1lfScpYDtcbiAgICAgICAgLy8gQXNrIGZvciBub3RpZmljYXRpb25zIHdoZW4gdXNlciB3cml0ZXMvbGVhdmVzIGZpcmVudmltXG4gICAgICAgIG52aW0uY2FsbF9hdG9taWMoKGBhdWdyb3VwICR7YXVncm91cE5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICBhdSFcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9jbWQgQnVmV3JpdGUgJHtmaWxlbmFtZX0gYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgYGNhbGwgcnBjbm90aWZ5KCR7Y2hhbn0sIGBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBgJ2ZpcmVudmltX2J1ZndyaXRlJywgYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIGB7YFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBgJ3RleHQnOiBudmltX2J1Zl9nZXRfbGluZXMoMCwgMCwgLTEsIDApLGBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgYCdjdXJzb3InOiBudmltX3dpbl9nZXRfY3Vyc29yKDApLGBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1IFZpbUxlYXZlICogJHtjbGVhbnVwfVxuICAgICAgICAgICAgICAgICAgICBhdWdyb3VwIEVORGApLnNwbGl0KFwiXFxuXCIpLm1hcChjb21tYW5kID0+IFtcIm52aW1fY29tbWFuZFwiLCBbY29tbWFuZF1dKSk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGV2dDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAga2V5SGFuZGxlci5tb3ZlVG8oZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZ1bmN0aW9uIG9uTW91c2UoZXZ0OiBNb3VzZUV2ZW50LCBhY3Rpb246IHN0cmluZykge1xuICAgICAgICAgICAgbGV0IGJ1dHRvbjtcbiAgICAgICAgICAgIC8vIFNlbGVuaXVtIGNhbid0IGdlbmVyYXRlIHdoZWVsIGV2ZW50cyB5ZXQgOihcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgICAgICBpZiAoZXZ0IGluc3RhbmNlb2YgV2hlZWxFdmVudCkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbiA9IFwid2hlZWxcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU2VsZW5pdW0gY2FuJ3QgZ2VuZXJhdGUgbW91c2UgZXZlbnRzIHdpdGggbW9yZSBidXR0b25zIDooXG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICAgICAgICBpZiAoZXZ0LmJ1dHRvbiA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTmVvdmltIGRvZXNuJ3QgaGFuZGxlIG90aGVyIG1vdXNlIGJ1dHRvbnMgZm9yIG5vd1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJ1dHRvbiA9IFtcImxlZnRcIiwgXCJtaWRkbGVcIiwgXCJyaWdodFwiXVtldnQuYnV0dG9uXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZ0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICBjb25zdCBtb2RpZmllcnMgPSAoZXZ0LmFsdEtleSA/IFwiQVwiIDogXCJcIikgK1xuICAgICAgICAgICAgICAgIChldnQuY3RybEtleSA/IFwiQ1wiIDogXCJcIikgK1xuICAgICAgICAgICAgICAgIChldnQubWV0YUtleSA/IFwiRFwiIDogXCJcIikgK1xuICAgICAgICAgICAgICAgIChldnQuc2hpZnRLZXkgPyBcIlNcIiA6IFwiXCIpO1xuICAgICAgICAgICAgY29uc3QgW3gsIHldID0gZ2V0R3JpZENvb3JkaW5hdGVzKGV2dC5wYWdlWCwgZXZ0LnBhZ2VZKTtcbiAgICAgICAgICAgIG52aW0uaW5wdXRfbW91c2UoYnV0dG9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGlmaWVycyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0R3JpZElkKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgpO1xuICAgICAgICAgICAga2V5SGFuZGxlci5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGUgPT4ge1xuICAgICAgICAgICAgb25Nb3VzZShlLCBcInByZXNzXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGUgPT4ge1xuICAgICAgICAgICAgb25Nb3VzZShlLCBcInJlbGVhc2VcIik7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBTZWxlbml1bSBkb2Vzbid0IGxldCB5b3Ugc2ltdWxhdGUgbW91c2Ugd2hlZWwgZXZlbnRzIDooXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwid2hlZWxcIiwgZXZ0ID0+IHtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhldnQuZGVsdGFZKSA+PSBNYXRoLmFicyhldnQuZGVsdGFYKSkge1xuICAgICAgICAgICAgICAgIG9uTW91c2UoZXZ0LCBldnQuZGVsdGFZIDwgMCA/IFwidXBcIiA6IFwiZG93blwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb25Nb3VzZShldnQsIGV2dC5kZWx0YVggPCAwID8gXCJyaWdodFwiIDogXCJsZWZ0XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gTGV0IHVzZXJzIGtub3cgd2hlbiB0aGV5IGZvY3VzL3VuZm9jdXMgdGhlIGZyYW1lXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcbiAgICAgICAgICAgIGtleUhhbmRsZXIuZm9jdXMoKTtcbiAgICAgICAgICAgIG52aW0uY29tbWFuZChcImRvYXV0b2NtZCBGb2N1c0dhaW5lZFwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuICAgICAgICAgICAgbnZpbS5jb21tYW5kKFwiZG9hdXRvY21kIEZvY3VzTG9zdFwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGtleUhhbmRsZXIuZm9jdXMoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlICgocmVzb2x2ZSwgcmVqZWN0KSA9PiBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGtleUhhbmRsZXIuZm9jdXMoKTtcbiAgICAgICAgICAgIHdyaXRlRmlsZVByb21pc2UudGhlbigoKSA9PiByZXNvbHZlKHBhZ2UpKTtcbiAgICAgICAgICAgIC8vIFRvIGhhcmQgdG8gdGVzdCAod2UnZCBuZWVkIHRvIGZpbmQgYSB3YXkgdG8gbWFrZSBuZW92aW0gZmFpbFxuICAgICAgICAgICAgLy8gdG8gd3JpdGUgdGhlIGZpbGUsIHdoaWNoIHJlcXVpcmVzIHRvbyBtYW55IG9zLWRlcGVuZGVudCBzaWRlXG4gICAgICAgICAgICAvLyBlZmZlY3RzKSwgc28gZG9uJ3QgaW5zdHJ1bWVudC5cbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgICAgICB3cml0ZUZpbGVQcm9taXNlLmNhdGNoKCgpID0+IHJlamVjdCgpKTtcbiAgICAgICAgfSwgMTApKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIHBhZ2Uua2lsbEVkaXRvcigpO1xuICAgICAgICB0aHJvdyBlO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEV2ZW50RW1pdHRlciAgICB9IGZyb20gXCIuL0V2ZW50RW1pdHRlclwiO1xuaW1wb3J0IHsgRmlyZW52aW1FbGVtZW50IH0gZnJvbSBcIi4vRmlyZW52aW1FbGVtZW50XCI7XG5pbXBvcnQgeyBleGVjdXRlSW5QYWdlICAgfSBmcm9tIFwiLi91dGlscy91dGlsc1wiO1xuaW1wb3J0IHsgZ2V0Q29uZiAgICAgICAgIH0gZnJvbSBcIi4vdXRpbHMvY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsga2V5c1RvRXZlbnRzICAgIH0gZnJvbSBcIi4vdXRpbHMva2V5c1wiO1xuXG4vLyBUaGlzIG1vZHVsZSBpcyBsb2FkZWQgaW4gYm90aCB0aGUgYnJvd3NlcidzIGNvbnRlbnQgc2NyaXB0LCB0aGUgYnJvd3NlcidzXG4vLyBmcmFtZSBzY3JpcHQgYW5kIHRodW5kZXJiaXJkJ3MgY29tcG9zZSBzY3JpcHQuXG4vLyBBcyBzdWNoLCBpdCBzaG91bGQgbm90IGhhdmUgYW55IHNpZGUgZWZmZWN0cy5cblxuaW50ZXJmYWNlIElHbG9iYWxTdGF0ZSB7XG4gICAgZGlzYWJsZWQ6IGJvb2xlYW4gfCBQcm9taXNlPGJvb2xlYW4+O1xuICAgIGxhc3RGb2N1c2VkQ29udGVudFNjcmlwdDogbnVtYmVyO1xuICAgIGZpcmVudmltRWxlbXM6IE1hcDxudW1iZXIsIEZpcmVudmltRWxlbWVudD47XG4gICAgZnJhbWVJZFJlc29sdmU6IChfOiBudW1iZXIpID0+IHZvaWQ7XG4gICAgbnZpbWlmeTogKGV2dDogRm9jdXNFdmVudCkgPT4gdm9pZDtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBGdW5jdGlvbnMgcnVubmluZyBpbiB0aGUgY29udGVudCBzY3JpcHQgLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5mdW5jdGlvbiBfZm9jdXNJbnB1dChnbG9iYWw6IElHbG9iYWxTdGF0ZSwgZmlyZW52aW06IEZpcmVudmltRWxlbWVudCwgYWRkTGlzdGVuZXI6IGJvb2xlYW4pIHtcbiAgICBpZiAoYWRkTGlzdGVuZXIpIHtcbiAgICAgICAgLy8gT25seSByZS1hZGQgZXZlbnQgbGlzdGVuZXIgaWYgaW5wdXQncyBzZWxlY3RvciBtYXRjaGVzIHRoZSBvbmVzXG4gICAgICAgIC8vIHRoYXQgc2hvdWxkIGJlIGF1dG9udmltaWZpZWRcbiAgICAgICAgY29uc3QgY29uZiA9IGdldENvbmYoKTtcbiAgICAgICAgaWYgKGNvbmYuc2VsZWN0b3IgJiYgY29uZi5zZWxlY3RvciAhPT0gXCJcIikge1xuICAgICAgICAgICAgY29uc3QgZWxlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoY29uZi5zZWxlY3RvcikpO1xuICAgICAgICAgICAgYWRkTGlzdGVuZXIgPSBlbGVtcy5pbmNsdWRlcyhmaXJlbnZpbS5nZXRFbGVtZW50KCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZpcmVudmltLmZvY3VzT3JpZ2luYWxFbGVtZW50KGFkZExpc3RlbmVyKTtcbn1cblxuZnVuY3Rpb24gZ2V0Rm9jdXNlZEVsZW1lbnQgKGZpcmVudmltRWxlbXM6IE1hcDxudW1iZXIsIEZpcmVudmltRWxlbWVudD4pIHtcbiAgICByZXR1cm4gQXJyYXlcbiAgICAgICAgLmZyb20oZmlyZW52aW1FbGVtcy52YWx1ZXMoKSlcbiAgICAgICAgLmZpbmQoaW5zdGFuY2UgPT4gaW5zdGFuY2UuaXNGb2N1c2VkKCkpO1xufVxuXG4vLyBUYWIgZnVuY3Rpb25zIGFyZSBmdW5jdGlvbnMgYWxsIGNvbnRlbnQgc2NyaXB0cyBzaG91bGQgcmVhY3QgdG9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYWJGdW5jdGlvbnMoZ2xvYmFsOiBJR2xvYmFsU3RhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRBY3RpdmVJbnN0YW5jZUNvdW50IDogKCkgPT4gZ2xvYmFsLmZpcmVudmltRWxlbXMuc2l6ZSxcbiAgICAgICAgcmVnaXN0ZXJOZXdGcmFtZUlkOiAoZnJhbWVJZDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICBnbG9iYWwuZnJhbWVJZFJlc29sdmUoZnJhbWVJZCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldERpc2FibGVkOiAoZGlzYWJsZWQ6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgIGdsb2JhbC5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgICAgICB9LFxuICAgICAgICBzZXRMYXN0Rm9jdXNlZENvbnRlbnRTY3JpcHQ6IChmcmFtZUlkOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGdsb2JhbC5sYXN0Rm9jdXNlZENvbnRlbnRTY3JpcHQgPSBmcmFtZUlkO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gaXNWaXNpYmxlKGU6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcmVjdCA9IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgdmlld0hlaWdodCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgcmV0dXJuICEocmVjdC5ib3R0b20gPCAwIHx8IHJlY3QudG9wIC0gdmlld0hlaWdodCA+PSAwKTtcbn1cblxuLy8gQWN0aXZlQ29udGVudCBmdW5jdGlvbnMgYXJlIGZ1bmN0aW9ucyBvbmx5IHRoZSBhY3RpdmUgY29udGVudCBzY3JpcHQgc2hvdWxkIHJlYWN0IHRvXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWN0aXZlQ29udGVudEZ1bmN0aW9ucyhnbG9iYWw6IElHbG9iYWxTdGF0ZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGZvcmNlTnZpbWlmeTogKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGVsZW0gPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgICAgICAgY29uc3QgaXNOdWxsID0gZWxlbSA9PT0gbnVsbCB8fCBlbGVtID09PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBwYWdlTm90RWRpdGFibGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY29udGVudEVkaXRhYmxlICE9PSBcInRydWVcIjtcbiAgICAgICAgICAgIGNvbnN0IGJvZHlOb3RFZGl0YWJsZSA9IChkb2N1bWVudC5ib2R5LmNvbnRlbnRFZGl0YWJsZSA9PT0gXCJmYWxzZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCAoZG9jdW1lbnQuYm9keS5jb250ZW50RWRpdGFibGUgPT09IFwiaW5oZXJpdFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNvbnRlbnRFZGl0YWJsZSAhPT0gXCJ0cnVlXCIpKTtcbiAgICAgICAgICAgIGlmIChpc051bGxcbiAgICAgICAgICAgICAgICB8fCAoZWxlbSA9PT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIHBhZ2VOb3RFZGl0YWJsZSlcbiAgICAgICAgICAgICAgICB8fCAoZWxlbSA9PT0gZG9jdW1lbnQuYm9keSAmJiBib2R5Tm90RWRpdGFibGUpKSB7XG4gICAgICAgICAgICAgICAgZWxlbSA9IEFycmF5LmZyb20oZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0ZXh0YXJlYVwiKSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoaXNWaXNpYmxlKTtcbiAgICAgICAgICAgICAgICBpZiAoIWVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbSA9IEFycmF5LmZyb20oZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKGUgPT4gZS50eXBlID09PSBcInRleHRcIiAmJiBpc1Zpc2libGUoZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdsb2JhbC5udmltaWZ5KHsgdGFyZ2V0OiBlbGVtIH0gYXMgYW55KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2VuZEtleTogKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaXJlbnZpbSA9IGdldEZvY3VzZWRFbGVtZW50KGdsb2JhbC5maXJlbnZpbUVsZW1zKTtcbiAgICAgICAgICAgIGlmIChmaXJlbnZpbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZmlyZW52aW0uc2VuZEtleShrZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBJdCdzIGltcG9ydGFudCB0byB0aHJvdyB0aGlzIGVycm9yIGFzIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxuICAgICAgICAgICAgICAgIC8vIHdpbGwgZXhlY3V0ZSBhIGZhbGxiYWNrXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gZmlyZW52aW0gZnJhbWUgc2VsZWN0ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5lb3ZpbUZyYW1lRnVuY3Rpb25zKGdsb2JhbDogSUdsb2JhbFN0YXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZXZhbEluUGFnZTogKF86IG51bWJlciwganM6IHN0cmluZykgPT4gZXhlY3V0ZUluUGFnZShqcyksXG4gICAgICAgIGZvY3VzSW5wdXQ6IChmcmFtZUlkOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGxldCBmaXJlbnZpbUVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoZnJhbWVJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZmlyZW52aW1FbGVtZW50ID0gZ2V0Rm9jdXNlZEVsZW1lbnQoZ2xvYmFsLmZpcmVudmltRWxlbXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaXJlbnZpbUVsZW1lbnQgPSBnbG9iYWwuZmlyZW52aW1FbGVtcy5nZXQoZnJhbWVJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfZm9jdXNJbnB1dChnbG9iYWwsIGZpcmVudmltRWxlbWVudCwgdHJ1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzUGFnZTogKGZyYW1lSWQ6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmlyZW52aW1FbGVtZW50ID0gZ2xvYmFsLmZpcmVudmltRWxlbXMuZ2V0KGZyYW1lSWQpO1xuICAgICAgICAgICAgZmlyZW52aW1FbGVtZW50LmNsZWFyRm9jdXNMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIChkb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIGFueSkuYmx1cigpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldEVkaXRvckluZm86IChmcmFtZUlkOiBudW1iZXIpID0+IGdsb2JhbFxuICAgICAgICAgICAgLmZpcmVudmltRWxlbXNcbiAgICAgICAgICAgIC5nZXQoZnJhbWVJZClcbiAgICAgICAgICAgIC5nZXRCdWZmZXJJbmZvKCksXG4gICAgICAgIGdldEVsZW1lbnRDb250ZW50OiAoZnJhbWVJZDogbnVtYmVyKSA9PiBnbG9iYWxcbiAgICAgICAgICAgIC5maXJlbnZpbUVsZW1zXG4gICAgICAgICAgICAuZ2V0KGZyYW1lSWQpXG4gICAgICAgICAgICAuZ2V0UGFnZUVsZW1lbnRDb250ZW50KCksXG4gICAgICAgIGhpZGVFZGl0b3I6IChmcmFtZUlkOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICh3aW5kb3cgYXMgYW55KS5fX2ZpcmVudmltX21udF9lbG0uc3R5bGUudmlzaWJpbGl0eSA9ICd1bnNldCdcbiAgICAgICAgICAgIGNvbnN0IGZpcmVudmltID0gZ2xvYmFsLmZpcmVudmltRWxlbXMuZ2V0KGZyYW1lSWQpO1xuICAgICAgICAgICAgZmlyZW52aW0uaGlkZSgpO1xuICAgICAgICAgICAgX2ZvY3VzSW5wdXQoZ2xvYmFsLCBmaXJlbnZpbSwgdHJ1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGtpbGxFZGl0b3I6IChmcmFtZUlkOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICh3aW5kb3cgYXMgYW55KS5fX2ZpcmVudmltX21udF9lbG0uc3R5bGUudmlzaWJpbGl0eSA9ICd1bnNldCdcbiAgICAgICAgICAgIGNvbnN0IGZpcmVudmltID0gZ2xvYmFsLmZpcmVudmltRWxlbXMuZ2V0KGZyYW1lSWQpO1xuICAgICAgICAgICAgY29uc3QgaXNGb2N1c2VkID0gZmlyZW52aW0uaXNGb2N1c2VkKCk7XG4gICAgICAgICAgICBmaXJlbnZpbS5kZXRhY2hGcm9tUGFnZSgpO1xuICAgICAgICAgICAgY29uc3QgY29uZiA9IGdldENvbmYoKTtcbiAgICAgICAgICAgIGlmIChpc0ZvY3VzZWQpIHtcbiAgICAgICAgICAgICAgICBfZm9jdXNJbnB1dChnbG9iYWwsIGZpcmVudmltLCBjb25mLnRha2VvdmVyICE9PSBcIm9uY2VcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnbG9iYWwuZmlyZW52aW1FbGVtcy5kZWxldGUoZnJhbWVJZCk7XG4gICAgICAgIH0sXG4gICAgICAgIHByZXNzS2V5czogKGZyYW1lSWQ6IG51bWJlciwga2V5czogc3RyaW5nW10pID0+IHtcbiAgICAgICAgICAgIGdsb2JhbC5maXJlbnZpbUVsZW1zLmdldChmcmFtZUlkKS5wcmVzc0tleXMoa2V5c1RvRXZlbnRzKGtleXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzaXplRWRpdG9yOiAoZnJhbWVJZDogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWxlbSA9IGdsb2JhbC5maXJlbnZpbUVsZW1zLmdldChmcmFtZUlkKTtcbiAgICAgICAgICAgIGVsZW0ucmVzaXplVG8od2lkdGgsIGhlaWdodCwgdHJ1ZSk7XG4gICAgICAgICAgICBlbGVtLnB1dEVkaXRvckNsb3NlVG9JbnB1dE9yaWdpbkFmdGVyUmVzaXplRnJvbUZyYW1lKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEVsZW1lbnRDb250ZW50OiAoZnJhbWVJZDogbnVtYmVyLCB0ZXh0OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWwuZmlyZW52aW1FbGVtcy5nZXQoZnJhbWVJZCkuc2V0UGFnZUVsZW1lbnRDb250ZW50KHRleHQpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRFbGVtZW50Q3Vyc29yOiAoZnJhbWVJZDogbnVtYmVyLCBsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsLmZpcmVudmltRWxlbXMuZ2V0KGZyYW1lSWQpLnNldFBhZ2VFbGVtZW50Q3Vyc29yKGxpbmUsIGNvbHVtbik7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBEZWZpbml0aW9uIG9mIGEgcHJveHkgdHlwZSB0aGF0IGxldHMgdGhlIGZyYW1lIHNjcmlwdCB0cmFuc3BhcmVudGx5IGNhbGwgLy9cbi8vIHRoZSBjb250ZW50IHNjcmlwdCdzIGZ1bmN0aW9ucyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG47XG5cbi8vIFRoZSBwcm94eSBhdXRvbWF0aWNhbGx5IGFwcGVuZHMgdGhlIGZyYW1lSWQgdG8gdGhlIHJlcXVlc3QsIHNvIHdlIGhpZGUgdGhhdCBmcm9tIHVzZXJzXG50eXBlIEFyZ3VtZW50c1R5cGU8VD4gPSBUIGV4dGVuZHMgKHg6IGFueSwgLi4uYXJnczogaW5mZXIgVSkgPT4gYW55ID8gVTogbmV2ZXI7XG50eXBlIFByb21pc2lmeTxUPiA9IFQgZXh0ZW5kcyBQcm9taXNlPGFueT4gPyBUIDogUHJvbWlzZTxUPjtcblxudHlwZSBmdCA9IFJldHVyblR5cGU8dHlwZW9mIGdldE5lb3ZpbUZyYW1lRnVuY3Rpb25zPlxuXG50eXBlIFBhZ2VFdmVudHMgPSBcInJlc2l6ZVwiIHwgXCJmcmFtZV9zZW5kS2V5XCIgfCBcImdldF9idWZfY29udGVudFwiIHwgXCJwYXVzZV9rZXloYW5kbGVyXCI7XG50eXBlIFBhZ2VIYW5kbGVycyA9IChhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbmV4cG9ydCBjbGFzcyBQYWdlRXZlbnRFbWl0dGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyPFBhZ2VFdmVudHMsIFBhZ2VIYW5kbGVycz4ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChyZXF1ZXN0OiBhbnksIF9zZW5kZXI6IGFueSwgX3NlbmRSZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKHJlcXVlc3QuZnVuY05hbWVbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwicGF1c2Vfa2V5aGFuZGxlclwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJmcmFtZV9zZW5kS2V5XCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcInJlc2l6ZVwiOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQocmVxdWVzdC5mdW5jTmFtZVswXSwgcmVxdWVzdC5hcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImdldF9idWZfY29udGVudFwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLmVtaXQocmVxdWVzdC5mdW5jTmFtZVswXSwgcmVzb2x2ZSkpO1xuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUuZXJyb3IoXCJVbmhhbmRsZWQgcGFnZSByZXF1ZXN0OlwiLCByZXF1ZXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgdHlwZSBQYWdlVHlwZSA9IFBhZ2VFdmVudEVtaXR0ZXIgJiB7XG4gICAgW2sgaW4ga2V5b2YgZnRdOiAoLi4uYXJnczogQXJndW1lbnRzVHlwZTxmdFtrXT4pID0+IFByb21pc2lmeTxSZXR1cm5UeXBlPGZ0W2tdPj47XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFnZVByb3h5IChmcmFtZUlkOiBudW1iZXIpIHtcbiAgICBjb25zdCBwYWdlID0gbmV3IFBhZ2VFdmVudEVtaXR0ZXIoKTtcblxuICAgIGxldCBmdW5jTmFtZToga2V5b2YgUGFnZVR5cGU7XG4gICAgZm9yIChmdW5jTmFtZSBpbiBnZXROZW92aW1GcmFtZUZ1bmN0aW9ucyh7fSBhcyBhbnkpKSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gZGVjbGFyZSBmdW5jIGhlcmUgYmVjYXVzZSBmdW5jTmFtZSBpcyBhIGdsb2JhbCBhbmQgd291bGQgbm90XG4gICAgICAgIC8vIGJlIGNhcHR1cmVkIGluIHRoZSBjbG9zdXJlIG90aGVyd2lzZVxuICAgICAgICBjb25zdCBmdW5jID0gZnVuY05hbWU7XG4gICAgICAgIChwYWdlIGFzIGFueSlbZnVuY10gPSAoKC4uLmFycjogYW55W10pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW2ZyYW1lSWRdLmNvbmNhdChhcnIpLFxuICAgICAgICAgICAgICAgICAgICBmdW5jTmFtZTogW2Z1bmNdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY05hbWU6IFtcIm1lc3NhZ2VQYWdlXCJdLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcGFnZSBhcyBQYWdlVHlwZTtcbn07XG4iLCJpbXBvcnQgeyBwYXJzZUd1aWZvbnQsIHRvSGV4Q3NzIH0gZnJvbSBcIi4vdXRpbHMvdXRpbHNcIjtcbmltcG9ydCB7IE52aW1Nb2RlLCBjb25mUmVhZHksIGdldEdsb2JhbENvbmYgfSBmcm9tIFwiLi91dGlscy9jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tIFwiLi9FdmVudEVtaXR0ZXJcIjtcblxudHlwZSBSZXNpemVFdmVudCA9IHtncmlkOiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyfTtcbnR5cGUgRnJhbWVSZXNpemVFdmVudCA9IHt3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcn1cbnR5cGUgTW9kZUNoYW5nZUV2ZW50ID0gTnZpbU1vZGU7XG50eXBlIFJlc2l6ZUV2ZW50SGFuZGxlciA9IChlOiBSZXNpemVFdmVudCB8IEZyYW1lUmVzaXplRXZlbnQgfCBNb2RlQ2hhbmdlRXZlbnQpID0+IHZvaWQ7XG50eXBlIEV2ZW50S2luZCA9IFwicmVzaXplXCIgfCBcImZyYW1lUmVzaXplXCIgfCBcIm1vZGVDaGFuZ2VcIjtcbmV4cG9ydCBjb25zdCBldmVudHMgPSBuZXcgRXZlbnRFbWl0dGVyPEV2ZW50S2luZCwgUmVzaXplRXZlbnRIYW5kbGVyPigpO1xuXG5sZXQgZ2x5cGhDYWNoZSA6IGFueSA9IHt9O1xuZnVuY3Rpb24gd2lwZUdseXBoQ2FjaGUoKSB7XG4gICAgZ2x5cGhDYWNoZSA9IHt9O1xufVxuXG5sZXQgbWV0cmljc0ludmFsaWRhdGVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGludmFsaWRhdGVNZXRyaWNzKCkge1xuICAgIG1ldHJpY3NJbnZhbGlkYXRlZCA9IHRydWU7XG4gICAgd2lwZUdseXBoQ2FjaGUoKTtcbn1cblxubGV0IGZvbnRTdHJpbmcgOiBzdHJpbmc7XG5mdW5jdGlvbiBzZXRGb250U3RyaW5nIChzdGF0ZTogU3RhdGUsIHMgOiBzdHJpbmcpIHtcbiAgICBmb250U3RyaW5nID0gcztcbiAgICBzdGF0ZS5jb250ZXh0LmZvbnQgPSBmb250U3RyaW5nO1xuICAgIGludmFsaWRhdGVNZXRyaWNzKCk7XG59XG5mdW5jdGlvbiBnbHlwaElkKGNoYXI6IHN0cmluZywgaGlnaDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGNoYXIgKyBcIi1cIiArIGhpZ2g7XG59XG5mdW5jdGlvbiBzZXRDYW52YXNEaW1lbnNpb25zIChjdnM6IEhUTUxDYW52YXNFbGVtZW50LCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xuICAgIGN2cy53aWR0aCA9IHdpZHRoICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgY3ZzLmhlaWdodCA9IGhlaWdodCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgIGN2cy5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICBjdnMuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcbn1cbmZ1bmN0aW9uIG1ha2VGb250U3RyaW5nKGZvbnRTaXplOiBzdHJpbmcsIGZvbnRGYW1pbHk6IHN0cmluZykge1xuICAgIHJldHVybiBgJHtmb250U2l6ZX0gJHtmb250RmFtaWx5fWA7XG59XG5sZXQgZGVmYXVsdEZvbnRTaXplID0gXCJcIjtcbmNvbnN0IGRlZmF1bHRGb250RmFtaWx5ID0gXCJtb25vc3BhY2VcIjtcbmxldCBkZWZhdWx0Rm9udFN0cmluZyA9IFwiXCI7XG5leHBvcnQgZnVuY3Rpb24gc2V0Q2FudmFzIChjdnM6IEhUTUxDYW52YXNFbGVtZW50KSB7XG4gICAgY29uc3Qgc3RhdGUgPSBnbG9iYWxTdGF0ZTtcbiAgICBzdGF0ZS5jYW52YXMgPSBjdnM7XG4gICAgc2V0Q2FudmFzRGltZW5zaW9ucyhzdGF0ZS5jYW52YXMsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgZGVmYXVsdEZvbnRTaXplID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoc3RhdGUuY2FudmFzKS5mb250U2l6ZTtcbiAgICBkZWZhdWx0Rm9udFN0cmluZyA9IG1ha2VGb250U3RyaW5nKGRlZmF1bHRGb250U2l6ZSwgZGVmYXVsdEZvbnRGYW1pbHkpO1xuICAgIHN0YXRlLmNvbnRleHQgPSBzdGF0ZS5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIsIHsgXCJhbHBoYVwiOiBmYWxzZSB9KTtcbiAgICBzZXRGb250U3RyaW5nKHN0YXRlLCBkZWZhdWx0Rm9udFN0cmluZyk7XG59XG5cbi8vIFdlIGZpcnN0IGRlZmluZSBoaWdobGlnaHQgaW5mb3JtYXRpb24uXG5jb25zdCBkZWZhdWx0QmFja2dyb3VuZCA9IFwiI0ZGRkZGRlwiO1xuY29uc3QgZGVmYXVsdEZvcmVncm91bmQgPSBcIiMwMDAwMDBcIjtcbnR5cGUgSGlnaGxpZ2h0SW5mbyA9IHtcbiAgICBiYWNrZ3JvdW5kOiBzdHJpbmcsXG4gICAgYm9sZDogYm9vbGVhbixcbiAgICBibGVuZDogbnVtYmVyLFxuICAgIGZvcmVncm91bmQ6IHN0cmluZyxcbiAgICBpdGFsaWM6IGJvb2xlYW4sXG4gICAgcmV2ZXJzZTogYm9vbGVhbixcbiAgICBzcGVjaWFsOiBzdHJpbmcsXG4gICAgc3RyaWtldGhyb3VnaDogYm9vbGVhbixcbiAgICB1bmRlcmN1cmw6IGJvb2xlYW4sXG4gICAgdW5kZXJsaW5lOiBib29sZWFuXG59O1xuXG4vLyBXZSB0aGVuIGhhdmUgYSBHcmlkU2l6ZSB0eXBlLiBXZSBuZWVkIHRoaXMgdHlwZSBpbiBvcmRlciB0byBrZWVwIHRyYWNrIG9mXG4vLyB0aGUgc2l6ZSBvZiBncmlkcy4gU3RvcmluZyB0aGlzIGluZm9ybWF0aW9uIGhlcmUgY2FuIGFwcGVhciByZWR1bmRhbnQgc2luY2Vcbi8vIHRoZSBncmlkcyBhcmUgcmVwcmVzZW50ZWQgYXMgYXJyYXlzIGFuZCB0aHVzIGhhdmUgYSAubGVuZ3RoIGF0dHJpYnV0ZSwgYnV0XG4vLyBpdCdzIG5vdDogc3RvcmluZyBncmlkIHNpemUgaW4gYSBzZXBhcmF0ZSBkYXRhc3RydWN0dXJlIGFsbG93cyB1cyB0byBuZXZlclxuLy8gaGF2ZSB0byBzaHJpbmsgYXJyYXlzLCBhbmQgdG8gbm90IG5lZWQgYWxsb2NhdGlvbnMgaWYgZW5sYXJnaW5nIGFuIGFycmF5XG4vLyB0aGF0IGhhcyBiZWVuIHNocnVuay5cbnR5cGUgR3JpZERpbWVuc2lvbnMgPSB7XG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBoZWlnaHQ6IG51bWJlcixcbn07XG5cbmVudW0gRGFtYWdlS2luZCB7XG4gICAgQ2VsbCxcbiAgICBSZXNpemUsXG4gICAgU2Nyb2xsLFxufVxuXG4vLyBVc2VkIHRvIHRyYWNrIHJlY3RhbmdsZXMgb2YgZGFtYWdlIGRvbmUgdG8gYSBncmlkIGFuZCBvbmx5IHJlcGFpbnQgdGhlXG4vLyBuZWNlc3NhcnkgYml0cy4gVGhlc2UgYXJlIGxvZ2ljIHBvc2l0aW9ucyAoaS5lLiBjZWxscykgLSBub3QgcGl4ZWxzLlxudHlwZSBDZWxsRGFtYWdlID0ge1xuICAgIGtpbmQ6IERhbWFnZUtpbmQsXG4gICAgLy8gVGhlIG51bWJlciBvZiByb3dzIHRoZSBkYW1hZ2Ugc3BhbnNcbiAgICBoOiBudW1iZXIsXG4gICAgLy8gVGhlIG51bWJlciBvZiBjb2x1bW5zIHRoZSBkYW1hZ2Ugc3BhbnNcbiAgICB3OiBudW1iZXIsXG4gICAgLy8gVGhlIGNvbHVtbiB0aGUgZGFtYWdlIGJlZ2lucyBhdFxuICAgIHg6IG51bWJlcixcbiAgICAvLyBUaGUgcm93IHRoZSBkYW1hZ2UgYmVnaW5zIGF0XG4gICAgeTogbnVtYmVyLFxufTtcblxudHlwZSBSZXNpemVEYW1hZ2UgPSB7XG4gICAga2luZDogRGFtYWdlS2luZCxcbiAgICAvLyBUaGUgbmV3IGhlaWdodCBvZiB0aGUgY2FudmFzXG4gICAgaDogbnVtYmVyLFxuICAgIC8vIFRoZSBuZXcgd2lkdGggb2YgdGhlIGNhbnZhc1xuICAgIHc6IG51bWJlcixcbiAgICAvLyBUaGUgcHJldmlvdXMgd2lkdGggb2YgdGhlIGNhbnZhc1xuICAgIHg6IG51bWJlcixcbiAgICAvLyBUaGUgcHJldmlvdXMgaGVpZ2h0IG9mIHRoZSBjYW52YXNcbiAgICB5OiBudW1iZXIsXG59O1xuXG50eXBlIFNjcm9sbERhbWFnZSA9IHtcbiAgICBraW5kOiBEYW1hZ2VLaW5kLFxuICAgIC8vIFRoZSBkaXJlY3Rpb24gb2YgdGhlIHNjcm9sbCwgLTEgbWVhbnMgdXAsIDEgbWVhbnMgZG93blxuICAgIGg6IG51bWJlcixcbiAgICAvLyBUaGUgbnVtYmVyIG9mIGxpbmVzIG9mIHRoZSBzY3JvbGwsIHBvc2l0aXZlIG51bWJlclxuICAgIHc6IG51bWJlcixcbiAgICAvLyBUaGUgdG9wIGxpbmUgb2YgdGhlIHNjcm9sbGluZyByZWdpb24sIGluIGNlbGxzXG4gICAgeDogbnVtYmVyLFxuICAgIC8vIFRoZSBib3R0b20gbGluZSBvZiB0aGUgc2Nyb2xsaW5nIHJlZ2lvbiwgaW4gY2VsbHNcbiAgICB5OiBudW1iZXIsXG59O1xuXG50eXBlIEdyaWREYW1hZ2UgPSBDZWxsRGFtYWdlICYgUmVzaXplRGFtYWdlICYgU2Nyb2xsRGFtYWdlO1xuXG4vLyBUaGUgc3RhdGUgb2YgdGhlIGNvbW1hbmRsaW5lLiBJdCBpcyBvbmx5IHVzZWQgd2hlbiB1c2luZyBuZW92aW0ncyBleHRlcm5hbFxuLy8gY29tbWFuZGxpbmUuXG50eXBlIENvbW1hbmRMaW5lU3RhdGUgPSB7XG4gICAgc3RhdHVzOiBcImhpZGRlblwiIHwgXCJzaG93blwiLFxuICAgIGNvbnRlbnQ6IFthbnksIHN0cmluZ11bXSxcbiAgICBwb3M6IG51bWJlcixcbiAgICBmaXJzdGM6IHN0cmluZyxcbiAgICBwcm9tcHQ6IHN0cmluZyxcbiAgICBpbmRlbnQ6IG51bWJlcixcbiAgICBsZXZlbDogbnVtYmVyXG59O1xuXG50eXBlIEN1cnNvciA9IHtcbiAgICBjdXJyZW50R3JpZDogbnVtYmVyLFxuICAgIGRpc3BsYXk6IGJvb2xlYW4sXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICBsYXN0TW92ZTogRE9NSGlnaFJlc1RpbWVTdGFtcCxcbiAgICBtb3ZlZFNpbmNlTGFzdE1lc3NhZ2U6IGJvb2xlYW4sXG59O1xuXG50eXBlIE1vZGUgPSB7XG4gICAgY3VycmVudDogbnVtYmVyLFxuICAgIHN0eWxlRW5hYmxlZDogYm9vbGVhbixcbiAgICBtb2RlSW5mbzoge1xuICAgICAgICBhdHRyX2lkOiBudW1iZXIsXG4gICAgICAgIGF0dHJfaWRfbG06IG51bWJlcixcbiAgICAgICAgYmxpbmtvZmY6IG51bWJlcixcbiAgICAgICAgYmxpbmtvbjogbnVtYmVyLFxuICAgICAgICBibGlua3dhaXQ6IG51bWJlcixcbiAgICAgICAgY2VsbF9wZXJjZW50YWdlOiBudW1iZXIsXG4gICAgICAgIGN1cnNvcl9zaGFwZTogc3RyaW5nLFxuICAgICAgICBuYW1lOiBOdmltTW9kZSxcbiAgICB9W10sXG59O1xuXG50eXBlIE1lc3NhZ2UgPSBbbnVtYmVyLCBzdHJpbmddW107XG50eXBlIE1lc3NhZ2VzUG9zaXRpb24gPSB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XG5cbnR5cGUgU3RhdGUgPSB7XG4gICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCxcbiAgICBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgY29tbWFuZExpbmUgOiBDb21tYW5kTGluZVN0YXRlLFxuICAgIGN1cnNvcjogQ3Vyc29yLFxuICAgIGdyaWRDaGFyYWN0ZXJzOiBzdHJpbmdbXVtdW10sXG4gICAgZ3JpZERhbWFnZXM6IEdyaWREYW1hZ2VbXVtdLFxuICAgIGdyaWREYW1hZ2VzQ291bnQ6IG51bWJlcltdLFxuICAgIGdyaWRIaWdobGlnaHRzOiBudW1iZXJbXVtdW10sXG4gICAgZ3JpZFNpemVzOiBHcmlkRGltZW5zaW9uc1tdLFxuICAgIGhpZ2hsaWdodHM6IEhpZ2hsaWdodEluZm9bXSxcbiAgICBsYXN0TWVzc2FnZTogRE9NSGlnaFJlc1RpbWVTdGFtcCxcbiAgICBsaW5lc3BhY2U6IG51bWJlcixcbiAgICBtZXNzYWdlczogTWVzc2FnZVtdLFxuICAgIG1lc3NhZ2VzUG9zaXRpb25zOiBNZXNzYWdlc1Bvc2l0aW9uW10sXG4gICAgbW9kZTogTW9kZSxcbiAgICBydWxlcjogTWVzc2FnZSxcbiAgICBzaG93Y21kOiBNZXNzYWdlLFxuICAgIHNob3dtb2RlOiBNZXNzYWdlLFxufTtcblxuY29uc3QgZ2xvYmFsU3RhdGU6IFN0YXRlID0ge1xuICAgIGNhbnZhczogdW5kZWZpbmVkLFxuICAgIGNvbnRleHQ6IHVuZGVmaW5lZCxcbiAgICBjb21tYW5kTGluZToge1xuICAgICAgICBzdGF0dXM6IFwiaGlkZGVuXCIsXG4gICAgICAgIGNvbnRlbnQ6IFtdLFxuICAgICAgICBwb3M6IDAsXG4gICAgICAgIGZpcnN0YzogXCJcIixcbiAgICAgICAgcHJvbXB0OiBcIlwiLFxuICAgICAgICBpbmRlbnQ6IDAsXG4gICAgICAgIGxldmVsOiAwLFxuICAgIH0sXG4gICAgY3Vyc29yOiB7XG4gICAgICAgIGN1cnJlbnRHcmlkOiAxLFxuICAgICAgICBkaXNwbGF5OiB0cnVlLFxuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwLFxuICAgICAgICBsYXN0TW92ZTogcGVyZm9ybWFuY2Uubm93KCksXG4gICAgICAgIG1vdmVkU2luY2VMYXN0TWVzc2FnZTogZmFsc2UsXG4gICAgfSxcbiAgICBncmlkQ2hhcmFjdGVyczogW10sXG4gICAgZ3JpZERhbWFnZXM6IFtdLFxuICAgIGdyaWREYW1hZ2VzQ291bnQ6IFtdLFxuICAgIGdyaWRIaWdobGlnaHRzOiBbXSxcbiAgICBncmlkU2l6ZXM6IFtdLFxuICAgIGhpZ2hsaWdodHM6IFtuZXdIaWdobGlnaHQoZGVmYXVsdEJhY2tncm91bmQsIGRlZmF1bHRGb3JlZ3JvdW5kKV0sXG4gICAgbGFzdE1lc3NhZ2U6IHBlcmZvcm1hbmNlLm5vdygpLFxuICAgIGxpbmVzcGFjZTogMCxcbiAgICBtZXNzYWdlczogW10sXG4gICAgbWVzc2FnZXNQb3NpdGlvbnM6IFtdLFxuICAgIG1vZGU6IHtcbiAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgc3R5bGVFbmFibGVkIDogZmFsc2UsXG4gICAgICAgIG1vZGVJbmZvOiBbe1xuICAgICAgICAgICAgYXR0cl9pZDogMCxcbiAgICAgICAgICAgIGF0dHJfaWRfbG06IDAsXG4gICAgICAgICAgICBibGlua29mZjogMCxcbiAgICAgICAgICAgIGJsaW5rb246IDAsXG4gICAgICAgICAgICBibGlua3dhaXQ6IDAsXG4gICAgICAgICAgICBjZWxsX3BlcmNlbnRhZ2U6IDAsXG4gICAgICAgICAgICBjdXJzb3Jfc2hhcGU6IFwiYmxvY2tcIixcbiAgICAgICAgICAgIG5hbWU6IFwibm9ybWFsXCIsXG4gICAgICAgIH1dXG4gICAgfSxcbiAgICBydWxlcjogdW5kZWZpbmVkLFxuICAgIHNob3djbWQ6IHVuZGVmaW5lZCxcbiAgICBzaG93bW9kZTogdW5kZWZpbmVkLFxufTtcblxuZnVuY3Rpb24gcHVzaERhbWFnZShncmlkOiBudW1iZXIsIGtpbmQ6IERhbWFnZUtpbmQsIGg6IG51bWJlciwgdzogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIGNvbnN0IGRhbWFnZXMgPSBnbG9iYWxTdGF0ZS5ncmlkRGFtYWdlc1tncmlkXTtcbiAgICBjb25zdCBjb3VudCA9IGdsb2JhbFN0YXRlLmdyaWREYW1hZ2VzQ291bnRbZ3JpZF07XG4gICAgaWYgKGRhbWFnZXMubGVuZ3RoID09PSBjb3VudCkge1xuICAgICAgICBkYW1hZ2VzLnB1c2goeyBraW5kLCBoLCB3LCB4LCB5IH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRhbWFnZXNbY291bnRdLmtpbmQgPSBraW5kO1xuICAgICAgICBkYW1hZ2VzW2NvdW50XS5oID0gaDtcbiAgICAgICAgZGFtYWdlc1tjb3VudF0udyA9IHc7XG4gICAgICAgIGRhbWFnZXNbY291bnRdLnggPSB4O1xuICAgICAgICBkYW1hZ2VzW2NvdW50XS55ID0geTtcbiAgICB9XG4gICAgZ2xvYmFsU3RhdGUuZ3JpZERhbWFnZXNDb3VudFtncmlkXSA9IGNvdW50ICsgMTtcbn1cblxubGV0IG1heENlbGxXaWR0aDogbnVtYmVyO1xubGV0IG1heENlbGxIZWlnaHQ6IG51bWJlcjtcbmxldCBtYXhCYXNlbGluZURpc3RhbmNlOiBudW1iZXI7XG5mdW5jdGlvbiByZWNvbXB1dGVDaGFyU2l6ZSAoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICAvLyA5NCwgSyszMjogd2UgaWdub3JlIHRoZSBmaXJzdCAzMiBhc2NpaSBjaGFycyBiZWNhdXNlIHRoZXkncmUgbm9uLXByaW50YWJsZVxuICAgIGNvbnN0IGNoYXJzID0gbmV3IEFycmF5KDk0KVxuICAgICAgICAuZmlsbCgwKVxuICAgICAgICAubWFwKChfLCBrKSA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKGsgKyAzMikpXG4gICAgICAgIC8vIENvbmNhdGVuaW5nIMOCIGJlY2F1c2UgdGhhdCdzIHRoZSB0YWxsZXN0IGNoYXJhY3RlciBJIGNhbiB0aGluayBvZi5cbiAgICAgICAgLmNvbmNhdChbXCLDglwiXSk7XG4gICAgbGV0IHdpZHRoID0gMDtcbiAgICBsZXQgaGVpZ2h0ID0gMDtcbiAgICBsZXQgYmFzZWxpbmUgPSAwO1xuICAgIGxldCBtZWFzdXJlOiBUZXh0TWV0cmljcztcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcbiAgICAgICAgbWVhc3VyZSA9IGN0eC5tZWFzdXJlVGV4dChjaGFyKTtcbiAgICAgICAgaWYgKG1lYXN1cmUud2lkdGggPiB3aWR0aCkge1xuICAgICAgICAgICAgd2lkdGggPSBtZWFzdXJlLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0bXAgPSBNYXRoLmFicyhtZWFzdXJlLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50KTtcbiAgICAgICAgaWYgKHRtcCA+IGJhc2VsaW5lKSB7XG4gICAgICAgICAgICBiYXNlbGluZSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICB0bXAgKz0gTWF0aC5hYnMobWVhc3VyZS5hY3R1YWxCb3VuZGluZ0JveERlc2NlbnQpO1xuICAgICAgICBpZiAodG1wID4gaGVpZ2h0KSB7XG4gICAgICAgICAgICBoZWlnaHQgPSB0bXA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbWF4Q2VsbFdpZHRoID0gTWF0aC5jZWlsKHdpZHRoKTtcbiAgICBtYXhDZWxsSGVpZ2h0ID0gTWF0aC5jZWlsKGhlaWdodCkgKyBnbG9iYWxTdGF0ZS5saW5lc3BhY2U7XG4gICAgbWF4QmFzZWxpbmVEaXN0YW5jZSA9IGJhc2VsaW5lO1xuICAgIG1ldHJpY3NJbnZhbGlkYXRlZCA9IGZhbHNlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldEdseXBoSW5mbyAoc3RhdGU6IFN0YXRlKSB7XG4gICAgaWYgKG1ldHJpY3NJbnZhbGlkYXRlZFxuICAgICAgICB8fCBtYXhDZWxsV2lkdGggPT09IHVuZGVmaW5lZFxuICAgICAgICB8fCBtYXhDZWxsSGVpZ2h0ID09PSB1bmRlZmluZWRcbiAgICAgICAgfHwgbWF4QmFzZWxpbmVEaXN0YW5jZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlY29tcHV0ZUNoYXJTaXplKHN0YXRlLmNvbnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gW21heENlbGxXaWR0aCwgbWF4Q2VsbEhlaWdodCwgbWF4QmFzZWxpbmVEaXN0YW5jZV07XG59XG5mdW5jdGlvbiBtZWFzdXJlV2lkdGgoc3RhdGU6IFN0YXRlLCBjaGFyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjaGFyV2lkdGggPSBnZXRHbHlwaEluZm8oc3RhdGUpWzBdO1xuICAgIHJldHVybiBNYXRoLmNlaWwoc3RhdGUuY29udGV4dC5tZWFzdXJlVGV4dChjaGFyKS53aWR0aCAvIGNoYXJXaWR0aCkgKiBjaGFyV2lkdGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2dpY2FsU2l6ZSgpIHtcbiAgICBjb25zdCBzdGF0ZSA9IGdsb2JhbFN0YXRlO1xuICAgIGNvbnN0IFtjZWxsV2lkdGgsIGNlbGxIZWlnaHRdID0gZ2V0R2x5cGhJbmZvKHN0YXRlKTtcbiAgICByZXR1cm4gW01hdGguZmxvb3Ioc3RhdGUuY2FudmFzLndpZHRoIC8gY2VsbFdpZHRoKSwgTWF0aC5mbG9vcihzdGF0ZS5jYW52YXMuaGVpZ2h0IC8gY2VsbEhlaWdodCldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZUdyaWREaW1lbnNpb25zRm9yICh3aWR0aCA6IG51bWJlciwgaGVpZ2h0IDogbnVtYmVyKSB7XG4gICAgY29uc3QgW2NlbGxXaWR0aCwgY2VsbEhlaWdodF0gPSBnZXRHbHlwaEluZm8oZ2xvYmFsU3RhdGUpO1xuICAgIHJldHVybiBbTWF0aC5mbG9vcih3aWR0aCAvIGNlbGxXaWR0aCksIE1hdGguZmxvb3IoaGVpZ2h0IC8gY2VsbEhlaWdodCldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3JpZENvb3JkaW5hdGVzICh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIGNvbnN0IFtjZWxsV2lkdGgsIGNlbGxIZWlnaHRdID0gZ2V0R2x5cGhJbmZvKGdsb2JhbFN0YXRlKTtcbiAgICByZXR1cm4gW01hdGguZmxvb3IoeCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIC8gY2VsbFdpZHRoKSwgTWF0aC5mbG9vcih5ICogd2luZG93LmRldmljZVBpeGVsUmF0aW8gLyBjZWxsSGVpZ2h0KV07XG59XG5cbmZ1bmN0aW9uIG5ld0hpZ2hsaWdodCAoYmc6IHN0cmluZywgZmc6IHN0cmluZyk6IEhpZ2hsaWdodEluZm8ge1xuICAgIHJldHVybiB7XG4gICAgICAgIGJhY2tncm91bmQ6IGJnLFxuICAgICAgICBib2xkOiB1bmRlZmluZWQsXG4gICAgICAgIGJsZW5kOiB1bmRlZmluZWQsXG4gICAgICAgIGZvcmVncm91bmQ6IGZnLFxuICAgICAgICBpdGFsaWM6IHVuZGVmaW5lZCxcbiAgICAgICAgcmV2ZXJzZTogdW5kZWZpbmVkLFxuICAgICAgICBzcGVjaWFsOiB1bmRlZmluZWQsXG4gICAgICAgIHN0cmlrZXRocm91Z2g6IHVuZGVmaW5lZCxcbiAgICAgICAgdW5kZXJjdXJsOiB1bmRlZmluZWQsXG4gICAgICAgIHVuZGVybGluZTogdW5kZWZpbmVkLFxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHcmlkSWQoKSB7XG4gICAgcmV0dXJuIDE7XG59XG5cbmZ1bmN0aW9uIGdldENvbW1hbmRMaW5lUmVjdCAoc3RhdGU6IFN0YXRlKSB7XG4gICAgY29uc3QgW3dpZHRoLCBoZWlnaHRdID0gZ2V0R2x5cGhJbmZvKHN0YXRlKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB4OiB3aWR0aCAtIDEsXG4gICAgICAgIHk6ICgoc3RhdGUuY2FudmFzLmhlaWdodCAtIGhlaWdodCAtIDEpIC8gMiksXG4gICAgICAgIHdpZHRoOiAoc3RhdGUuY2FudmFzLndpZHRoIC0gKHdpZHRoICogMikpICsgMixcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQgKyAyLFxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGRhbWFnZUNvbW1hbmRMaW5lU3BhY2UgKHN0YXRlOiBTdGF0ZSkge1xuICAgIGNvbnN0IFt3aWR0aCwgaGVpZ2h0XSA9IGdldEdseXBoSW5mbyhzdGF0ZSk7XG4gICAgY29uc3QgcmVjdCA9IGdldENvbW1hbmRMaW5lUmVjdChzdGF0ZSk7XG4gICAgY29uc3QgZ2lkID0gZ2V0R3JpZElkKCk7XG4gICAgY29uc3QgZGltZW5zaW9ucyA9IGdsb2JhbFN0YXRlLmdyaWRTaXplc1tnaWRdO1xuICAgIHB1c2hEYW1hZ2UoZ2lkLFxuICAgICAgICAgICAgICAgRGFtYWdlS2luZC5DZWxsLFxuICAgICAgICAgICAgICAgTWF0aC5taW4oTWF0aC5jZWlsKHJlY3QuaGVpZ2h0IC8gaGVpZ2h0KSArIDEsIGRpbWVuc2lvbnMuaGVpZ2h0KSxcbiAgICAgICAgICAgICAgIE1hdGgubWluKE1hdGguY2VpbChyZWN0LndpZHRoIC8gd2lkdGgpICsgMSwgZGltZW5zaW9ucy53aWR0aCksXG4gICAgICAgICAgICAgICBNYXRoLm1heChNYXRoLmZsb29yKHJlY3QueCAvIHdpZHRoKSwgMCksXG4gICAgICAgICAgICAgICBNYXRoLm1heChNYXRoLmZsb29yKHJlY3QueSAvIGhlaWdodCksIDApKTtcbn1cblxuZnVuY3Rpb24gZGFtYWdlTWVzc2FnZXNTcGFjZSAoc3RhdGU6IFN0YXRlKSB7XG4gICAgY29uc3QgZ0lkID0gZ2V0R3JpZElkKCk7XG4gICAgY29uc3QgbXNnUG9zID0gZ2xvYmFsU3RhdGUubWVzc2FnZXNQb3NpdGlvbnNbZ0lkXTtcbiAgICBjb25zdCBkaW1lbnNpb25zID0gZ2xvYmFsU3RhdGUuZ3JpZFNpemVzW2dJZF07XG4gICAgY29uc3QgW2NoYXJXaWR0aCwgY2hhckhlaWdodF0gPSBnZXRHbHlwaEluZm8oc3RhdGUpO1xuICAgIHB1c2hEYW1hZ2UoZ0lkLFxuICAgICAgICAgICAgICAgRGFtYWdlS2luZC5DZWxsLFxuICAgICAgICAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgICAgICAgICAgTWF0aC5jZWlsKChzdGF0ZS5jYW52YXMuaGVpZ2h0IC0gbXNnUG9zLnkpIC8gY2hhckhlaWdodCkgKyAyLFxuICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbnMuaGVpZ2h0KSxcbiAgICAgICAgICAgICAgIE1hdGgubWluKFxuICAgICAgICAgICAgICAgICAgIE1hdGguY2VpbCgoc3RhdGUuY2FudmFzLndpZHRoIC0gbXNnUG9zLngpIC8gY2hhcldpZHRoKSArIDIsXG4gICAgICAgICAgICAgICAgICAgZGltZW5zaW9ucy53aWR0aCksXG4gICAgICAgICAgICAgICBNYXRoLm1heChNYXRoLmZsb29yKG1zZ1Bvcy54IC8gY2hhcldpZHRoKSAtIDEsIDApLFxuICAgICAgICAgICAgICAgTWF0aC5tYXgoTWF0aC5mbG9vcihtc2dQb3MueSAvIGNoYXJIZWlnaHQpIC0gMSwgMCkpO1xuICAgIG1zZ1Bvcy54ID0gc3RhdGUuY2FudmFzLndpZHRoO1xuICAgIG1zZ1Bvcy55ID0gc3RhdGUuY2FudmFzLmhlaWdodDtcbn1cblxuY29uc3QgaGFuZGxlcnMgOiB7IFtrZXk6c3RyaW5nXSA6ICguLi5hcmdzOiBhbnlbXSk9PnZvaWQgfSA9IHtcbiAgICBidXN5X3N0YXJ0OiAoKSA9PiB7XG4gICAgICAgIHB1c2hEYW1hZ2UoZ2V0R3JpZElkKCksIERhbWFnZUtpbmQuQ2VsbCwgMSwgMSwgZ2xvYmFsU3RhdGUuY3Vyc29yLngsIGdsb2JhbFN0YXRlLmN1cnNvci55KTtcbiAgICAgICAgZ2xvYmFsU3RhdGUuY3Vyc29yLmRpc3BsYXkgPSBmYWxzZTtcbiAgICB9LFxuICAgIGJ1c3lfc3RvcDogKCkgPT4geyBnbG9iYWxTdGF0ZS5jdXJzb3IuZGlzcGxheSA9IHRydWU7IH0sXG4gICAgY21kbGluZV9oaWRlOiAoKSA9PiB7XG4gICAgICAgIGdsb2JhbFN0YXRlLmNvbW1hbmRMaW5lLnN0YXR1cyA9IFwiaGlkZGVuXCI7XG4gICAgICAgIGRhbWFnZUNvbW1hbmRMaW5lU3BhY2UoZ2xvYmFsU3RhdGUpO1xuICAgIH0sXG4gICAgY21kbGluZV9wb3M6IChwb3M6IG51bWJlciwgbGV2ZWw6IG51bWJlcikgPT4ge1xuICAgICAgICBnbG9iYWxTdGF0ZS5jb21tYW5kTGluZS5wb3MgPSBwb3M7XG4gICAgICAgIGdsb2JhbFN0YXRlLmNvbW1hbmRMaW5lLmxldmVsID0gbGV2ZWw7XG4gICAgfSxcbiAgICBjbWRsaW5lX3Nob3c6XG4gICAgICAgIChjb250ZW50OiBbYW55LCBzdHJpbmddW10sXG4gICAgICAgICBwb3M6IG51bWJlcixcbiAgICAgICAgIGZpcnN0Yzogc3RyaW5nLFxuICAgICAgICAgcHJvbXB0OiBzdHJpbmcsXG4gICAgICAgICBpbmRlbnQ6IG51bWJlcixcbiAgICAgICAgIGxldmVsOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICBnbG9iYWxTdGF0ZS5jb21tYW5kTGluZS5zdGF0dXMgPSBcInNob3duXCI7XG4gICAgICAgICAgICAgZ2xvYmFsU3RhdGUuY29tbWFuZExpbmUuY29udGVudCA9IGNvbnRlbnQ7XG4gICAgICAgICAgICAgZ2xvYmFsU3RhdGUuY29tbWFuZExpbmUucG9zID0gcG9zO1xuICAgICAgICAgICAgIGdsb2JhbFN0YXRlLmNvbW1hbmRMaW5lLmZpcnN0YyA9IGZpcnN0YztcbiAgICAgICAgICAgICBnbG9iYWxTdGF0ZS5jb21tYW5kTGluZS5wcm9tcHQgPSBwcm9tcHQ7XG4gICAgICAgICAgICAgZ2xvYmFsU3RhdGUuY29tbWFuZExpbmUuaW5kZW50ID0gaW5kZW50O1xuICAgICAgICAgICAgIGdsb2JhbFN0YXRlLmNvbW1hbmRMaW5lLmxldmVsID0gbGV2ZWw7XG4gICAgICAgICB9LFxuICAgIGRlZmF1bHRfY29sb3JzX3NldDogKGZnOiBudW1iZXIsIGJnOiBudW1iZXIsIHNwOiBudW1iZXIpID0+IHtcbiAgICAgICAgaWYgKGZnICE9PSB1bmRlZmluZWQgJiYgZmcgIT09IC0xKSB7XG4gICAgICAgICAgICBnbG9iYWxTdGF0ZS5oaWdobGlnaHRzWzBdLmZvcmVncm91bmQgPSB0b0hleENzcyhmZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJnICE9PSB1bmRlZmluZWQgJiYgYmcgIT09IC0xKSB7XG4gICAgICAgICAgICBnbG9iYWxTdGF0ZS5oaWdobGlnaHRzWzBdLmJhY2tncm91bmQgPSB0b0hleENzcyhiZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNwICE9PSB1bmRlZmluZWQgJiYgc3AgIT09IC0xKSB7XG4gICAgICAgICAgICBnbG9iYWxTdGF0ZS5oaWdobGlnaHRzWzBdLnNwZWNpYWwgPSB0b0hleENzcyhzcCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY3VyR3JpZFNpemUgPSBnbG9iYWxTdGF0ZS5ncmlkU2l6ZXNbZ2V0R3JpZElkKCldO1xuICAgICAgICBpZiAoY3VyR3JpZFNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcHVzaERhbWFnZShnZXRHcmlkSWQoKSwgRGFtYWdlS2luZC5DZWxsLCBjdXJHcmlkU2l6ZS5oZWlnaHQsIGN1ckdyaWRTaXplLndpZHRoLCAwLCAwKTtcbiAgICAgICAgfVxuICAgICAgICB3aXBlR2x5cGhDYWNoZSgpO1xuICAgIH0sXG4gICAgZmx1c2g6ICgpID0+IHtcbiAgICAgICAgc2NoZWR1bGVGcmFtZSgpO1xuICAgIH0sXG4gICAgZ3JpZF9jbGVhcjogKGlkOiBudW1iZXIpID0+IHtcbiAgICAgICAgLy8gZ2xhY2FtYnJlOiBXaGF0IHNob3VsZCBhY3R1YWxseSBoYXBwZW4gb24gZ3JpZF9jbGVhcj8gVGhlXG4gICAgICAgIC8vICAgICAgICAgICAgZG9jdW1lbnRhdGlvbiBzYXlzIFwiY2xlYXIgdGhlIGdyaWRcIiwgYnV0IHdoYXQgZG9lcyB0aGF0XG4gICAgICAgIC8vICAgICAgICAgICAgbWVhbj8gSSBndWVzcyB0aGUgY2hhcmFjdGVycyBzaG91bGQgYmUgcmVtb3ZlZCwgYnV0IHdoYXRcbiAgICAgICAgLy8gICAgICAgICAgICBhYm91dCB0aGUgaGlnaGxpZ2h0cz8gQXJlIHRoZXJlIG90aGVyIHRoaW5ncyB0aGF0IG5lZWQgdG9cbiAgICAgICAgLy8gICAgICAgICAgICBiZSBjbGVhcmVkP1xuICAgICAgICAvLyBiZnJlZGw6IHRvIGRlZmF1bHQgYmcgY29sb3JcbiAgICAgICAgLy8gICAgICAgICBncmlkX2NsZWFyIGlzIG5vdCBtZWFudCB0byBiZSB1c2VkIG9mdGVuXG4gICAgICAgIC8vICAgICAgICAgaXQgaXMgbW9yZSBcInRoZSB0ZXJtaW5hbCBnb3Qgc2NyZXdlZCB1cCwgYmV0dGVyIHRvIGJlIHNhZmVcbiAgICAgICAgLy8gICAgICAgICB0aGFuIHNvcnJ5XCJcbiAgICAgICAgY29uc3QgY2hhckdyaWQgPSBnbG9iYWxTdGF0ZS5ncmlkQ2hhcmFjdGVyc1tpZF07XG4gICAgICAgIGNvbnN0IGhpZ2hHcmlkID0gZ2xvYmFsU3RhdGUuZ3JpZEhpZ2hsaWdodHNbaWRdO1xuICAgICAgICBjb25zdCBkaW1zID0gZ2xvYmFsU3RhdGUuZ3JpZFNpemVzW2lkXTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBkaW1zLmhlaWdodDsgKytqKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpbXMud2lkdGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGNoYXJHcmlkW2pdW2ldID0gXCIgXCI7XG4gICAgICAgICAgICAgICAgaGlnaEdyaWRbal1baV0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHB1c2hEYW1hZ2UoaWQsIERhbWFnZUtpbmQuQ2VsbCwgZGltcy5oZWlnaHQsIGRpbXMud2lkdGgsIDAsIDApO1xuICAgIH0sXG4gICAgZ3JpZF9jdXJzb3JfZ290bzogKGlkOiBudW1iZXIsIHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCBjdXJzb3IgPSBnbG9iYWxTdGF0ZS5jdXJzb3I7XG4gICAgICAgIHB1c2hEYW1hZ2UoZ2V0R3JpZElkKCksIERhbWFnZUtpbmQuQ2VsbCwgMSwgMSwgY3Vyc29yLngsIGN1cnNvci55KTtcbiAgICAgICAgY3Vyc29yLmN1cnJlbnRHcmlkID0gaWQ7XG4gICAgICAgIGN1cnNvci54ID0gY29sdW1uO1xuICAgICAgICBjdXJzb3IueSA9IHJvdztcbiAgICAgICAgY3Vyc29yLmxhc3RNb3ZlID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIGN1cnNvci5tb3ZlZFNpbmNlTGFzdE1lc3NhZ2UgPSB0cnVlO1xuICAgIH0sXG4gICAgZ3JpZF9saW5lOiAoaWQ6IG51bWJlciwgcm93OiBudW1iZXIsIGNvbDogbnVtYmVyLCBjaGFuZ2VzOiAgYW55W10pID0+IHtcbiAgICAgICAgY29uc3QgY2hhckdyaWQgPSBnbG9iYWxTdGF0ZS5ncmlkQ2hhcmFjdGVyc1tpZF07XG4gICAgICAgIGNvbnN0IGhpZ2hsaWdodHMgPSBnbG9iYWxTdGF0ZS5ncmlkSGlnaGxpZ2h0c1tpZF07XG4gICAgICAgIGxldCBwcmV2Q29sID0gY29sO1xuICAgICAgICBsZXQgaGlnaCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhbmdlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlID0gY2hhbmdlc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IGNoYXJhID0gY2hhbmdlWzBdO1xuICAgICAgICAgICAgaWYgKGNoYW5nZVsxXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaGlnaCA9IGNoYW5nZVsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJlcGVhdCA9IGNoYW5nZVsyXSA9PT0gdW5kZWZpbmVkID8gMSA6IGNoYW5nZVsyXTtcblxuICAgICAgICAgICAgcHVzaERhbWFnZShpZCwgRGFtYWdlS2luZC5DZWxsLCAxLCByZXBlYXQsIHByZXZDb2wsIHJvdyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gcHJldkNvbCArIHJlcGVhdDtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBwcmV2Q29sOyBqIDwgbGltaXQ7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgIGNoYXJHcmlkW3Jvd11bal0gPSBjaGFyYTtcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRzW3Jvd11bal0gPSBoaWdoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJldkNvbCA9IGxpbWl0O1xuICAgICAgICB9XG4gICAgfSxcbiAgICBncmlkX3Jlc2l6ZTogKGlkOiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gZ2xvYmFsU3RhdGU7XG4gICAgICAgIGNvbnN0IGNyZWF0ZUdyaWQgPSBzdGF0ZS5ncmlkQ2hhcmFjdGVyc1tpZF0gPT09IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGNyZWF0ZUdyaWQpIHtcbiAgICAgICAgICAgIHN0YXRlLmdyaWRDaGFyYWN0ZXJzW2lkXSA9IFtdO1xuICAgICAgICAgICAgc3RhdGUuZ3JpZENoYXJhY3RlcnNbaWRdLnB1c2goW10pO1xuICAgICAgICAgICAgc3RhdGUuZ3JpZFNpemVzW2lkXSA9IHsgd2lkdGg6IDAsIGhlaWdodDogMCB9O1xuICAgICAgICAgICAgc3RhdGUuZ3JpZERhbWFnZXNbaWRdID0gW107XG4gICAgICAgICAgICBzdGF0ZS5ncmlkRGFtYWdlc0NvdW50W2lkXSA9IDA7XG4gICAgICAgICAgICBzdGF0ZS5ncmlkSGlnaGxpZ2h0c1tpZF0gPSBbXTtcbiAgICAgICAgICAgIHN0YXRlLmdyaWRIaWdobGlnaHRzW2lkXS5wdXNoKFtdKTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2VzUG9zaXRpb25zW2lkXSA9IHtcbiAgICAgICAgICAgICAgICB4OiBzdGF0ZS5jYW52YXMud2lkdGgsXG4gICAgICAgICAgICAgICAgeTogc3RhdGUuY2FudmFzLmhlaWdodCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJHcmlkU2l6ZSA9IGdsb2JhbFN0YXRlLmdyaWRTaXplc1tpZF07XG5cbiAgICAgICAgcHVzaERhbWFnZShpZCwgRGFtYWdlS2luZC5SZXNpemUsIGhlaWdodCwgd2lkdGgsIGN1ckdyaWRTaXplLndpZHRoLCBjdXJHcmlkU2l6ZS5oZWlnaHQpO1xuXG4gICAgICAgIGNvbnN0IGhpZ2hsaWdodHMgPSBnbG9iYWxTdGF0ZS5ncmlkSGlnaGxpZ2h0c1tpZF07XG4gICAgICAgIGNvbnN0IGNoYXJHcmlkID0gZ2xvYmFsU3RhdGUuZ3JpZENoYXJhY3RlcnNbaWRdO1xuICAgICAgICBpZiAod2lkdGggPiBjaGFyR3JpZFswXS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhckdyaWQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByb3cgPSBjaGFyR3JpZFtpXTtcbiAgICAgICAgICAgICAgICBjb25zdCBoaWdocyA9IGhpZ2hsaWdodHNbaV07XG4gICAgICAgICAgICAgICAgd2hpbGUgKHJvdy5sZW5ndGggPCB3aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICByb3cucHVzaChcIiBcIik7XG4gICAgICAgICAgICAgICAgICAgIGhpZ2hzLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChoZWlnaHQgPiBjaGFyR3JpZC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHdoaWxlIChjaGFyR3JpZC5sZW5ndGggPCBoZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBjaGFyR3JpZC5wdXNoKChuZXcgQXJyYXkod2lkdGgpKS5maWxsKFwiIFwiKSk7XG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0cy5wdXNoKChuZXcgQXJyYXkod2lkdGgpKS5maWxsKDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwdXNoRGFtYWdlKGlkLCBEYW1hZ2VLaW5kLkNlbGwsIDAsIHdpZHRoLCAwLCBjdXJHcmlkU2l6ZS5oZWlnaHQpO1xuICAgICAgICBjdXJHcmlkU2l6ZS53aWR0aCA9IHdpZHRoO1xuICAgICAgICBjdXJHcmlkU2l6ZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgfSxcbiAgICBncmlkX3Njcm9sbDogKGlkOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICB0b3A6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgIGJvdDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgbGVmdDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcmlnaHQ6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgIHJvd3M6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgIF9jb2xzOiBudW1iZXIpID0+IHtcbiAgICAgICAgY29uc3QgZGltZW5zaW9ucyA9IGdsb2JhbFN0YXRlLmdyaWRTaXplc1tpZF07XG4gICAgICAgIGNvbnN0IGNoYXJHcmlkID0gZ2xvYmFsU3RhdGUuZ3JpZENoYXJhY3RlcnNbaWRdO1xuICAgICAgICBjb25zdCBoaWdoR3JpZCA9IGdsb2JhbFN0YXRlLmdyaWRIaWdobGlnaHRzW2lkXTtcbiAgICAgICAgaWYgKHJvd3MgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBib3R0b20gPSAoYm90ICsgcm93cykgPj0gZGltZW5zaW9ucy5oZWlnaHRcbiAgICAgICAgICAgICAgICA/IGRpbWVuc2lvbnMuaGVpZ2h0IC0gcm93c1xuICAgICAgICAgICAgICAgIDogYm90O1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IHRvcDsgeSA8IGJvdHRvbTsgKyt5KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3JjQ2hhcnMgPSBjaGFyR3JpZFt5ICsgcm93c107XG4gICAgICAgICAgICAgICAgY29uc3QgZHN0Q2hhcnMgPSBjaGFyR3JpZFt5XTtcbiAgICAgICAgICAgICAgICBjb25zdCBzcmNIaWdocyA9IGhpZ2hHcmlkW3kgKyByb3dzXTtcbiAgICAgICAgICAgICAgICBjb25zdCBkc3RIaWdocyA9IGhpZ2hHcmlkW3ldO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSBsZWZ0OyB4IDwgcmlnaHQ7ICsreCkge1xuICAgICAgICAgICAgICAgICAgICBkc3RDaGFyc1t4XSA9IHNyY0NoYXJzW3hdO1xuICAgICAgICAgICAgICAgICAgICBkc3RIaWdoc1t4XSA9IHNyY0hpZ2hzW3hdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHB1c2hEYW1hZ2UoaWQsIERhbWFnZUtpbmQuQ2VsbCwgZGltZW5zaW9ucy5oZWlnaHQsIGRpbWVuc2lvbnMud2lkdGgsIDAsIDApO1xuICAgICAgICB9IGVsc2UgaWYgKHJvd3MgPCAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gYm90IC0gMTsgeSA+PSB0b3AgJiYgKHkgKyByb3dzKSA+PSAwOyAtLXkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzcmNDaGFycyA9IGNoYXJHcmlkW3kgKyByb3dzXTtcbiAgICAgICAgICAgICAgICBjb25zdCBkc3RDaGFycyA9IGNoYXJHcmlkW3ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNyY0hpZ2hzID0gaGlnaEdyaWRbeSArIHJvd3NdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRzdEhpZ2hzID0gaGlnaEdyaWRbeV07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IGxlZnQ7IHggPCByaWdodDsgKyt4KSB7XG4gICAgICAgICAgICAgICAgICAgIGRzdENoYXJzW3hdID0gc3JjQ2hhcnNbeF07XG4gICAgICAgICAgICAgICAgICAgIGRzdEhpZ2hzW3hdID0gc3JjSGlnaHNbeF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHVzaERhbWFnZShpZCwgRGFtYWdlS2luZC5DZWxsLCBkaW1lbnNpb25zLmhlaWdodCwgZGltZW5zaW9ucy53aWR0aCwgMCwgMCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGhsX2F0dHJfZGVmaW5lOiAoaWQ6IG51bWJlciwgcmdiQXR0cjogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IGhpZ2hsaWdodHMgPSBnbG9iYWxTdGF0ZS5oaWdobGlnaHRzO1xuICAgICAgICBpZiAoaGlnaGxpZ2h0c1tpZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaGlnaGxpZ2h0c1tpZF0gPSBuZXdIaWdobGlnaHQodW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgICAgIGhpZ2hsaWdodHNbaWRdLmZvcmVncm91bmQgPSB0b0hleENzcyhyZ2JBdHRyLmZvcmVncm91bmQpO1xuICAgICAgICBoaWdobGlnaHRzW2lkXS5iYWNrZ3JvdW5kID0gdG9IZXhDc3MocmdiQXR0ci5iYWNrZ3JvdW5kKTtcbiAgICAgICAgaGlnaGxpZ2h0c1tpZF0uYm9sZCA9IHJnYkF0dHIuYm9sZDtcbiAgICAgICAgaGlnaGxpZ2h0c1tpZF0uYmxlbmQgPSByZ2JBdHRyLmJsZW5kO1xuICAgICAgICBoaWdobGlnaHRzW2lkXS5pdGFsaWMgPSByZ2JBdHRyLml0YWxpYztcbiAgICAgICAgaGlnaGxpZ2h0c1tpZF0uc3BlY2lhbCA9IHRvSGV4Q3NzKHJnYkF0dHIuc3BlY2lhbCk7XG4gICAgICAgIGhpZ2hsaWdodHNbaWRdLnN0cmlrZXRocm91Z2ggPSByZ2JBdHRyLnN0cmlrZXRocm91Z2g7XG4gICAgICAgIGhpZ2hsaWdodHNbaWRdLnVuZGVyY3VybCA9IHJnYkF0dHIudW5kZXJjdXJsO1xuICAgICAgICBoaWdobGlnaHRzW2lkXS51bmRlcmxpbmUgPSByZ2JBdHRyLnVuZGVybGluZTtcbiAgICAgICAgaGlnaGxpZ2h0c1tpZF0ucmV2ZXJzZSA9IHJnYkF0dHIucmV2ZXJzZTtcbiAgICB9LFxuICAgIG1vZGVfY2hhbmdlOiAoXzogc3RyaW5nLCBtb2RlSWR4OiBudW1iZXIpID0+IHtcbiAgICAgICAgZ2xvYmFsU3RhdGUubW9kZS5jdXJyZW50ID0gbW9kZUlkeDtcbiAgICAgICAgZXZlbnRzLmVtaXQoXCJtb2RlQ2hhbmdlXCIsIGdsb2JhbFN0YXRlLm1vZGUubW9kZUluZm9bbW9kZUlkeF0ubmFtZSk7XG4gICAgICAgIGlmIChnbG9iYWxTdGF0ZS5tb2RlLnN0eWxlRW5hYmxlZCkge1xuICAgICAgICAgICAgY29uc3QgY3Vyc29yID0gZ2xvYmFsU3RhdGUuY3Vyc29yO1xuICAgICAgICAgICAgcHVzaERhbWFnZShnZXRHcmlkSWQoKSwgRGFtYWdlS2luZC5DZWxsLCAxLCAxLCBjdXJzb3IueCwgY3Vyc29yLnkpO1xuICAgICAgICAgICAgc2NoZWR1bGVGcmFtZSgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBtb2RlX2luZm9fc2V0OiAoY3Vyc29yU3R5bGVFbmFibGVkOiBib29sZWFuLCBtb2RlSW5mbzogW10pID0+IHtcbiAgICAgICAgLy8gTWlzc2luZzogaGFuZGxpbmcgb2YgY2VsbC1wZXJjZW50YWdlXG4gICAgICAgIGNvbnN0IG1vZGUgPSBnbG9iYWxTdGF0ZS5tb2RlO1xuICAgICAgICBtb2RlLnN0eWxlRW5hYmxlZCA9IGN1cnNvclN0eWxlRW5hYmxlZDtcbiAgICAgICAgbW9kZS5tb2RlSW5mbyA9IG1vZGVJbmZvO1xuICAgIH0sXG4gICAgbXNnX2NsZWFyOiAoKSA9PiB7XG4gICAgICAgIGRhbWFnZU1lc3NhZ2VzU3BhY2UoZ2xvYmFsU3RhdGUpO1xuICAgICAgICBnbG9iYWxTdGF0ZS5tZXNzYWdlcy5sZW5ndGggPSAwO1xuICAgIH0sXG4gICAgbXNnX2hpc3Rvcnlfc2hvdzogKGVudHJpZXM6IGFueVtdKSA9PiB7XG4gICAgICAgIGRhbWFnZU1lc3NhZ2VzU3BhY2UoZ2xvYmFsU3RhdGUpO1xuICAgICAgICBnbG9iYWxTdGF0ZS5tZXNzYWdlcyA9IGVudHJpZXMubWFwKChbLCBiXSkgPT4gYik7XG4gICAgfSxcbiAgICBtc2dfcnVsZXI6IChjb250ZW50OiBNZXNzYWdlKSA9PiB7XG4gICAgICAgIGRhbWFnZU1lc3NhZ2VzU3BhY2UoZ2xvYmFsU3RhdGUpO1xuICAgICAgICBnbG9iYWxTdGF0ZS5ydWxlciA9IGNvbnRlbnQ7XG4gICAgfSxcbiAgICBtc2dfc2hvdzogKF86IHN0cmluZywgY29udGVudDogTWVzc2FnZSwgcmVwbGFjZUxhc3Q6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgZGFtYWdlTWVzc2FnZXNTcGFjZShnbG9iYWxTdGF0ZSk7XG4gICAgICAgIGlmIChyZXBsYWNlTGFzdCkge1xuICAgICAgICAgICAgZ2xvYmFsU3RhdGUubWVzc2FnZXMubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgICAgICBnbG9iYWxTdGF0ZS5tZXNzYWdlcy5wdXNoKGNvbnRlbnQpO1xuICAgICAgICBnbG9iYWxTdGF0ZS5sYXN0TWVzc2FnZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICBnbG9iYWxTdGF0ZS5jdXJzb3IubW92ZWRTaW5jZUxhc3RNZXNzYWdlID0gZmFsc2U7XG4gICAgfSxcbiAgICBtc2dfc2hvd2NtZDogKGNvbnRlbnQ6IE1lc3NhZ2UpID0+IHtcbiAgICAgICAgZGFtYWdlTWVzc2FnZXNTcGFjZShnbG9iYWxTdGF0ZSk7XG4gICAgICAgIGdsb2JhbFN0YXRlLnNob3djbWQgPSBjb250ZW50O1xuICAgIH0sXG4gICAgbXNnX3Nob3dtb2RlOiAoY29udGVudDogTWVzc2FnZSkgPT4ge1xuICAgICAgICBkYW1hZ2VNZXNzYWdlc1NwYWNlKGdsb2JhbFN0YXRlKTtcbiAgICAgICAgZ2xvYmFsU3RhdGUuc2hvd21vZGUgPSBjb250ZW50O1xuICAgIH0sXG4gICAgb3B0aW9uX3NldDogKG9wdGlvbjogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gZ2xvYmFsU3RhdGU7XG4gICAgICAgIHN3aXRjaCAob3B0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIFwiZ3VpZm9udFwiOiB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld0ZvbnRTdHJpbmc7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0ZvbnRTdHJpbmcgPSBkZWZhdWx0Rm9udFN0cmluZztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBndWlmb250ID0gcGFyc2VHdWlmb250KHZhbHVlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IGRlZmF1bHRGb250RmFtaWx5LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb250LXNpemVcIjogZGVmYXVsdEZvbnRTaXplLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgbmV3Rm9udFN0cmluZyA9ICBtYWtlRm9udFN0cmluZyhndWlmb250W1wiZm9udC1zaXplXCJdLCBndWlmb250W1wiZm9udC1mYW1pbHlcIl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmV3Rm9udFN0cmluZyA9PT0gZm9udFN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2V0Rm9udFN0cmluZyhzdGF0ZSwgbmV3Rm9udFN0cmluZyk7XG4gICAgICAgICAgICAgICAgY29uc3QgW2NoYXJXaWR0aCwgY2hhckhlaWdodF0gPSBnZXRHbHlwaEluZm8oc3RhdGUpO1xuICAgICAgICAgICAgICAgIGV2ZW50cy5lbWl0KFwicmVzaXplXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JpZDogZ2V0R3JpZElkKCksXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBNYXRoLmZsb29yKHN0YXRlLmNhbnZhcy53aWR0aCAvIGNoYXJXaWR0aCksXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogTWF0aC5mbG9vcihzdGF0ZS5jYW52YXMuaGVpZ2h0IC8gY2hhckhlaWdodCksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJsaW5lc3BhY2VcIjoge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5saW5lc3BhY2UgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdGF0ZS5saW5lc3BhY2UgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpbnZhbGlkYXRlTWV0cmljcygpO1xuICAgICAgICAgICAgICAgIGNvbnN0IFtjaGFyV2lkdGgsIGNoYXJIZWlnaHRdID0gZ2V0R2x5cGhJbmZvKHN0YXRlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBnaWQgPSBnZXRHcmlkSWQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJHcmlkU2l6ZSA9IHN0YXRlLmdyaWRTaXplc1tnaWRdO1xuICAgICAgICAgICAgICAgIGlmIChjdXJHcmlkU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1c2hEYW1hZ2UoZ2V0R3JpZElkKCksIERhbWFnZUtpbmQuQ2VsbCwgY3VyR3JpZFNpemUuaGVpZ2h0LCBjdXJHcmlkU2l6ZS53aWR0aCwgMCwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGV2ZW50cy5lbWl0KFwicmVzaXplXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JpZDogZ2lkLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogTWF0aC5mbG9vcihzdGF0ZS5jYW52YXMud2lkdGggLyBjaGFyV2lkdGgpLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IE1hdGguZmxvb3Ioc3RhdGUuY2FudmFzLmhlaWdodCAvIGNoYXJIZWlnaHQpLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxufTtcblxuLy8ga2VlcCB0cmFjayBvZiB3aGV0aGVyIGEgZnJhbWUgaXMgYWxyZWFkeSBiZWluZyBzY2hlZHVsZWQgb3Igbm90LiBUaGlzIGF2b2lkc1xuLy8gYXNraW5nIGZvciBtdWx0aXBsZSBmcmFtZXMgd2hlcmUgd2UnZCBwYWludCB0aGUgc2FtZSB0aGluZyBhbnl3YXkuXG5sZXQgZnJhbWVTY2hlZHVsZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIHNjaGVkdWxlRnJhbWUoKSB7XG4gICAgaWYgKCFmcmFtZVNjaGVkdWxlZCkge1xuICAgICAgICBmcmFtZVNjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocGFpbnQpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcGFpbnRNZXNzYWdlcyhzdGF0ZTogU3RhdGUpIHtcbiAgICBjb25zdCBjdHggPSBzdGF0ZS5jb250ZXh0O1xuICAgIGNvbnN0IGdJZCA9IGdldEdyaWRJZCgpO1xuICAgIGNvbnN0IG1lc3NhZ2VzUG9zaXRpb24gPSBzdGF0ZS5tZXNzYWdlc1Bvc2l0aW9uc1tnSWRdO1xuICAgIGNvbnN0IFssIGNoYXJIZWlnaHQsIGJhc2VsaW5lXSA9IGdldEdseXBoSW5mbyhzdGF0ZSk7XG4gICAgY29uc3QgbWVzc2FnZXMgPSBzdGF0ZS5tZXNzYWdlcztcbiAgICAvLyB3ZSBuZWVkIHRvIGtub3cgdGhlIHNpemUgb2YgdGhlIG1lc3NhZ2UgYm94IGluIG9yZGVyIHRvIGRyYXcgaXRzIGJvcmRlclxuICAgIC8vIGFuZCBiYWNrZ3JvdW5kLiBUaGUgYWxnb3JpdGhtIHRvIGNvbXB1dGUgdGhpcyBpcyBlcXVpdmFsZW50IHRvIGRyYXdpbmdcbiAgICAvLyBhbGwgbWVzc2FnZXMuIFNvIHdlIHB1dCB0aGUgZHJhd2luZyBhbGdvcml0aG0gaW4gYSBmdW5jdGlvbiB3aXRoIGFcbiAgICAvLyBib29sZWFuIGFyZ3VtZW50IHRoYXQgd2lsbCBjb250cm9sIHdoZXRoZXIgdGV4dCBzaG91bGQgYWN0dWFsbHkgYmVcbiAgICAvLyBkcmF3bi4gVGhpcyBsZXRzIHVzIHJ1biB0aGUgYWxnb3JpdGhtIG9uY2UgdG8gZ2V0IHRoZSBkaW1lbnNpb25zIGFuZFxuICAgIC8vIHRoZW4gYWdhaW4gdG8gYWN0dWFsbHkgZHJhdyB0ZXh0LlxuICAgIGZ1bmN0aW9uIHJlbmRlck1lc3NhZ2VzIChkcmF3OiBib29sZWFuKSB7XG4gICAgICAgIGxldCByZW5kZXJlZFggPSBzdGF0ZS5jYW52YXMud2lkdGg7XG4gICAgICAgIGxldCByZW5kZXJlZFkgPSBzdGF0ZS5jYW52YXMuaGVpZ2h0IC0gY2hhckhlaWdodCArIGJhc2VsaW5lO1xuICAgICAgICBmb3IgKGxldCBpID0gbWVzc2FnZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBtZXNzYWdlc1tpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBtZXNzYWdlLmxlbmd0aCAtIDE7IGogPj0gMDsgLS1qKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hhcnMgPSBBcnJheS5mcm9tKG1lc3NhZ2Vbal1bMV0pO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSBjaGFycy5sZW5ndGggLSAxOyBrID49IDA7IC0taykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGFyID0gY2hhcnNba107XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lYXN1cmVkV2lkdGggPSBtZWFzdXJlV2lkdGgoc3RhdGUsIGNoYXIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVuZGVyZWRYIC0gbWVhc3VyZWRXaWR0aCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZW5kZXJlZFkgLSBjaGFySGVpZ2h0IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmVkWCA9IHN0YXRlLmNhbnZhcy53aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmVkWSA9IHJlbmRlcmVkWSAtIGNoYXJIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZWRYID0gcmVuZGVyZWRYIC0gbWVhc3VyZWRXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRyYXcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChjaGFyLCByZW5kZXJlZFgsIHJlbmRlcmVkWSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbmRlcmVkWCA8IG1lc3NhZ2VzUG9zaXRpb24ueCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXNQb3NpdGlvbi54ID0gcmVuZGVyZWRYO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZW5kZXJlZFkgPCBtZXNzYWdlc1Bvc2l0aW9uLnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzUG9zaXRpb24ueSA9IHJlbmRlcmVkWSAtIGJhc2VsaW5lO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVuZGVyZWRYID0gc3RhdGUuY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgcmVuZGVyZWRZID0gcmVuZGVyZWRZIC0gY2hhckhlaWdodDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXJNZXNzYWdlcyhmYWxzZSk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IHN0YXRlLmhpZ2hsaWdodHNbMF0uZm9yZWdyb3VuZDtcbiAgICBjdHguZmlsbFJlY3QobWVzc2FnZXNQb3NpdGlvbi54IC0gMixcbiAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzUG9zaXRpb24ueSAtIDIsXG4gICAgICAgICAgICAgICAgICAgICBzdGF0ZS5jYW52YXMud2lkdGggLSBtZXNzYWdlc1Bvc2l0aW9uLnggKyAyLFxuICAgICAgICAgICAgICAgICAgICAgc3RhdGUuY2FudmFzLmhlaWdodCAtIG1lc3NhZ2VzUG9zaXRpb24ueSArIDIpO1xuXG4gICAgY3R4LmZpbGxTdHlsZSA9IHN0YXRlLmhpZ2hsaWdodHNbMF0uYmFja2dyb3VuZDtcbiAgICBjdHguZmlsbFJlY3QobWVzc2FnZXNQb3NpdGlvbi54IC0gMSxcbiAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzUG9zaXRpb24ueSAtIDEsXG4gICAgICAgICAgICAgICAgICAgICBzdGF0ZS5jYW52YXMud2lkdGggLSBtZXNzYWdlc1Bvc2l0aW9uLnggKyAxLFxuICAgICAgICAgICAgICAgICAgICAgc3RhdGUuY2FudmFzLmhlaWdodCAtIG1lc3NhZ2VzUG9zaXRpb24ueSArIDEpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBzdGF0ZS5oaWdobGlnaHRzWzBdLmZvcmVncm91bmQ7XG4gICAgcmVuZGVyTWVzc2FnZXModHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIHBhaW50Q29tbWFuZGxpbmVXaW5kb3coc3RhdGU6IFN0YXRlKSB7XG4gICAgY29uc3QgY3R4ID0gc3RhdGUuY29udGV4dDtcbiAgICBjb25zdCBbY2hhcldpZHRoLCBjaGFySGVpZ2h0LCBiYXNlbGluZV0gPSBnZXRHbHlwaEluZm8oc3RhdGUpO1xuICAgIGNvbnN0IGNvbW1hbmRMaW5lID0gc3RhdGUuY29tbWFuZExpbmU7XG4gICAgY29uc3QgcmVjdCA9IGdldENvbW1hbmRMaW5lUmVjdChzdGF0ZSk7XG4gICAgLy8gb3V0ZXIgcmVjdGFuZ2xlXG4gICAgY3R4LmZpbGxTdHlsZSA9IHN0YXRlLmhpZ2hsaWdodHNbMF0uZm9yZWdyb3VuZDtcbiAgICBjdHguZmlsbFJlY3QocmVjdC54LFxuICAgICAgICAgICAgICAgICAgICAgcmVjdC55LFxuICAgICAgICAgICAgICAgICAgICAgcmVjdC53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgIHJlY3QuaGVpZ2h0KTtcblxuICAgIC8vIGlubmVyIHJlY3RhbmdsZVxuICAgIHJlY3QueCArPSAxO1xuICAgIHJlY3QueSArPSAxO1xuICAgIHJlY3Qud2lkdGggLT0gMjtcbiAgICByZWN0LmhlaWdodCAtPSAyO1xuICAgIGN0eC5maWxsU3R5bGUgPSBzdGF0ZS5oaWdobGlnaHRzWzBdLmJhY2tncm91bmQ7XG4gICAgY3R4LmZpbGxSZWN0KHJlY3QueCxcbiAgICAgICAgICAgICAgICAgICAgIHJlY3QueSxcbiAgICAgICAgICAgICAgICAgICAgIHJlY3Qud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICByZWN0LmhlaWdodCk7XG5cbiAgICAvLyBwYWRkaW5nIG9mIGlubmVyIHJlY3RhbmdsZVxuICAgIHJlY3QueCArPSAxO1xuICAgIHJlY3QueSArPSAxO1xuICAgIHJlY3Qud2lkdGggLT0gMjtcbiAgICByZWN0LmhlaWdodCAtPSAyO1xuXG4gICAgLy8gUG9zaXRpb24gd2hlcmUgdGV4dCBzaG91bGQgYmUgZHJhd25cbiAgICBsZXQgeCA9IHJlY3QueDtcbiAgICBjb25zdCB5ID0gcmVjdC55O1xuXG4gICAgLy8gZmlyc3QgY2hhcmFjdGVyXG4gICAgY3R4LmZpbGxTdHlsZSA9IHN0YXRlLmhpZ2hsaWdodHNbMF0uZm9yZWdyb3VuZDtcbiAgICBjdHguZmlsbFRleHQoY29tbWFuZExpbmUuZmlyc3RjLCB4LCB5ICsgYmFzZWxpbmUpO1xuICAgIHggKz0gY2hhcldpZHRoO1xuICAgIHJlY3Qud2lkdGggLT0gY2hhcldpZHRoO1xuXG4gICAgY29uc3QgZW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigpO1xuICAgIC8vIHJlZHVjZSB0aGUgY29tbWFuZGxpbmUncyBjb250ZW50IHRvIGEgc3RyaW5nIGZvciBpdGVyYXRpb25cbiAgICBjb25zdCBzdHIgPSBjb21tYW5kTGluZS5jb250ZW50LnJlZHVjZSgocjogc3RyaW5nLCBzZWdtZW50OiBbYW55LCBzdHJpbmddKSA9PiByICsgc2VnbWVudFsxXSwgXCJcIik7XG4gICAgLy8gQXJyYXkuZnJvbShzdHIpIHdpbGwgcmV0dXJuIGFuIGFycmF5IHdob3NlIGNlbGxzIGFyZSBncmFwaGVtZVxuICAgIC8vIGNsdXN0ZXJzLiBJdCBpcyBpbXBvcnRhbnQgdG8gaXRlcmF0ZSBvdmVyIGdyYXBoZW1lcyBpbnN0ZWFkIG9mIHRoZVxuICAgIC8vIHN0cmluZyBiZWNhdXNlIGl0ZXJhdGluZyBvdmVyIHRoZSBzdHJpbmcgd291bGQgc29tZXRpbWVzIHlpZWxkIG9ubHlcbiAgICAvLyBoYWxmIG9mIHRoZSBVVEYtMTYgY2hhcmFjdGVyL3N1cnJvZ2F0ZSBwYWlyLlxuICAgIGNvbnN0IGNoYXJhY3RlcnMgPSBBcnJheS5mcm9tKHN0cik7XG4gICAgLy8gcmVuZGVyZWRJIGlzIHRoZSBob3Jpem9udGFsIHBpeGVsIHBvc2l0aW9uIHdoZXJlIHRoZSBuZXh0IGNoYXJhY3RlclxuICAgIC8vIHNob3VsZCBiZSBkcmF3blxuICAgIGxldCByZW5kZXJlZEkgPSAwO1xuICAgIC8vIGVuY29kZWRJIGlzIHRoZSBudW1iZXIgb2YgYnl0ZXMgdGhhdCBoYXZlIGJlZW4gaXRlcmF0ZWQgb3ZlciB0aHVzXG4gICAgLy8gZmFyLiBJdCBpcyB1c2VkIHRvIGZpbmQgb3V0IHdoZXJlIHRvIGRyYXcgdGhlIGN1cnNvci4gSW5kZWVkLCBuZW92aW1cbiAgICAvLyBzZW5kcyB0aGUgY3Vyc29yJ3MgcG9zaXRpb24gYXMgYSBieXRlIHBvc2l0aW9uIHdpdGhpbiB0aGUgVVRGLThcbiAgICAvLyBlbmNvZGVkIGNvbW1hbmRsaW5lIHN0cmluZy5cbiAgICBsZXQgZW5jb2RlZEkgPSAwO1xuICAgIC8vIGN1cnNvclggaXMgdGhlIGhvcml6b250YWwgcGl4ZWwgcG9zaXRpb24gd2hlcmUgdGhlIGN1cnNvciBzaG91bGQgYmVcbiAgICAvLyBkcmF3bi5cbiAgICBsZXQgY3Vyc29yWCA9IDA7XG4gICAgLy8gVGhlIGluZGV4IG9mIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgYGNoYXJhY3RlcnNgIHRoYXQgY2FuIGJlIGRyYXduLlxuICAgIC8vIEl0IGlzIGhpZ2hlciB0aGFuIDAgd2hlbiB0aGUgY29tbWFuZCBsaW5lIHN0cmluZyBpcyB0b28gbG9uZyB0byBiZVxuICAgIC8vIGVudGlyZWx5IGRpc3BsYXllZC5cbiAgICBsZXQgc2xpY2VTdGFydCA9IDA7XG4gICAgLy8gVGhlIGluZGV4IG9mIHRoZSBsYXN0IGNoYXJhY3RlciBvZiBgY2hhcmFjdGVyc2AgdGhhdCBjYW4gYmUgZHJhd24uXG4gICAgLy8gSXQgaXMgZGlmZmVyZW50IGZyb20gY2hhcmFjdGVycy5sZW5ndGggd2hlbiB0aGUgY29tbWFuZCBsaW5lIHN0cmluZ1xuICAgIC8vIGlzIHRvbyBsb25nIHRvIGJlIGVudGlyZWx5IGRpc3BsYXllZC5cbiAgICBsZXQgc2xpY2VFbmQgPSAwO1xuICAgIC8vIFRoZSBob3Jpem9udGFsIHdpZHRoIGluIHBpeGVscyB0YWtlbiBieSB0aGUgZGlzcGxheWVkIHNsaWNlLiBJdFxuICAgIC8vIGlzIHVzZWQgdG8ga2VlcCB0cmFjayBvZiB3aGV0aGVyIHRoZSBjb21tYW5kbGluZSBzdHJpbmcgaXMgbG9uZ2VyXG4gICAgLy8gdGhhbiB0aGUgY29tbWFuZGxpbmUgd2luZG93LlxuICAgIGxldCBzbGljZVdpZHRoID0gMDtcbiAgICAvLyBjdXJzb3JEaXNwbGF5ZWQga2VlcHMgdHJhY2sgb2Ygd2hldGhlciB0aGUgY3Vyc29yIGNhbiBiZSBkaXNwbGF5ZWRcbiAgICAvLyBpbiB0aGUgc2xpY2UuXG4gICAgbGV0IGN1cnNvckRpc3BsYXllZCA9IGNvbW1hbmRMaW5lLnBvcyA9PT0gMDtcbiAgICAvLyBkZXNjcmlwdGlvbiBvZiB0aGUgYWxnb3JpdGhtOlxuICAgIC8vIEZvciBlYWNoIGNoYXJhY3RlciwgZmluZCBvdXQgaXRzIHdpZHRoLiBJZiBpdCBjYW5ub3QgZml0IGluIHRoZVxuICAgIC8vIGNvbW1hbmQgbGluZSB3aW5kb3cgYWxvbmcgd2l0aCB0aGUgcmVzdCBvZiB0aGUgc2xpY2UgYW5kIHRoZSBjdXJzb3JcbiAgICAvLyBoYXNuJ3QgYmVlbiBmb3VuZCB5ZXQsIHJlbW92ZSBjaGFyYWN0ZXJzIGZyb20gdGhlIGJlZ2lubmluZyBvZiB0aGVcbiAgICAvLyBzbGljZSB1bnRpbCB0aGUgY2hhcmFjdGVyIGZpdHMuXG4gICAgLy8gU3RvcCBlaXRoZXIgd2hlbiBhbGwgY2hhcmFjdGVycyBhcmUgaW4gdGhlIHNsaWNlIG9yIHdoZW4gdGhlIGN1cnNvclxuICAgIC8vIGNhbiBiZSBkaXNwbGF5ZWQgYW5kIHRoZSBzbGljZSB0YWtlcyBhbGwgYXZhaWxhYmxlIHdpZHRoLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhcmFjdGVycy5sZW5ndGg7ICsraSkge1xuICAgICAgICBzbGljZUVuZCA9IGk7XG4gICAgICAgIGNvbnN0IGNoYXIgPSBjaGFyYWN0ZXJzW2ldO1xuXG4gICAgICAgIGNvbnN0IGNXaWR0aCA9IG1lYXN1cmVXaWR0aChzdGF0ZSwgY2hhcik7XG4gICAgICAgIHJlbmRlcmVkSSArPSBjV2lkdGg7XG5cbiAgICAgICAgc2xpY2VXaWR0aCArPSBjV2lkdGg7XG4gICAgICAgIGlmIChzbGljZVdpZHRoID4gcmVjdC53aWR0aCkge1xuICAgICAgICAgICAgaWYgKGN1cnNvckRpc3BsYXllZCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZWRDaGFyID0gY2hhcmFjdGVyc1tzbGljZVN0YXJ0XTtcbiAgICAgICAgICAgICAgICBjb25zdCByZW1vdmVkV2lkdGggPSBtZWFzdXJlV2lkdGgoc3RhdGUsIHJlbW92ZWRDaGFyKTtcbiAgICAgICAgICAgICAgICByZW5kZXJlZEkgLT0gcmVtb3ZlZFdpZHRoO1xuICAgICAgICAgICAgICAgIHNsaWNlV2lkdGggLT0gcmVtb3ZlZFdpZHRoO1xuICAgICAgICAgICAgICAgIHNsaWNlU3RhcnQgKz0gMTtcbiAgICAgICAgICAgIH0gd2hpbGUgKHNsaWNlV2lkdGggPiByZWN0LndpZHRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVuY29kZWRJICs9IGVuY29kZXIuZW5jb2RlKGNoYXIpLmxlbmd0aDtcbiAgICAgICAgaWYgKGVuY29kZWRJID09PSBjb21tYW5kTGluZS5wb3MpIHtcbiAgICAgICAgICAgIGN1cnNvclggPSByZW5kZXJlZEk7XG4gICAgICAgICAgICBjdXJzb3JEaXNwbGF5ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChjaGFyYWN0ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVuZGVyZWRJID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IHNsaWNlU3RhcnQ7IGkgPD0gc2xpY2VFbmQ7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgY2hhciA9IGNoYXJhY3RlcnNbaV07XG4gICAgICAgICAgICBjdHguZmlsbFRleHQoY2hhciwgeCArIHJlbmRlcmVkSSwgeSArIGJhc2VsaW5lKTtcbiAgICAgICAgICAgIHJlbmRlcmVkSSArPSBtZWFzdXJlV2lkdGgoc3RhdGUsIGNoYXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGN0eC5maWxsUmVjdCh4ICsgY3Vyc29yWCwgeSwgMSwgY2hhckhlaWdodCk7XG59XG5cbmZ1bmN0aW9uIHBhaW50IChfOiBET01IaWdoUmVzVGltZVN0YW1wKSB7XG4gICAgZnJhbWVTY2hlZHVsZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2xvYmFsU3RhdGU7XG4gICAgY29uc3QgY2FudmFzID0gc3RhdGUuY2FudmFzO1xuICAgIGNvbnN0IGNvbnRleHQgPSBzdGF0ZS5jb250ZXh0O1xuICAgIGNvbnN0IGdpZCA9IGdldEdyaWRJZCgpO1xuICAgIGNvbnN0IGNoYXJhY3RlcnNHcmlkID0gc3RhdGUuZ3JpZENoYXJhY3RlcnNbZ2lkXTtcbiAgICBjb25zdCBoaWdobGlnaHRzR3JpZCA9IHN0YXRlLmdyaWRIaWdobGlnaHRzW2dpZF07XG4gICAgY29uc3QgZGFtYWdlcyA9IHN0YXRlLmdyaWREYW1hZ2VzW2dpZF07XG4gICAgY29uc3QgZGFtYWdlQ291bnQgPSBzdGF0ZS5ncmlkRGFtYWdlc0NvdW50W2dpZF07XG4gICAgY29uc3QgaGlnaGxpZ2h0cyA9IHN0YXRlLmhpZ2hsaWdodHM7XG4gICAgY29uc3QgW2NoYXJXaWR0aCwgY2hhckhlaWdodCwgYmFzZWxpbmVdID0gZ2V0R2x5cGhJbmZvKHN0YXRlKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGFtYWdlQ291bnQ7ICsraSkge1xuICAgICAgICBjb25zdCBkYW1hZ2UgPSBkYW1hZ2VzW2ldO1xuICAgICAgICBzd2l0Y2ggKGRhbWFnZS5raW5kKSB7XG4gICAgICAgICAgICBjYXNlIERhbWFnZUtpbmQuUmVzaXplOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGl4ZWxXaWR0aCA9IGRhbWFnZS53ICogY2hhcldpZHRoIC8gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgY29uc3QgcGl4ZWxIZWlnaHQgPSBkYW1hZ2UuaCAqIGNoYXJIZWlnaHQgLyB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBldmVudHMuZW1pdChcImZyYW1lUmVzaXplXCIsIHsgd2lkdGg6IHBpeGVsV2lkdGgsIGhlaWdodDogcGl4ZWxIZWlnaHQgfSk7XG4gICAgICAgICAgICAgICAgc2V0Q2FudmFzRGltZW5zaW9ucyhjYW52YXMsIHBpeGVsV2lkdGgsIHBpeGVsSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAvLyBOb3RlOiBjaGFuZ2luZyB3aWR0aCBhbmQgaGVpZ2h0IHJlc2V0cyBmb250LCBzbyB3ZSBoYXZlIHRvXG4gICAgICAgICAgICAgICAgLy8gc2V0IGl0IGFnYWluLiBXaG8gdGhvdWdodCB0aGlzIHdhcyBhIGdvb2QgaWRlYT8/P1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZm9udCA9IGZvbnRTdHJpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgRGFtYWdlS2luZC5TY3JvbGw6XG4gICAgICAgICAgICBjYXNlIERhbWFnZUtpbmQuQ2VsbDpcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB5ID0gZGFtYWdlLnk7IHkgPCBkYW1hZ2UueSArIGRhbWFnZS5oICYmIHkgPCBjaGFyYWN0ZXJzR3JpZC5sZW5ndGg7ICsreSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByb3cgPSBjaGFyYWN0ZXJzR3JpZFt5XTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm93SGlnaCA9IGhpZ2hsaWdodHNHcmlkW3ldO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwaXhlbFkgPSB5ICogY2hhckhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gZGFtYWdlLng7IHggPCBkYW1hZ2UueCArIGRhbWFnZS53ICYmIHggPCByb3cubGVuZ3RoOyArK3gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dbeF0gPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBpeGVsWCA9IHggKiBjaGFyV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGdseXBoSWQocm93W3hdLCByb3dIaWdoW3hdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdseXBoQ2FjaGVbaWRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjZWxsSGlnaCA9IGhpZ2hsaWdodHNbcm93SGlnaFt4XV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSBNYXRoLmNlaWwobWVhc3VyZVdpZHRoKHN0YXRlLCByb3dbeF0pIC8gY2hhcldpZHRoKSAqIGNoYXJXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYmFja2dyb3VuZCA9IGNlbGxIaWdoLmJhY2tncm91bmQgfHwgaGlnaGxpZ2h0c1swXS5iYWNrZ3JvdW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmb3JlZ3JvdW5kID0gY2VsbEhpZ2guZm9yZWdyb3VuZCB8fCBoaWdobGlnaHRzWzBdLmZvcmVncm91bmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxIaWdoLnJldmVyc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG1wID0gYmFja2dyb3VuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZCA9IGZvcmVncm91bmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVncm91bmQgPSB0bXA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gYmFja2dyb3VuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KHBpeGVsWCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpeGVsWSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhckhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBmb3JlZ3JvdW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmb250U3RyID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hhbmdlRm9udCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsSGlnaC5ib2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTdHIgKz0gXCIgYm9sZCBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlRm9udCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsSGlnaC5pdGFsaWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFN0ciArPSBcIiBpdGFsaWMgXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZUZvbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hhbmdlRm9udCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZvbnQgPSBmb250U3RyICsgZm9udFN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsVGV4dChyb3dbeF0sIHBpeGVsWCwgcGl4ZWxZICsgYmFzZWxpbmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VGb250KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZm9udCA9IGZvbnRTdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsSGlnaC5zdHJpa2V0aHJvdWdoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QocGl4ZWxYLCBwaXhlbFkgKyBiYXNlbGluZSAvIDIsIHdpZHRoLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBjZWxsSGlnaC5zcGVjaWFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhc2VsaW5lSGVpZ2h0ID0gKGNoYXJIZWlnaHQgLSBiYXNlbGluZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxIaWdoLnVuZGVybGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5lcG9zID0gYmFzZWxpbmVIZWlnaHQgKiAwLjM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QocGl4ZWxYLCBwaXhlbFkgKyBiYXNlbGluZSArIGxpbmVwb3MsIHdpZHRoLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxIaWdoLnVuZGVyY3VybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJscG9zID0gYmFzZWxpbmVIZWlnaHQgKiAwLjY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGFic2Npc3NhID0gcGl4ZWxYOyBhYnNjaXNzYSA8IHBpeGVsWCArIHdpZHRoOyArK2Fic2Npc3NhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KGFic2Npc3NhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXhlbFkgKyBiYXNlbGluZSArIGN1cmxwb3MgKyBNYXRoLmNvcyhhYnNjaXNzYSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlYXNvbiBmb3IgdGhlIGNoZWNrOiB3ZSBjYW4ndCByZXRyaWV2ZSBwaXhlbHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkcmF3biBvdXRzaWRlIHRoZSB2aWV3cG9ydFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwaXhlbFggPj0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBwaXhlbFkgPj0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAocGl4ZWxYICsgd2lkdGggPCBjYW52YXMud2lkdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIChwaXhlbFkgKyBjaGFySGVpZ2h0IDwgY2FudmFzLmhlaWdodClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgd2lkdGggPiAwICYmIGNoYXJIZWlnaHQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdseXBoQ2FjaGVbaWRdID0gY29udGV4dC5nZXRJbWFnZURhdGEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXhlbFgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXhlbFksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJIZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5wdXRJbWFnZURhdGEoZ2x5cGhDYWNoZVtpZF0sIHBpeGVsWCwgcGl4ZWxZKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdGF0ZS5tZXNzYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHBhaW50TWVzc2FnZXMoc3RhdGUpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBjb21tYW5kIGxpbmUgaXMgc2hvd24sIHRoZSBjdXJzb3IncyBpbiBpdFxuICAgIGlmIChzdGF0ZS5jb21tYW5kTGluZS5zdGF0dXMgPT09IFwic2hvd25cIikge1xuICAgICAgICBwYWludENvbW1hbmRsaW5lV2luZG93KHN0YXRlKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlLmN1cnNvci5kaXNwbGF5KSB7XG4gICAgICAgIGNvbnN0IGN1cnNvciA9IHN0YXRlLmN1cnNvcjtcbiAgICAgICAgaWYgKGN1cnNvci5jdXJyZW50R3JpZCA9PT0gZ2lkKSB7XG4gICAgICAgICAgICAvLyBNaXNzaW5nOiBoYW5kbGluZyBvZiBjZWxsLXBlcmNlbnRhZ2VcbiAgICAgICAgICAgIGNvbnN0IG1vZGUgPSBzdGF0ZS5tb2RlO1xuICAgICAgICAgICAgY29uc3QgaW5mbyA9IG1vZGUuc3R5bGVFbmFibGVkXG4gICAgICAgICAgICAgICAgPyBtb2RlLm1vZGVJbmZvW21vZGUuY3VycmVudF1cbiAgICAgICAgICAgICAgICA6IG1vZGUubW9kZUluZm9bMF07XG4gICAgICAgICAgICBjb25zdCBzaG91bGRCbGluayA9IChpbmZvLmJsaW5rd2FpdCA+IDAgJiYgaW5mby5ibGlua29uID4gMCAmJiBpbmZvLmJsaW5rb2ZmID4gMCk7XG5cbiAgICAgICAgICAgIC8vIERlY2lkZSBjb2xvci4gQXMgZGVzY3JpYmVkIGluIHRoZSBkb2MsIGlmIGF0dHJfaWQgaXMgMCBjb2xvcnNcbiAgICAgICAgICAgIC8vIHNob3VsZCBiZSByZXZlcnRlZC5cbiAgICAgICAgICAgIGxldCBiYWNrZ3JvdW5kID0gaGlnaGxpZ2h0c1tpbmZvLmF0dHJfaWRdLmJhY2tncm91bmQ7XG4gICAgICAgICAgICBsZXQgZm9yZWdyb3VuZCA9IGhpZ2hsaWdodHNbaW5mby5hdHRyX2lkXS5mb3JlZ3JvdW5kO1xuICAgICAgICAgICAgaWYgKGluZm8uYXR0cl9pZCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRtcCA9IGJhY2tncm91bmQ7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZCA9IGZvcmVncm91bmQ7XG4gICAgICAgICAgICAgICAgZm9yZWdyb3VuZCA9IHRtcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRGVjaWRlIGN1cnNvciBzaGFwZS4gRGVmYXVsdCB0byBibG9jaywgY2hhbmdlIHRvXG4gICAgICAgICAgICAvLyB2ZXJ0aWNhbC9ob3Jpem9udGFsIGlmIG5lZWRlZC5cbiAgICAgICAgICAgIGNvbnN0IGN1cnNvcldpZHRoID0gY3Vyc29yLnggKiBjaGFyV2lkdGg7XG4gICAgICAgICAgICBsZXQgY3Vyc29ySGVpZ2h0ID0gY3Vyc29yLnkgKiBjaGFySGVpZ2h0O1xuICAgICAgICAgICAgbGV0IHdpZHRoID0gY2hhcldpZHRoO1xuICAgICAgICAgICAgbGV0IGhlaWdodCA9IGNoYXJIZWlnaHQ7XG4gICAgICAgICAgICBpZiAoaW5mby5jdXJzb3Jfc2hhcGUgPT09IFwidmVydGljYWxcIikge1xuICAgICAgICAgICAgICAgIHdpZHRoID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5mby5jdXJzb3Jfc2hhcGUgPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAgICAgICAgICAgY3Vyc29ySGVpZ2h0ICs9IGNoYXJIZWlnaHQgLSAyO1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICAgICAgLy8gRGVjaWRlIGlmIHRoZSBjdXJzb3Igc2hvdWxkIGJlIGludmVydGVkLiBUaGlzIG9ubHkgaGFwcGVucyBpZlxuICAgICAgICAgICAgLy8gYmxpbmtpbmcgaXMgb24sIHdlJ3ZlIHdhaXRlZCBibGlua3dhaXQgdGltZSBhbmQgd2UncmUgaW4gdGhlXG4gICAgICAgICAgICAvLyBcImJsaW5rb2ZmXCIgdGltZSBzbG90LlxuICAgICAgICAgICAgY29uc3QgYmxpbmtPZmYgPSBzaG91bGRCbGlua1xuICAgICAgICAgICAgICAgICYmIChub3cgLSBpbmZvLmJsaW5rd2FpdCA+IGN1cnNvci5sYXN0TW92ZSlcbiAgICAgICAgICAgICAgICAmJiAoKG5vdyAlIChpbmZvLmJsaW5rb24gKyBpbmZvLmJsaW5rb2ZmKSkgPiBpbmZvLmJsaW5rb24pO1xuICAgICAgICAgICAgaWYgKGJsaW5rT2ZmKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGlnaCA9IGhpZ2hsaWdodHNbaGlnaGxpZ2h0c0dyaWRbY3Vyc29yLnldW2N1cnNvci54XV07XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZCA9IGhpZ2guYmFja2dyb3VuZDtcbiAgICAgICAgICAgICAgICBmb3JlZ3JvdW5kID0gaGlnaC5mb3JlZ3JvdW5kO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGaW5hbGx5IGRyYXcgY3Vyc29yXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGJhY2tncm91bmQ7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KGN1cnNvcldpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3JIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQpO1xuXG4gICAgICAgICAgICBpZiAoaW5mby5jdXJzb3Jfc2hhcGUgPT09IFwiYmxvY2tcIikge1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZm9yZWdyb3VuZDtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFyID0gY2hhcmFjdGVyc0dyaWRbY3Vyc29yLnldW2N1cnNvci54XTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxUZXh0KGNoYXIsIGN1cnNvci54ICogY2hhcldpZHRoLCBjdXJzb3IueSAqIGNoYXJIZWlnaHQgKyBiYXNlbGluZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzaG91bGRCbGluaykge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJzb3Igc2hvdWxkIGJsaW5rLCB3ZSBuZWVkIHRvIHBhaW50IGNvbnRpbnVvdXNseVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlTm93ID0gcGVyZm9ybWFuY2Uubm93KCkgJSAoaW5mby5ibGlua29uICsgaW5mby5ibGlua29mZik7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dFBhaW50ID0gcmVsYXRpdmVOb3cgPCBpbmZvLmJsaW5rb25cbiAgICAgICAgICAgICAgICAgICAgPyBpbmZvLmJsaW5rb24gLSByZWxhdGl2ZU5vd1xuICAgICAgICAgICAgICAgICAgICA6IGluZm8uYmxpbmtvZmYgLSAocmVsYXRpdmVOb3cgLSBpbmZvLmJsaW5rb24pO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoc2NoZWR1bGVGcmFtZSwgbmV4dFBhaW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRlLmdyaWREYW1hZ2VzQ291bnRbZ2lkXSA9IDA7XG59XG5cbmxldCBjbWRsaW5lVGltZW91dCA9IDMwMDA7XG5jb25mUmVhZHkudGhlbigoKSA9PiBjbWRsaW5lVGltZW91dCA9IGdldEdsb2JhbENvbmYoKS5jbWRsaW5lVGltZW91dCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBvblJlZHJhdyhldmVudHM6IGFueVtdKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgZXZlbnQgPSBldmVudHNbaV07XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoaGFuZGxlcnMgYXMgYW55KVsoZXZlbnRbMF0gYXMgYW55KV07XG4gICAgICAgIGlmIChoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgZXZlbnQubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyLmFwcGx5KGdsb2JhbFN0YXRlLCBldmVudFtqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKGAke2V2ZW50WzBdfSBpcyBub3QgaW1wbGVtZW50ZWQuYCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBlcmZvcm1hbmNlLm5vdygpIC0gZ2xvYmFsU3RhdGUubGFzdE1lc3NhZ2UgPiBjbWRsaW5lVGltZW91dCAmJiBnbG9iYWxTdGF0ZS5jdXJzb3IubW92ZWRTaW5jZUxhc3RNZXNzYWdlKSB7XG4gICAgICAgIGhhbmRsZXJzW1wibXNnX2NsZWFyXCJdKCk7XG4gICAgfVxufVxuIiwiLy8gVGhlc2UgbW9kZXMgYXJlIGRlZmluZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL25lb3ZpbS9uZW92aW0vYmxvYi9tYXN0ZXIvc3JjL252aW0vY3Vyc29yX3NoYXBlLmNcbmV4cG9ydCB0eXBlIE52aW1Nb2RlID0gXCJhbGxcIlxuICB8IFwibm9ybWFsXCJcbiAgfCBcInZpc3VhbFwiXG4gIHwgXCJpbnNlcnRcIlxuICB8IFwicmVwbGFjZVwiXG4gIHwgXCJjbWRsaW5lX25vcm1hbFwiXG4gIHwgXCJjbWRsaW5lX2luc2VydFwiXG4gIHwgXCJjbWRsaW5lX3JlcGxhY2VcIlxuICB8IFwib3BlcmF0b3JcIlxuICB8IFwidmlzdWFsX3NlbGVjdFwiXG4gIHwgXCJjbWRsaW5lX2hvdmVyXCJcbiAgfCBcInN0YXR1c2xpbmVfaG92ZXJcIlxuICB8IFwic3RhdHVzbGluZV9kcmFnXCJcbiAgfCBcInZzZXBfaG92ZXJcIlxuICB8IFwidnNlcF9kcmFnXCJcbiAgfCBcIm1vcmVcIlxuICB8IFwibW9yZV9sYXN0bGluZVwiXG4gIHwgXCJzaG93bWF0Y2hcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJU2l0ZUNvbmZpZyB7XG4gICAgY21kbGluZTogXCJuZW92aW1cIiB8IFwiZmlyZW52aW1cIjtcbiAgICBjb250ZW50OiBcImh0bWxcIiB8IFwidGV4dFwiO1xuICAgIHByaW9yaXR5OiBudW1iZXI7XG4gICAgcmVuZGVyZXI6IFwiaHRtbFwiIHwgXCJjYW52YXNcIjtcbiAgICBzZWxlY3Rvcjogc3RyaW5nO1xuICAgIHRha2VvdmVyOiBcImFsd2F5c1wiIHwgXCJvbmNlXCIgfCBcImVtcHR5XCIgfCBcIm5vbmVtcHR5XCIgfCBcIm5ldmVyXCI7XG4gICAgZmlsZW5hbWU6IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgR2xvYmFsU2V0dGluZ3MgPSB7XG4gIGFsdDogXCJhbHBoYW51bVwiIHwgXCJhbGxcIixcbiAgXCI8Qy1uPlwiOiBcImRlZmF1bHRcIiB8IFwibm9vcFwiLFxuICBcIjxDLXQ+XCI6IFwiZGVmYXVsdFwiIHwgXCJub29wXCIsXG4gIFwiPEMtdz5cIjogXCJkZWZhdWx0XCIgfCBcIm5vb3BcIixcbiAgXCI8Q1Mtbj5cIjogXCJkZWZhdWx0XCIgfCBcIm5vb3BcIixcbiAgXCI8Q1MtdD5cIjogXCJkZWZhdWx0XCIgfCBcIm5vb3BcIixcbiAgXCI8Q1Mtdz5cIjogXCJkZWZhdWx0XCIgfCBcIm5vb3BcIixcbiAgaWdub3JlS2V5czogeyBba2V5IGluIE52aW1Nb2RlXTogc3RyaW5nW10gfSxcbiAgY21kbGluZVRpbWVvdXQ6IG51bWJlcixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQ29uZmlnIHtcbiAgICBnbG9iYWxTZXR0aW5nczogR2xvYmFsU2V0dGluZ3M7XG4gICAgbG9jYWxTZXR0aW5nczogeyBba2V5OiBzdHJpbmddOiBJU2l0ZUNvbmZpZyB9O1xufVxuXG5sZXQgY29uZjogSUNvbmZpZyA9IHVuZGVmaW5lZCBhcyBJQ29uZmlnO1xuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VXaXRoRGVmYXVsdHMob3M6IHN0cmluZywgc2V0dGluZ3M6IGFueSk6IElDb25maWcge1xuICAgIGZ1bmN0aW9uIG1ha2VEZWZhdWx0cyhvYmo6IHsgW2tleTogc3RyaW5nXTogYW55IH0sIG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgICAgICBpZiAob2JqW25hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG9ialtuYW1lXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1ha2VEZWZhdWx0TG9jYWxTZXR0aW5nKHNldHQ6IHsgbG9jYWxTZXR0aW5nczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpdGU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmo6IElTaXRlQ29uZmlnKSB7XG4gICAgICAgIG1ha2VEZWZhdWx0cyhzZXR0LmxvY2FsU2V0dGluZ3MsIHNpdGUsIHt9KTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgKE9iamVjdC5rZXlzKG9iaikgYXMgKGtleW9mIHR5cGVvZiBvYmopW10pKSB7XG4gICAgICAgICAgICBtYWtlRGVmYXVsdHMoc2V0dC5sb2NhbFNldHRpbmdzW3NpdGVdLCBrZXksIG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2V0dGluZ3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzZXR0aW5ncyA9IHt9O1xuICAgIH1cblxuICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncywgXCJnbG9iYWxTZXR0aW5nc1wiLCB7fSk7XG4gICAgLy8gXCI8S0VZPlwiOiBcImRlZmF1bHRcIiB8IFwibm9vcFwiXG4gICAgLy8gIzEwMzogV2hlbiB1c2luZyB0aGUgYnJvd3NlcidzIGNvbW1hbmQgQVBJIHRvIGFsbG93IHNlbmRpbmcgYDxDLXc+YCB0b1xuICAgIC8vIGZpcmVudmltLCB3aGV0aGVyIHRoZSBkZWZhdWx0IGFjdGlvbiBzaG91bGQgYmUgcGVyZm9ybWVkIGlmIG5vIG5lb3ZpbVxuICAgIC8vIGZyYW1lIGlzIGZvY3VzZWQuXG4gICAgbWFrZURlZmF1bHRzKHNldHRpbmdzLmdsb2JhbFNldHRpbmdzLCBcIjxDLW4+XCIsIFwiZGVmYXVsdFwiKTtcbiAgICBtYWtlRGVmYXVsdHMoc2V0dGluZ3MuZ2xvYmFsU2V0dGluZ3MsIFwiPEMtdD5cIiwgXCJkZWZhdWx0XCIpO1xuICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncy5nbG9iYWxTZXR0aW5ncywgXCI8Qy13PlwiLCBcImRlZmF1bHRcIik7XG4gICAgLy8gTm90ZTogPENTLSo+IGFyZSBjdXJyZW50bHkgZGlzYWJsZWQgYmVjYXVzZSBvZlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9uZW92aW0vbmVvdmltL2lzc3Vlcy8xMjAzN1xuICAgIC8vIE5vdGU6IDxDUy1uPiBkb2Vzbid0IG1hdGNoIHRoZSBkZWZhdWx0IGJlaGF2aW9yIG9uIGZpcmVmb3ggYmVjYXVzZSB0aGlzXG4gICAgLy8gd291bGQgcmVxdWlyZSB0aGUgc2Vzc2lvbnMgQVBJLiBJbnN0ZWFkLCBGaXJlZm94J3MgYmVoYXZpb3IgbWF0Y2hlc1xuICAgIC8vIENocm9tZSdzLlxuICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncy5nbG9iYWxTZXR0aW5ncywgXCI8Q1Mtbj5cIiwgXCJkZWZhdWx0XCIpO1xuICAgIC8vIE5vdGU6IDxDUy10PiBpcyB0aGVyZSBmb3IgY29tcGxldGVuZXNzIHNha2UncyBidXQgY2FuJ3QgYmUgZW11bGF0ZWQgaW5cbiAgICAvLyBDaHJvbWUgYW5kIEZpcmVmb3ggYmVjYXVzZSB0aGlzIHdvdWxkIHJlcXVpcmUgdGhlIHNlc3Npb25zIEFQSS5cbiAgICBtYWtlRGVmYXVsdHMoc2V0dGluZ3MuZ2xvYmFsU2V0dGluZ3MsIFwiPENTLXQ+XCIsIFwiZGVmYXVsdFwiKTtcbiAgICBtYWtlRGVmYXVsdHMoc2V0dGluZ3MuZ2xvYmFsU2V0dGluZ3MsIFwiPENTLXc+XCIsIFwiZGVmYXVsdFwiKTtcbiAgICAvLyAjNzE3OiBhbGxvdyBwYXNzaW5nIGtleXMgdG8gdGhlIGJyb3dzZXJcbiAgICBtYWtlRGVmYXVsdHMoc2V0dGluZ3MuZ2xvYmFsU2V0dGluZ3MsIFwiaWdub3JlS2V5c1wiLCB7fSk7XG4gICAgLy8gIzEwNTA6IGN1cnNvciBzb21ldGltZXMgY292ZXJlZCBieSBjb21tYW5kIGxpbmVcbiAgICBtYWtlRGVmYXVsdHMoc2V0dGluZ3MuZ2xvYmFsU2V0dGluZ3MsIFwiY21kbGluZVRpbWVvdXRcIiwgMzAwMCk7XG5cbiAgICAvLyBcImFsdFwiOiBcImFsbFwiIHwgXCJhbHBoYW51bVwiXG4gICAgLy8gIzIwMjogT25seSByZWdpc3RlciBhbHQga2V5IG9uIGFscGhhbnVtcyB0byBsZXQgc3dlZGlzaCBvc3ggdXNlcnMgdHlwZVxuICAgIC8vICAgICAgIHNwZWNpYWwgY2hhcnNcbiAgICAvLyBPbmx5IHRlc3RlZCBvbiBPU1gsIHdoZXJlIHdlIGRvbid0IHB1bGwgY292ZXJhZ2UgcmVwb3J0cywgc28gZG9uJ3RcbiAgICAvLyBpbnN0cnVtZW50IGZ1bmN0aW9uLlxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKG9zID09PSBcIm1hY1wiKSB7XG4gICAgICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncy5nbG9iYWxTZXR0aW5ncywgXCJhbHRcIiwgXCJhbHBoYW51bVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBtYWtlRGVmYXVsdHMoc2V0dGluZ3MuZ2xvYmFsU2V0dGluZ3MsIFwiYWx0XCIsIFwiYWxsXCIpO1xuICAgIH1cblxuICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncywgXCJsb2NhbFNldHRpbmdzXCIsIHt9KTtcbiAgICBtYWtlRGVmYXVsdExvY2FsU2V0dGluZyhzZXR0aW5ncywgXCIuKlwiLCB7XG4gICAgICAgIC8vIFwiY21kbGluZVwiOiBcIm5lb3ZpbVwiIHwgXCJmaXJlbnZpbVwiXG4gICAgICAgIC8vICMxNjg6IFVzZSBhbiBleHRlcm5hbCBjb21tYW5kbGluZSB0byBwcmVzZXJ2ZSBzcGFjZVxuICAgICAgICBjbWRsaW5lOiBcImZpcmVudmltXCIsXG4gICAgICAgIGNvbnRlbnQ6IFwidGV4dFwiLFxuICAgICAgICBwcmlvcml0eTogMCxcbiAgICAgICAgcmVuZGVyZXI6IFwiY2FudmFzXCIsXG4gICAgICAgIHNlbGVjdG9yOiAndGV4dGFyZWE6bm90KFtyZWFkb25seV0pLCBkaXZbcm9sZT1cInRleHRib3hcIl0nLFxuICAgICAgICAvLyBcInRha2VvdmVyXCI6IFwiYWx3YXlzXCIgfCBcIm9uY2VcIiB8IFwiZW1wdHlcIiB8IFwibm9uZW1wdHlcIiB8IFwibmV2ZXJcIlxuICAgICAgICAvLyAjMjY1OiBPbiBcIm9uY2VcIiwgZG9uJ3QgYXV0b21hdGljYWxseSBicmluZyBiYWNrIGFmdGVyIDpxJ2luZyBpdFxuICAgICAgICB0YWtlb3ZlcjogXCJhbHdheXNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwie2hvc3RuYW1lJTMyfV97cGF0aG5hbWUlMzJ9X3tzZWxlY3RvciUzMn1fe3RpbWVzdGFtcCUzMn0ue2V4dGVuc2lvbn1cIixcbiAgICB9KTtcbiAgICBtYWtlRGVmYXVsdExvY2FsU2V0dGluZyhzZXR0aW5ncywgXCJhYm91dDpibGFua1xcXFw/Y29tcG9zZVwiLCB7XG4gICAgICAgIGNtZGxpbmU6IFwiZmlyZW52aW1cIixcbiAgICAgICAgY29udGVudDogXCJ0ZXh0XCIsXG4gICAgICAgIHByaW9yaXR5OiAxLFxuICAgICAgICByZW5kZXJlcjogXCJjYW52YXNcIixcbiAgICAgICAgc2VsZWN0b3I6ICdib2R5JyxcbiAgICAgICAgdGFrZW92ZXI6IFwiYWx3YXlzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcIm1haWxfe3RpbWVzdGFtcCUzMn0uZW1sXCIsXG4gICAgfSk7XG4gICAgcmV0dXJuIHNldHRpbmdzO1xufVxuXG5leHBvcnQgY29uc3QgY29uZlJlYWR5ID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgYnJvd3Nlci5zdG9yYWdlLmxvY2FsLmdldCgpLnRoZW4oKG9iajogYW55KSA9PiB7XG4gICAgICAgIGNvbmYgPSBvYmo7XG4gICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgfSk7XG59KTtcblxuYnJvd3Nlci5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlczogYW55KSA9PiB7XG4gICAgT2JqZWN0XG4gICAgICAgIC5lbnRyaWVzKGNoYW5nZXMpXG4gICAgICAgIC5mb3JFYWNoKChba2V5LCB2YWx1ZV06IFtrZXlvZiBJQ29uZmlnLCBhbnldKSA9PiBjb25mUmVhZHkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25mW2tleV0gPSB2YWx1ZS5uZXdWYWx1ZTtcbiAgICAgICAgfSkpO1xufSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHbG9iYWxDb25mKCkge1xuICAgIC8vIENhbid0IGJlIHRlc3RlZCBmb3JcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmIChjb25mID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ2V0R2xvYmFsQ29uZiBjYWxsZWQgYmVmb3JlIGNvbmZpZyB3YXMgcmVhZHlcIik7XG4gICAgfVxuICAgIHJldHVybiBjb25mLmdsb2JhbFNldHRpbmdzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uZigpIHtcbiAgICByZXR1cm4gZ2V0Q29uZkZvclVybChkb2N1bWVudC5sb2NhdGlvbi5ocmVmKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZGb3JVcmwodXJsOiBzdHJpbmcpOiBJU2l0ZUNvbmZpZyB7XG4gICAgY29uc3QgbG9jYWxTZXR0aW5ncyA9IGNvbmYubG9jYWxTZXR0aW5ncztcbiAgICBmdW5jdGlvbiBvcjEodmFsOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsO1xuICAgIH1cbiAgICAvLyBDYW4ndCBiZSB0ZXN0ZWQgZm9yXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAobG9jYWxTZXR0aW5ncyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVycm9yOiB5b3VyIHNldHRpbmdzIGFyZSB1bmRlZmluZWQuIFRyeSByZWxvYWRpbmcgdGhlIHBhZ2UuIElmIHRoaXMgZXJyb3IgcGVyc2lzdHMsIHRyeSB0aGUgdHJvdWJsZXNob290aW5nIGd1aWRlOiBodHRwczovL2dpdGh1Yi5jb20vZ2xhY2FtYnJlL2ZpcmVudmltL2Jsb2IvbWFzdGVyL1RST1VCTEVTSE9PVElORy5tZFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmZyb20oT2JqZWN0LmVudHJpZXMobG9jYWxTZXR0aW5ncykpXG4gICAgICAgIC5maWx0ZXIoKFtwYXQsIF9dKSA9PiAobmV3IFJlZ0V4cChwYXQpKS50ZXN0KHVybCkpXG4gICAgICAgIC5zb3J0KChlMSwgZTIpID0+IChvcjEoZTFbMV0ucHJpb3JpdHkpIC0gb3IxKGUyWzFdLnByaW9yaXR5KSkpXG4gICAgICAgIC5yZWR1Y2UoKGFjYywgW18sIGN1cl0pID0+IE9iamVjdC5hc3NpZ24oYWNjLCBjdXIpLCB7fSBhcyBJU2l0ZUNvbmZpZyk7XG59XG4iLCJleHBvcnQgY29uc3Qgbm9uTGl0ZXJhbEtleXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge1xuICAgIFwiIFwiOiBcIjxTcGFjZT5cIixcbiAgICBcIjxcIjogXCI8bHQ+XCIsXG4gICAgXCJBcnJvd0Rvd25cIjogXCI8RG93bj5cIixcbiAgICBcIkFycm93TGVmdFwiOiBcIjxMZWZ0PlwiLFxuICAgIFwiQXJyb3dSaWdodFwiOiBcIjxSaWdodD5cIixcbiAgICBcIkFycm93VXBcIjogXCI8VXA+XCIsXG4gICAgXCJCYWNrc3BhY2VcIjogXCI8QlM+XCIsXG4gICAgXCJEZWxldGVcIjogXCI8RGVsPlwiLFxuICAgIFwiRW5kXCI6IFwiPEVuZD5cIixcbiAgICBcIkVudGVyXCI6IFwiPENSPlwiLFxuICAgIFwiRXNjYXBlXCI6IFwiPEVzYz5cIixcbiAgICBcIkYxXCI6IFwiPEYxPlwiLFxuICAgIFwiRjEwXCI6IFwiPEYxMD5cIixcbiAgICBcIkYxMVwiOiBcIjxGMTE+XCIsXG4gICAgXCJGMTJcIjogXCI8RjEyPlwiLFxuICAgIFwiRjEzXCI6IFwiPEYxMz5cIixcbiAgICBcIkYxNFwiOiBcIjxGMTQ+XCIsXG4gICAgXCJGMTVcIjogXCI8RjE1PlwiLFxuICAgIFwiRjE2XCI6IFwiPEYxNj5cIixcbiAgICBcIkYxN1wiOiBcIjxGMTc+XCIsXG4gICAgXCJGMThcIjogXCI8RjE4PlwiLFxuICAgIFwiRjE5XCI6IFwiPEYxOT5cIixcbiAgICBcIkYyXCI6IFwiPEYyPlwiLFxuICAgIFwiRjIwXCI6IFwiPEYyMD5cIixcbiAgICBcIkYyMVwiOiBcIjxGMjE+XCIsXG4gICAgXCJGMjJcIjogXCI8RjIyPlwiLFxuICAgIFwiRjIzXCI6IFwiPEYyMz5cIixcbiAgICBcIkYyNFwiOiBcIjxGMjQ+XCIsXG4gICAgXCJGM1wiOiBcIjxGMz5cIixcbiAgICBcIkY0XCI6IFwiPEY0PlwiLFxuICAgIFwiRjVcIjogXCI8RjU+XCIsXG4gICAgXCJGNlwiOiBcIjxGNj5cIixcbiAgICBcIkY3XCI6IFwiPEY3PlwiLFxuICAgIFwiRjhcIjogXCI8Rjg+XCIsXG4gICAgXCJGOVwiOiBcIjxGOT5cIixcbiAgICBcIkhvbWVcIjogXCI8SG9tZT5cIixcbiAgICBcIlBhZ2VEb3duXCI6IFwiPFBhZ2VEb3duPlwiLFxuICAgIFwiUGFnZVVwXCI6IFwiPFBhZ2VVcD5cIixcbiAgICBcIlRhYlwiOiBcIjxUYWI+XCIsXG4gICAgXCJcXFxcXCI6IFwiPEJzbGFzaD5cIixcbiAgICBcInxcIjogXCI8QmFyPlwiLFxufTtcblxuY29uc3Qgbm9uTGl0ZXJhbFZpbUtleXMgPSBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZW50cmllcyhub25MaXRlcmFsS2V5cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKFt4LCB5XSkgPT4gW3ksIHhdKSk7XG5cbmNvbnN0IG5vbkxpdGVyYWxLZXlDb2Rlczoge1trZXk6IHN0cmluZ106IG51bWJlcn0gPSB7XG4gICAgXCJFbnRlclwiOiAgICAgIDEzLFxuICAgIFwiU3BhY2VcIjogICAgICAzMixcbiAgICBcIlRhYlwiOiAgICAgICAgOSxcbiAgICBcIkRlbGV0ZVwiOiAgICAgNDYsXG4gICAgXCJFbmRcIjogICAgICAgIDM1LFxuICAgIFwiSG9tZVwiOiAgICAgICAzNixcbiAgICBcIkluc2VydFwiOiAgICAgNDUsXG4gICAgXCJQYWdlRG93blwiOiAgIDM0LFxuICAgIFwiUGFnZVVwXCI6ICAgICAzMyxcbiAgICBcIkFycm93RG93blwiOiAgNDAsXG4gICAgXCJBcnJvd0xlZnRcIjogIDM3LFxuICAgIFwiQXJyb3dSaWdodFwiOiAzOSxcbiAgICBcIkFycm93VXBcIjogICAgMzgsXG4gICAgXCJFc2NhcGVcIjogICAgIDI3LFxufTtcblxuLy8gR2l2ZW4gYSBcInNwZWNpYWxcIiBrZXkgcmVwcmVzZW50YXRpb24gKGUuZy4gPEVudGVyPiBvciA8TS1sPiksIHJldHVybnMgYW5cbi8vIGFycmF5IG9mIHRocmVlIGphdmFzY3JpcHQga2V5ZXZlbnRzLCB0aGUgZmlyc3Qgb25lIHJlcHJlc2VudGluZyB0aGVcbi8vIGNvcnJlc3BvbmRpbmcga2V5ZG93biwgdGhlIHNlY29uZCBvbmUgYSBrZXlwcmVzcyBhbmQgdGhlIHRoaXJkIG9uZSBhIGtleXVwXG4vLyBldmVudC5cbmZ1bmN0aW9uIG1vZEtleVRvRXZlbnRzKGs6IHN0cmluZykge1xuICAgIGxldCBtb2RzID0gXCJcIjtcbiAgICBsZXQga2V5ID0gbm9uTGl0ZXJhbFZpbUtleXNba107XG4gICAgbGV0IGN0cmxLZXkgPSBmYWxzZTtcbiAgICBsZXQgYWx0S2V5ID0gZmFsc2U7XG4gICAgbGV0IHNoaWZ0S2V5ID0gZmFsc2U7XG4gICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGFyciA9IGsuc2xpY2UoMSwgLTEpLnNwbGl0KFwiLVwiKTtcbiAgICAgICAgbW9kcyA9IGFyclswXTtcbiAgICAgICAga2V5ID0gYXJyWzFdO1xuICAgICAgICBjdHJsS2V5ID0gL2MvaS50ZXN0KG1vZHMpO1xuICAgICAgICBhbHRLZXkgPSAvYS9pLnRlc3QobW9kcyk7XG4gICAgICAgIGNvbnN0IHNwZWNpYWxDaGFyID0gXCI8XCIgKyBrZXkgKyBcIj5cIjtcbiAgICAgICAgaWYgKG5vbkxpdGVyYWxWaW1LZXlzW3NwZWNpYWxDaGFyXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBrZXkgPSBub25MaXRlcmFsVmltS2V5c1tzcGVjaWFsQ2hhcl07XG4gICAgICAgICAgICBzaGlmdEtleSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2hpZnRLZXkgPSBrZXkgIT09IGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFNvbWUgcGFnZXMgcmVseSBvbiBrZXlDb2RlcyB0byBmaWd1cmUgb3V0IHdoYXQga2V5IHdhcyBwcmVzc2VkLiBUaGlzIGlzXG4gICAgLy8gYXdmdWwgYmVjYXVzZSBrZXljb2RlcyBhcmVuJ3QgZ3VhcmFudGVlZCB0byBiZSB0aGUgc2FtZSBhY3Jyb3NzXG4gICAgLy8gYnJvd3NlcnMvT1Mva2V5Ym9hcmQgbGF5b3V0cyBidXQgdHJ5IHRvIGRvIHRoZSByaWdodCB0aGluZyBhbnl3YXkuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2dsYWNhbWJyZS9maXJlbnZpbS9pc3N1ZXMvNzIzXG4gICAgbGV0IGtleUNvZGUgPSAwO1xuICAgIGlmICgvXlthLXpBLVowLTldJC8udGVzdChrZXkpKSB7XG4gICAgICAgIGtleUNvZGUgPSBrZXkuY2hhckNvZGVBdCgwKTtcbiAgICB9IGVsc2UgaWYgKG5vbkxpdGVyYWxLZXlDb2Rlc1trZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAga2V5Q29kZSA9IG5vbkxpdGVyYWxLZXlDb2Rlc1trZXldO1xuICAgIH1cbiAgICBjb25zdCBpbml0ID0geyBrZXksIGtleUNvZGUsIGN0cmxLZXksIGFsdEtleSwgc2hpZnRLZXksIGJ1YmJsZXM6IHRydWUgfTtcbiAgICByZXR1cm4gW1xuICAgICAgICBuZXcgS2V5Ym9hcmRFdmVudChcImtleWRvd25cIiwgaW5pdCksXG4gICAgICAgIG5ldyBLZXlib2FyZEV2ZW50KFwia2V5cHJlc3NcIiwgaW5pdCksXG4gICAgICAgIG5ldyBLZXlib2FyZEV2ZW50KFwia2V5dXBcIiwgaW5pdCksXG4gICAgXTtcbn1cblxuLy8gR2l2ZW4gYSBcInNpbXBsZVwiIGtleSAoZS5nLiBgYWAsIGAxYOKApiksIHJldHVybnMgYW4gYXJyYXkgb2YgdGhyZWUgamF2YXNjcmlwdFxuLy8gZXZlbnRzIHJlcHJlc2VudGluZyB0aGUgYWN0aW9uIG9mIHByZXNzaW5nIHRoZSBrZXkuXG5mdW5jdGlvbiBrZXlUb0V2ZW50cyhrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IHNoaWZ0S2V5ID0ga2V5ICE9PSBrZXkudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICByZXR1cm4gW1xuICAgICAgICBuZXcgS2V5Ym9hcmRFdmVudChcImtleWRvd25cIiwgIHsga2V5LCBzaGlmdEtleSwgYnViYmxlczogdHJ1ZSB9KSxcbiAgICAgICAgbmV3IEtleWJvYXJkRXZlbnQoXCJrZXlwcmVzc1wiLCB7IGtleSwgc2hpZnRLZXksIGJ1YmJsZXM6IHRydWUgfSksXG4gICAgICAgIG5ldyBLZXlib2FyZEV2ZW50KFwia2V5dXBcIiwgICAgeyBrZXksIHNoaWZ0S2V5LCBidWJibGVzOiB0cnVlIH0pLFxuICAgIF07XG59XG5cbi8vIEdpdmVuIGFuIGFycmF5IG9mIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBrZXlzIChlLmcuIFtcImFcIiwgXCI8RW50ZXI+XCIsIOKApl0pLFxuLy8gcmV0dXJucyBhbiBhcnJheSBvZiBqYXZhc2NyaXB0IGtleWJvYXJkIGV2ZW50cyB0aGF0IHNpbXVsYXRlIHRoZXNlIGtleXNcbi8vIGJlaW5nIHByZXNzZWQuXG5leHBvcnQgZnVuY3Rpb24ga2V5c1RvRXZlbnRzKGtleXM6IHN0cmluZ1tdKSB7XG4gICAgLy8gQ29kZSB0byBzcGxpdCBtb2Qga2V5cyBhbmQgbm9uLW1vZCBrZXlzOlxuICAgIC8vIGNvbnN0IGtleXMgPSBzdHIubWF0Y2goLyhbPD5dW148Pl0rWzw+XSl8KFtePD5dKykvZylcbiAgICAvLyBpZiAoa2V5cyA9PT0gbnVsbCkge1xuICAgIC8vICAgICByZXR1cm4gW107XG4gICAgLy8gfVxuICAgIHJldHVybiBrZXlzLm1hcCgoa2V5KSA9PiB7XG4gICAgICAgIGlmIChrZXlbMF0gPT09IFwiPFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9kS2V5VG9FdmVudHMoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ga2V5VG9FdmVudHMoa2V5KTtcbiAgICB9KS5mbGF0KCk7XG59XG5cbi8vIFR1cm5zIGEgbm9uLWxpdGVyYWwga2V5IChlLmcuIFwiRW50ZXJcIikgaW50byBhIHZpbS1lcXVpdmFsZW50IFwiPEVudGVyPlwiXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNsYXRlS2V5KGtleTogc3RyaW5nKSB7XG4gICAgaWYgKG5vbkxpdGVyYWxLZXlzW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbm9uTGl0ZXJhbEtleXNba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbn1cblxuLy8gQWRkIG1vZGlmaWVyIGBtb2RgIChgQWAsIGBDYCwgYFNg4oCmKSB0byBgdGV4dGAgKGEgdmltIGtleSBgYmAsIGA8RW50ZXI+YCxcbi8vIGA8Q1MteD5g4oCmKVxuZXhwb3J0IGZ1bmN0aW9uIGFkZE1vZGlmaWVyKG1vZDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcbiAgICBsZXQgbWF0Y2g7XG4gICAgbGV0IG1vZGlmaWVycyA9IFwiXCI7XG4gICAgbGV0IGtleSA9IFwiXCI7XG4gICAgaWYgKChtYXRjaCA9IHRleHQubWF0Y2goL148KFtBLVpdezEsNX0pLSguKyk+JC8pKSkge1xuICAgICAgICBtb2RpZmllcnMgPSBtYXRjaFsxXTtcbiAgICAgICAga2V5ID0gbWF0Y2hbMl07XG4gICAgfSBlbHNlIGlmICgobWF0Y2ggPSB0ZXh0Lm1hdGNoKC9ePCguKyk+JC8pKSkge1xuICAgICAgICBrZXkgPSBtYXRjaFsxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBrZXkgPSB0ZXh0O1xuICAgIH1cbiAgICByZXR1cm4gXCI8XCIgKyBtb2QgKyBtb2RpZmllcnMgKyBcIi1cIiArIGtleSArIFwiPlwiO1xufVxuIiwibGV0IGN1ckhvc3QgOiBzdHJpbmc7XG5cbi8vIENhbid0IGdldCBjb3ZlcmFnZSBmb3IgdGh1bmRlcmJpcmQuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKChicm93c2VyIGFzIGFueSkuY29tcG9zZVNjcmlwdHMgIT09IHVuZGVmaW5lZCB8fCBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID09PSBcImFib3V0OmJsYW5rP2NvbXBvc2VcIikge1xuICAgIGN1ckhvc3QgPSBcInRodW5kZXJiaXJkXCI7XG4vLyBDaHJvbWUgZG9lc24ndCBoYXZlIGEgXCJicm93c2VyXCIgb2JqZWN0LCBpbnN0ZWFkIGl0IHVzZXMgXCJjaHJvbWVcIi5cbn0gZWxzZSBpZiAod2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSBcIm1vei1leHRlbnNpb246XCIpIHtcbiAgICBjdXJIb3N0ID0gXCJmaXJlZm94XCI7XG59IGVsc2UgaWYgKHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gXCJjaHJvbWUtZXh0ZW5zaW9uOlwiKSB7XG4gICAgY3VySG9zdCA9IFwiY2hyb21lXCI7XG59XG5cbi8vIE9ubHkgdXNhYmxlIGluIGJhY2tncm91bmQgc2NyaXB0IVxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2hyb21lKCkge1xuICAgIC8vIENhbid0IGNvdmVyIGVycm9yIGNvbmRpdGlvblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKGN1ckhvc3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcIlVzZWQgaXNDaHJvbWUgaW4gY29udGVudCBzY3JpcHQhXCIpO1xuICAgIH1cbiAgICByZXR1cm4gY3VySG9zdCA9PT0gXCJjaHJvbWVcIjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1RodW5kZXJiaXJkKCkge1xuICAgIC8vIENhbid0IGNvdmVyIGVycm9yIGNvbmRpdGlvblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKGN1ckhvc3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcIlVzZWQgaXNUaHVuZGVyYmlyZCBpbiBjb250ZW50IHNjcmlwdCFcIik7XG4gICAgfVxuICAgIHJldHVybiBjdXJIb3N0ID09PSBcInRodW5kZXJiaXJkXCI7XG59XG5cbi8vIFJ1bnMgQ09ERSBpbiB0aGUgcGFnZSdzIGNvbnRleHQgYnkgc2V0dGluZyB1cCBhIGN1c3RvbSBldmVudCBsaXN0ZW5lcixcbi8vIGVtYmVkZGluZyBhIHNjcmlwdCBlbGVtZW50IHRoYXQgcnVucyB0aGUgcGllY2Ugb2YgY29kZSBhbmQgZW1pdHMgaXRzIHJlc3VsdFxuLy8gYXMgYW4gZXZlbnQuXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZUluUGFnZShjb2RlOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgIGNvbnN0IGV2ZW50SWQgPSAobmV3IFVSTChicm93c2VyLnJ1bnRpbWUuZ2V0VVJMKFwiXCIpKSkuaG9zdG5hbWUgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgICBzY3JpcHQuaW5uZXJIVE1MID0gYChhc3luYyAoZXZJZCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0ICR7Y29kZX07XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2SWQsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChldklkLCB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogeyBzdWNjZXNzOiBmYWxzZSwgcmVhc29uOiBlIH0sXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSgke0pTT04uc3RyaW5naWZ5KGV2ZW50SWQpfSlgO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudElkLCAoeyBkZXRhaWwgfTogYW55KSA9PiB7XG4gICAgICAgICAgICBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgaWYgKGRldGFpbC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZGV0YWlsLnJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KGRldGFpbC5yZWFzb24pO1xuICAgICAgICB9LCB7IG9uY2U6IHRydWUgfSk7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICB9KTtcbn1cblxuLy8gVmFyaW91cyBmaWx0ZXJzIHRoYXQgYXJlIHVzZWQgdG8gY2hhbmdlIHRoZSBhcHBlYXJhbmNlIG9mIHRoZSBCcm93c2VyQWN0aW9uXG4vLyBpY29uLlxuY29uc3Qgc3ZncGF0aCA9IFwiZmlyZW52aW0uc3ZnXCI7XG5jb25zdCB0cmFuc2Zvcm1hdGlvbnMgPSB7XG4gICAgZGlzYWJsZWQ6IChpbWc6IFVpbnQ4Q2xhbXBlZEFycmF5KSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1nLmxlbmd0aDsgaSArPSA0KSB7XG4gICAgICAgICAgICAvLyBTa2lwIHRyYW5zcGFyZW50IHBpeGVsc1xuICAgICAgICAgICAgaWYgKGltZ1tpICsgM10gPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG1lYW4gPSBNYXRoLmZsb29yKChpbWdbaV0gKyBpbWdbaSArIDFdICsgaW1nW2kgKyAyXSkgLyAzKTtcbiAgICAgICAgICAgIGltZ1tpXSA9IG1lYW47XG4gICAgICAgICAgICBpbWdbaSArIDFdID0gbWVhbjtcbiAgICAgICAgICAgIGltZ1tpICsgMl0gPSBtZWFuO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBlcnJvcjogKGltZzogVWludDhDbGFtcGVkQXJyYXkpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWcubGVuZ3RoOyBpICs9IDQpIHtcbiAgICAgICAgICAgIC8vIFR1cm4gdHJhbnNwYXJlbnQgcGl4ZWxzIHJlZFxuICAgICAgICAgICAgaWYgKGltZ1tpICsgM10gPT09IDApIHtcbiAgICAgICAgICAgICAgICBpbWdbaV0gPSAyNTU7XG4gICAgICAgICAgICAgICAgaW1nW2kgKyAzXSA9IDI1NTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgbm9ybWFsOiAoKF9pbWc6IFVpbnQ4Q2xhbXBlZEFycmF5KSA9PiAodW5kZWZpbmVkIGFzIG5ldmVyKSksXG4gICAgbm90aWZpY2F0aW9uOiAoaW1nOiBVaW50OENsYW1wZWRBcnJheSkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltZy5sZW5ndGg7IGkgKz0gNCkge1xuICAgICAgICAgICAgLy8gVHVybiB0cmFuc3BhcmVudCBwaXhlbHMgeWVsbG93XG4gICAgICAgICAgICBpZiAoaW1nW2kgKyAzXSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGltZ1tpXSA9IDI1NTtcbiAgICAgICAgICAgICAgICBpbWdbaSArIDFdID0gMjU1O1xuICAgICAgICAgICAgICAgIGltZ1tpICsgM10gPSAyNTU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufTtcblxuZXhwb3J0IHR5cGUgSWNvbktpbmQgPSBrZXlvZiB0eXBlb2YgdHJhbnNmb3JtYXRpb25zO1xuXG4vLyBUYWtlcyBhbiBpY29uIGtpbmQgYW5kIGRpbWVuc2lvbnMgYXMgcGFyYW1ldGVyLCBkcmF3cyB0aGF0IHRvIGEgY2FudmFzIGFuZFxuLy8gcmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlIHJlc29sdmVkIHdpdGggdGhlIGNhbnZhcycgaW1hZ2UgZGF0YS5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJY29uSW1hZ2VEYXRhKGtpbmQ6IEljb25LaW5kLCB3aWR0aCA9IDMyLCBoZWlnaHQgPSAzMikge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2Uod2lkdGgsIGhlaWdodCk7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IGltZy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgY29uc3QgaWQgPSBjdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB0cmFuc2Zvcm1hdGlvbnNba2luZF0oaWQuZGF0YSk7XG4gICAgICAgIHJlc29sdmUoaWQpO1xuICAgIH0pKTtcbiAgICBpbWcuc3JjID0gc3ZncGF0aDtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBHaXZlbiBhIHVybCBhbmQgYSBzZWxlY3RvciwgdHJpZXMgdG8gY29tcHV0ZSBhIG5hbWUgdGhhdCB3aWxsIGJlIHVuaXF1ZSxcbi8vIHNob3J0IGFuZCByZWFkYWJsZSBmb3IgdGhlIHVzZXIuXG5leHBvcnQgZnVuY3Rpb24gdG9GaWxlTmFtZShmb3JtYXRTdHJpbmc6IHN0cmluZywgdXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcsIGxhbmd1YWdlOiBzdHJpbmcpIHtcbiAgICBsZXQgcGFyc2VkVVJMOiB7IGhvc3RuYW1lOiBzdHJpbmcsIHBhdGhuYW1lOiBzdHJpbmcgfTtcbiAgICB0cnkge1xuICAgICAgICBwYXJzZWRVUkwgPSBuZXcgVVJMKHVybCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBPbmx5IGhhcHBlbnMgd2l0aCB0aHVuZGVyYmlyZCwgd2hlcmUgd2UgY2FuJ3QgZ2V0IGNvdmVyYWdlXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIHBhcnNlZFVSTCA9IHsgaG9zdG5hbWU6ICd0aHVuZGVyYmlyZCcsIHBhdGhuYW1lOiAnbWFpbCcgfTtcbiAgICB9XG5cbiAgICBjb25zdCBzYW5pdGl6ZSA9IChzOiBzdHJpbmcpID0+IChzLm1hdGNoKC9bYS16QS1aMC05XSsvZykgfHwgW10pLmpvaW4oXCItXCIpO1xuXG4gICAgY29uc3QgZXhwYW5kID0gKHBhdHRlcm46IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBub0JyYWNrZXRzID0gcGF0dGVybi5zbGljZSgxLCAtMSk7XG4gICAgICAgIGNvbnN0IFtzeW1ib2wsIGxlbmd0aF0gPSBub0JyYWNrZXRzLnNwbGl0KFwiJVwiKTtcbiAgICAgICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICAgICAgc3dpdGNoIChzeW1ib2wpIHtcbiAgICAgICAgICAgIGNhc2UgXCJob3N0bmFtZVwiOiB2YWx1ZSA9IHBhcnNlZFVSTC5ob3N0bmFtZTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwicGF0aG5hbWVcIjogdmFsdWUgPSBzYW5pdGl6ZShwYXJzZWRVUkwucGF0aG5hbWUpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJzZWxlY3RvclwiOiB2YWx1ZSA9IHNhbml0aXplKGlkLnJlcGxhY2UoLzpudGgtb2YtdHlwZS9nLCBcIlwiKSk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInRpbWVzdGFtcFwiOiB2YWx1ZSA9IHNhbml0aXplKChuZXcgRGF0ZSgpKS50b0lTT1N0cmluZygpKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZXh0ZW5zaW9uXCI6IHZhbHVlID0gbGFuZ3VhZ2VUb0V4dGVuc2lvbnMobGFuZ3VhZ2UpOyBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6IGNvbnNvbGUuZXJyb3IoYFVucmVjb2duaXplZCBmaWxlbmFtZSBwYXR0ZXJuOiAke3BhdHRlcm59YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlLnNsaWNlKC1sZW5ndGgpO1xuICAgIH07XG5cbiAgICBsZXQgcmVzdWx0ID0gZm9ybWF0U3RyaW5nO1xuICAgIGNvbnN0IG1hdGNoZXMgPSBmb3JtYXRTdHJpbmcubWF0Y2goL3tbXn1dKn0vZyk7XG4gICAgaWYgKG1hdGNoZXMgIT09IG51bGwpIHtcbiAgICAgICAgZm9yIChjb25zdCBtYXRjaCBvZiBtYXRjaGVzLmZpbHRlcihzID0+IHMgIT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKG1hdGNoLCBleHBhbmQobWF0Y2gpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBHaXZlbiBhIGxhbmd1YWdlIG5hbWUsIHJldHVybnMgYSBmaWxlbmFtZSBleHRlbnNpb24uIENhbiByZXR1cm4gdW5kZWZpbmVkLlxuZXhwb3J0IGZ1bmN0aW9uIGxhbmd1YWdlVG9FeHRlbnNpb25zKGxhbmd1YWdlOiBzdHJpbmcpIHtcbiAgICAvLyBpZiAobGFuZ3VhZ2UgPT09IHVuZGVmaW5lZCB8fCBsYW5ndWFnZSA9PT0gbnVsbCkge1xuICAgIC8vICAgICBsYW5ndWFnZSA9IFwiXCI7XG4gICAgLy8gfVxuICAgIC8vIGNvbnN0IGxhbmcgPSBsYW5ndWFnZS50b0xvd2VyQ2FzZSgpO1xuICAgIC8vIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgLy8gc3dpdGNoIChsYW5nKSB7XG4gICAgLy8gICAgIGNhc2UgXCJhcGxcIjogICAgICAgICAgICAgIHJldHVybiBcImFwbFwiO1xuICAgIC8vICAgICBjYXNlIFwiYnJhaW5mdWNrXCI6ICAgICAgICByZXR1cm4gXCJiZlwiO1xuICAgIC8vICAgICBjYXNlIFwiY1wiOiAgICAgICAgICAgICAgICByZXR1cm4gXCJjXCI7XG4gICAgLy8gICAgIGNhc2UgXCJjI1wiOiAgICAgICAgICAgICAgIHJldHVybiBcImNzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJjKytcIjogICAgICAgICAgICAgIHJldHVybiBcImNwcFwiO1xuICAgIC8vICAgICBjYXNlIFwiY2V5bG9uXCI6ICAgICAgICAgICByZXR1cm4gXCJjZXlsb25cIjtcbiAgICAvLyAgICAgY2FzZSBcImNsaWtlXCI6ICAgICAgICAgICAgcmV0dXJuIFwiY1wiO1xuICAgIC8vICAgICBjYXNlIFwiY2xvanVyZVwiOiAgICAgICAgICByZXR1cm4gXCJjbGpcIjtcbiAgICAvLyAgICAgY2FzZSBcImNtYWtlXCI6ICAgICAgICAgICAgcmV0dXJuIFwiLmNtYWtlXCI7XG4gICAgLy8gICAgIGNhc2UgXCJjb2JvbFwiOiAgICAgICAgICAgIHJldHVybiBcImNibFwiO1xuICAgIC8vICAgICBjYXNlIFwiY29mZmVlc2NyaXB0XCI6ICAgICByZXR1cm4gXCJjb2ZmZWVcIjtcbiAgICAvLyAgICAgY2FzZSBcImNvbW1vbmxpc3BcIjogICAgICByZXR1cm4gXCJsaXNwXCI7XG4gICAgLy8gICAgIGNhc2UgXCJjcnlzdGFsXCI6ICAgICAgICAgIHJldHVybiBcImNyXCI7XG4gICAgLy8gICAgIGNhc2UgXCJjc3NcIjogICAgICAgICAgICAgIHJldHVybiBcImNzc1wiO1xuICAgIC8vICAgICBjYXNlIFwiY3l0aG9uXCI6ICAgICAgICAgICByZXR1cm4gXCJweVwiO1xuICAgIC8vICAgICBjYXNlIFwiZFwiOiAgICAgICAgICAgICAgICByZXR1cm4gXCJkXCI7XG4gICAgLy8gICAgIGNhc2UgXCJkYXJ0XCI6ICAgICAgICAgICAgIHJldHVybiBcImRhcnRcIjtcbiAgICAvLyAgICAgY2FzZSBcImRpZmZcIjogICAgICAgICAgICAgcmV0dXJuIFwiZGlmZlwiO1xuICAgIC8vICAgICBjYXNlIFwiZG9ja2VyZmlsZVwiOiAgICAgICByZXR1cm4gXCJkb2NrZXJmaWxlXCI7XG4gICAgLy8gICAgIGNhc2UgXCJkdGRcIjogICAgICAgICAgICAgIHJldHVybiBcImR0ZFwiO1xuICAgIC8vICAgICBjYXNlIFwiZHlsYW5cIjogICAgICAgICAgICByZXR1cm4gXCJkeWxhblwiO1xuICAgIC8vICAgICAvLyBFaWZmZWwgd2FzIHRoZXJlIGZpcnN0IGJ1dCBlbGl4aXIgc2VlbXMgbW9yZSBsaWtlbHlcbiAgICAvLyAgICAgLy8gY2FzZSBcImVpZmZlbFwiOiAgICAgICAgICAgcmV0dXJuIFwiZVwiO1xuICAgIC8vICAgICBjYXNlIFwiZWxpeGlyXCI6ICAgICAgICAgICByZXR1cm4gXCJlXCI7XG4gICAgLy8gICAgIGNhc2UgXCJlbG1cIjogICAgICAgICAgICAgIHJldHVybiBcImVsbVwiO1xuICAgIC8vICAgICBjYXNlIFwiZXJsYW5nXCI6ICAgICAgICAgICByZXR1cm4gXCJlcmxcIjtcbiAgICAvLyAgICAgY2FzZSBcImYjXCI6ICAgICAgICAgICAgICAgcmV0dXJuIFwiZnNcIjtcbiAgICAvLyAgICAgY2FzZSBcImZhY3RvclwiOiAgICAgICAgICAgcmV0dXJuIFwiZmFjdG9yXCI7XG4gICAgLy8gICAgIGNhc2UgXCJmb3J0aFwiOiAgICAgICAgICAgIHJldHVybiBcImZ0aFwiO1xuICAgIC8vICAgICBjYXNlIFwiZm9ydHJhblwiOiAgICAgICAgICByZXR1cm4gXCJmOTBcIjtcbiAgICAvLyAgICAgY2FzZSBcImdhc1wiOiAgICAgICAgICAgICAgcmV0dXJuIFwiYXNtXCI7XG4gICAgLy8gICAgIGNhc2UgXCJnb1wiOiAgICAgICAgICAgICAgIHJldHVybiBcImdvXCI7XG4gICAgLy8gICAgIC8vIEdGTTogQ29kZU1pcnJvcidzIGdpdGh1Yi1mbGF2b3JlZCBtYXJrZG93blxuICAgIC8vICAgICBjYXNlIFwiZ2ZtXCI6ICAgICAgICAgICAgICByZXR1cm4gXCJtZFwiO1xuICAgIC8vICAgICBjYXNlIFwiZ3Jvb3Z5XCI6ICAgICAgICAgICByZXR1cm4gXCJncm9vdnlcIjtcbiAgICAvLyAgICAgY2FzZSBcImhhbWxcIjogICAgICAgICAgICAgcmV0dXJuIFwiaGFtbFwiO1xuICAgIC8vICAgICBjYXNlIFwiaGFuZGxlYmFyc1wiOiAgICAgICByZXR1cm4gXCJoYnNcIjtcbiAgICAvLyAgICAgY2FzZSBcImhhc2tlbGxcIjogICAgICAgICAgcmV0dXJuIFwiaHNcIjtcbiAgICAvLyAgICAgY2FzZSBcImhheGVcIjogICAgICAgICAgICAgcmV0dXJuIFwiaHhcIjtcbiAgICAvLyAgICAgY2FzZSBcImh0bWxcIjogICAgICAgICAgICAgcmV0dXJuIFwiaHRtbFwiO1xuICAgIC8vICAgICBjYXNlIFwiaHRtbGVtYmVkZGVkXCI6ICAgICByZXR1cm4gXCJodG1sXCI7XG4gICAgLy8gICAgIGNhc2UgXCJodG1sbWl4ZWRcIjogICAgICAgIHJldHVybiBcImh0bWxcIjtcbiAgICAvLyAgICAgY2FzZSBcImlweXRob25cIjogICAgICAgICAgcmV0dXJuIFwicHlcIjtcbiAgICAvLyAgICAgY2FzZSBcImlweXRob25mbVwiOiAgICAgICAgcmV0dXJuIFwibWRcIjtcbiAgICAvLyAgICAgY2FzZSBcImphdmFcIjogICAgICAgICAgICAgcmV0dXJuIFwiamF2YVwiO1xuICAgIC8vICAgICBjYXNlIFwiamF2YXNjcmlwdFwiOiAgICAgICByZXR1cm4gXCJqc1wiO1xuICAgIC8vICAgICBjYXNlIFwiamluamEyXCI6ICAgICAgICAgICByZXR1cm4gXCJqaW5qYVwiO1xuICAgIC8vICAgICBjYXNlIFwianVsaWFcIjogICAgICAgICAgICByZXR1cm4gXCJqbFwiO1xuICAgIC8vICAgICBjYXNlIFwianN4XCI6ICAgICAgICAgICAgICByZXR1cm4gXCJqc3hcIjtcbiAgICAvLyAgICAgY2FzZSBcImtvdGxpblwiOiAgICAgICAgICAgcmV0dXJuIFwia3RcIjtcbiAgICAvLyAgICAgY2FzZSBcImxhdGV4XCI6ICAgICAgICAgICAgcmV0dXJuIFwibGF0ZXhcIjtcbiAgICAvLyAgICAgY2FzZSBcImxlc3NcIjogICAgICAgICAgICAgcmV0dXJuIFwibGVzc1wiO1xuICAgIC8vICAgICBjYXNlIFwibHVhXCI6ICAgICAgICAgICAgICByZXR1cm4gXCJsdWFcIjtcbiAgICAvLyAgICAgY2FzZSBcIm1hcmtkb3duXCI6ICAgICAgICAgcmV0dXJuIFwibWRcIjtcbiAgICAvLyAgICAgY2FzZSBcIm1sbGlrZVwiOiAgICAgICAgICAgIHJldHVybiBcIm1sXCI7XG4gICAgLy8gICAgIGNhc2UgXCJvY2FtbFwiOiAgICAgICAgICAgIHJldHVybiBcIm1sXCI7XG4gICAgLy8gICAgIGNhc2UgXCJvY3RhdmVcIjogICAgICAgICAgIHJldHVybiBcIm1cIjtcbiAgICAvLyAgICAgY2FzZSBcInBhc2NhbFwiOiAgICAgICAgICAgcmV0dXJuIFwicGFzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJwZXJsXCI6ICAgICAgICAgICAgIHJldHVybiBcInBsXCI7XG4gICAgLy8gICAgIGNhc2UgXCJwaHBcIjogICAgICAgICAgICAgIHJldHVybiBcInBocFwiO1xuICAgIC8vICAgICBjYXNlIFwicG93ZXJzaGVsbFwiOiAgICAgICByZXR1cm4gXCJwczFcIjtcbiAgICAvLyAgICAgY2FzZSBcInB5dGhvblwiOiAgICAgICAgICAgcmV0dXJuIFwicHlcIjtcbiAgICAvLyAgICAgY2FzZSBcInJcIjogICAgICAgICAgICAgICAgcmV0dXJuIFwiclwiO1xuICAgIC8vICAgICBjYXNlIFwicnN0XCI6ICAgICAgICAgICAgICByZXR1cm4gXCJyc3RcIjtcbiAgICAvLyAgICAgY2FzZSBcInJ1YnlcIjogICAgICAgICAgICAgcmV0dXJuIFwicnVieVwiO1xuICAgIC8vICAgICBjYXNlIFwicnVzdFwiOiAgICAgICAgICAgICByZXR1cm4gXCJyc1wiO1xuICAgIC8vICAgICBjYXNlIFwic2FzXCI6ICAgICAgICAgICAgICByZXR1cm4gXCJzYXNcIjtcbiAgICAvLyAgICAgY2FzZSBcInNhc3NcIjogICAgICAgICAgICAgcmV0dXJuIFwic2Fzc1wiO1xuICAgIC8vICAgICBjYXNlIFwic2NhbGFcIjogICAgICAgICAgICByZXR1cm4gXCJzY2FsYVwiO1xuICAgIC8vICAgICBjYXNlIFwic2NoZW1lXCI6ICAgICAgICAgICByZXR1cm4gXCJzY21cIjtcbiAgICAvLyAgICAgY2FzZSBcInNjc3NcIjogICAgICAgICAgICAgcmV0dXJuIFwic2Nzc1wiO1xuICAgIC8vICAgICBjYXNlIFwic21hbGx0YWxrXCI6ICAgICAgICByZXR1cm4gXCJzdFwiO1xuICAgIC8vICAgICBjYXNlIFwic2hlbGxcIjogICAgICAgICAgICByZXR1cm4gXCJzaFwiO1xuICAgIC8vICAgICBjYXNlIFwic3FsXCI6ICAgICAgICAgICAgICByZXR1cm4gXCJzcWxcIjtcbiAgICAvLyAgICAgY2FzZSBcInN0ZXhcIjogICAgICAgICAgICAgcmV0dXJuIFwibGF0ZXhcIjtcbiAgICAvLyAgICAgY2FzZSBcInN3aWZ0XCI6ICAgICAgICAgICAgcmV0dXJuIFwic3dpZnRcIjtcbiAgICAvLyAgICAgY2FzZSBcInRjbFwiOiAgICAgICAgICAgICAgcmV0dXJuIFwidGNsXCI7XG4gICAgLy8gICAgIGNhc2UgXCJ0b21sXCI6ICAgICAgICAgICAgIHJldHVybiBcInRvbWxcIjtcbiAgICAvLyAgICAgY2FzZSBcInR3aWdcIjogICAgICAgICAgICAgcmV0dXJuIFwidHdpZ1wiO1xuICAgIC8vICAgICBjYXNlIFwidHlwZXNjcmlwdFwiOiAgICAgICByZXR1cm4gXCJ0c1wiO1xuICAgIC8vICAgICBjYXNlIFwidmJcIjogICAgICAgICAgICAgICByZXR1cm4gXCJ2YlwiO1xuICAgIC8vICAgICBjYXNlIFwidmJzY3JpcHRcIjogICAgICAgICByZXR1cm4gXCJ2YnNcIjtcbiAgICAvLyAgICAgY2FzZSBcInZlcmlsb2dcIjogICAgICAgICAgcmV0dXJuIFwic3ZcIjtcbiAgICAvLyAgICAgY2FzZSBcInZoZGxcIjogICAgICAgICAgICAgcmV0dXJuIFwidmhkbFwiO1xuICAgIC8vICAgICBjYXNlIFwieG1sXCI6ICAgICAgICAgICAgICByZXR1cm4gXCJ4bWxcIjtcbiAgICAvLyAgICAgY2FzZSBcInlhbWxcIjogICAgICAgICAgICAgcmV0dXJuIFwieWFtbFwiO1xuICAgIC8vICAgICBjYXNlIFwiejgwXCI6ICAgICAgICAgICAgICByZXR1cm4gXCJ6OGFcIjtcbiAgICAvLyB9XG4gICAgcmV0dXJuIFwidHh0XCI7XG59XG5cbi8vIE1ha2UgdHNsaW50IGhhcHB5XG5jb25zdCBmb250RmFtaWx5ID0gXCJmb250LWZhbWlseVwiO1xuXG4vLyBDYW4ndCBiZSB0ZXN0ZWQgZTJlIDovXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2luZ2xlR3VpZm9udChndWlmb250OiBzdHJpbmcsIGRlZmF1bHRzOiBhbnkpIHtcbiAgICBjb25zdCBvcHRpb25zID0gZ3VpZm9udC5zcGxpdChcIjpcIik7XG4gICAgY29uc3QgcmVzdWx0ID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMpO1xuICAgIGlmICgvXlthLXpBLVowLTldKyQvLnRlc3Qob3B0aW9uc1swXSkpIHtcbiAgICAgICAgcmVzdWx0W2ZvbnRGYW1pbHldID0gb3B0aW9uc1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbZm9udEZhbWlseV0gPSBKU09OLnN0cmluZ2lmeShvcHRpb25zWzBdKTtcbiAgICB9XG4gICAgaWYgKGRlZmF1bHRzW2ZvbnRGYW1pbHldKSB7XG4gICAgICAgIHJlc3VsdFtmb250RmFtaWx5XSArPSBgLCAke2RlZmF1bHRzW2ZvbnRGYW1pbHldfWA7XG4gICAgfVxuICAgIHJldHVybiBvcHRpb25zLnNsaWNlKDEpLnJlZHVjZSgoYWNjLCBvcHRpb24pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAob3B0aW9uWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcImhcIjpcbiAgICAgICAgICAgICAgICAgICAgYWNjW1wiZm9udC1zaXplXCJdID0gYCR7b3B0aW9uLnNsaWNlKDEpfXB0YDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImJcIjpcbiAgICAgICAgICAgICAgICAgICAgYWNjW1wiZm9udC13ZWlnaHRcIl0gPSBcImJvbGRcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImlcIjpcbiAgICAgICAgICAgICAgICAgICAgYWNjW1wiZm9udC1zdHlsZVwiXSA9IFwiaXRhbGljXCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ1XCI6XG4gICAgICAgICAgICAgICAgICAgIGFjY1tcInRleHQtZGVjb3JhdGlvblwiXSA9IFwidW5kZXJsaW5lXCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJzXCI6XG4gICAgICAgICAgICAgICAgICAgIGFjY1tcInRleHQtZGVjb3JhdGlvblwiXSA9IFwibGluZS10aHJvdWdoXCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ3XCI6IC8vIENhbid0IHNldCBmb250IHdpZHRoLiBXb3VsZCBoYXZlIHRvIGFkanVzdCBjZWxsIHdpZHRoLlxuICAgICAgICAgICAgICAgIGNhc2UgXCJjXCI6IC8vIENhbid0IHNldCBjaGFyYWN0ZXIgc2V0XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgcmVzdWx0IGFzIGFueSk7XG59O1xuXG4vLyBQYXJzZXMgYSBndWlmb250IGRlY2xhcmF0aW9uIGFzIGRlc2NyaWJlZCBpbiBgOmggRTI0NGBcbi8vIGRlZmF1bHRzOiBkZWZhdWx0IHZhbHVlIGZvciBlYWNoIG9mLlxuLy8gQ2FuJ3QgYmUgdGVzdGVkIGUyZSA6L1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUd1aWZvbnQoZ3VpZm9udDogc3RyaW5nLCBkZWZhdWx0czogYW55KSB7XG4gICAgY29uc3QgZm9udHMgPSBndWlmb250LnNwbGl0KFwiLFwiKS5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIGZvbnRzLnJlZHVjZSgoYWNjLCBjdXIpID0+IHBhcnNlU2luZ2xlR3VpZm9udChjdXIsIGFjYyksIGRlZmF1bHRzKTtcbn1cblxuLy8gQ29tcHV0ZXMgYSB1bmlxdWUgc2VsZWN0b3IgZm9yIGl0cyBhcmd1bWVudC5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlU2VsZWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICBmdW5jdGlvbiB1bmlxdWVTZWxlY3RvcihlOiBIVE1MRWxlbWVudCk6IHN0cmluZyB7XG4gICAgICAgIC8vIE9ubHkgbWF0Y2hpbmcgYWxwaGFudW1lcmljIHNlbGVjdG9ycyBiZWNhdXNlIG90aGVycyBjaGFycyBtaWdodCBoYXZlIHNwZWNpYWwgbWVhbmluZyBpbiBDU1NcbiAgICAgICAgaWYgKGUuaWQgJiYgZS5pZC5tYXRjaChcIl5bYS16QS1aMC05Xy1dKyRcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gZS50YWdOYW1lICsgYFtpZD1cIiR7ZS5pZH1cIl1gO1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoaWQpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIHRoZSB0b3Agb2YgdGhlIGRvY3VtZW50XG4gICAgICAgIGlmICghZS5wYXJlbnRFbGVtZW50KSB7IHJldHVybiBcIkhUTUxcIjsgfVxuICAgICAgICAvLyBDb21wdXRlIHRoZSBwb3NpdGlvbiBvZiB0aGUgZWxlbWVudFxuICAgICAgICBjb25zdCBpbmRleCA9XG4gICAgICAgICAgICBBcnJheS5mcm9tKGUucGFyZW50RWxlbWVudC5jaGlsZHJlbilcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGNoaWxkID0+IGNoaWxkLnRhZ05hbWUgPT09IGUudGFnTmFtZSlcbiAgICAgICAgICAgICAgICAuaW5kZXhPZihlKSArIDE7XG4gICAgICAgIHJldHVybiBgJHt1bmlxdWVTZWxlY3RvcihlLnBhcmVudEVsZW1lbnQpfSA+ICR7ZS50YWdOYW1lfTpudGgtb2YtdHlwZSgke2luZGV4fSlgO1xuICAgIH1cbiAgICByZXR1cm4gdW5pcXVlU2VsZWN0b3IoZWxlbWVudCk7XG59XG5cbi8vIFR1cm5zIGEgbnVtYmVyIGludG8gaXRzIGhhc2grNiBudW1iZXIgaGV4YWRlY2ltYWwgcmVwcmVzZW50YXRpb24uXG5leHBvcnQgZnVuY3Rpb24gdG9IZXhDc3MobjogbnVtYmVyKSB7XG4gICAgaWYgKG4gPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBzdHIgPSBuLnRvU3RyaW5nKDE2KTtcbiAgICAvLyBQYWQgd2l0aCBsZWFkaW5nIHplcm9zXG4gICAgcmV0dXJuIFwiI1wiICsgKG5ldyBBcnJheSg2IC0gc3RyLmxlbmd0aCkpLmZpbGwoXCIwXCIpLmpvaW4oXCJcIikgKyBzdHI7XG59XG5cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgS2V5ZG93bkhhbmRsZXIgfSBmcm9tIFwiLi9LZXlIYW5kbGVyXCI7XG5pbXBvcnQgeyBjb25mUmVhZHksIGdldEdsb2JhbENvbmYsIEdsb2JhbFNldHRpbmdzIH0gZnJvbSBcIi4vdXRpbHMvY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgc2V0dXBJbnB1dCB9IGZyb20gXCIuL2lucHV0XCI7XG5pbXBvcnQgeyBQYWdlRXZlbnRFbWl0dGVyIH0gZnJvbSBcIi4vcGFnZVwiO1xuXG5mdW5jdGlvbiBwcmludCAoLi4uYXJnczogYW55W10pIHtcbiAgICByZXR1cm4gYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgYXJnczogWyhuZXcgRXJyb3IoKSkuc3RhY2sucmVwbGFjZSgvQG1vei1leHRlbnNpb246XFwvXFwvW14vXSovZywgXCJcIiksIGFyZ3NdLFxuICAgICAgICBmdW5jTmFtZTogW1wiY29uc29sZVwiLCBcImxvZ1wiXSxcbiAgICB9KTtcbn1cblxud2luZG93LmNvbnNvbGUubG9nID0gcHJpbnQ7XG53aW5kb3cuY29uc29sZS5lcnJvciA9IHByaW50O1xuXG4vLyBNYWtlIGNhbnZhcyBzaXplIG9mIHdpbmRvd1xuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbmNhbnZhcy5pZCA9IFwiY2FudmFzXCI7XG5jYW52YXMub25jb250ZXh0bWVudSA9ICgpID0+IGZhbHNlO1xuY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuY2FudmFzLnN0eWxlLnRvcCA9IFwiMHB4XCI7XG5jYW52YXMuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG5cbmNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuc3R5bGUuaW5uZXJUZXh0ID0gYFxuaHRtbCwgYm9keSB7XG4gICAgLyogSGlkZSBjYXJldCwgd2hpY2ggc29tZXRpbWVzIGFwcGVhcnMgb3ZlciBjYW52YXMgKi9cbiAgICBjYXJldC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAvKiBIaWRlIHNjcm9sbGJhcnMgd2hlbiBlbWFpbCBpcyBsb25nZXIgdGhhbiB3aW5kb3cgKi9cbiAgICBvdmVyZmxvdzogaGlkZGVuICFpbXBvcnRhbnQ7XG59XG5ib2R5ID4gKjpub3QoY2FudmFzKSB7XG4gICAgLyogSGlkZSBlbWFpbCBjb250ZW50LCB1c2VmdWwgd2hlbiBlbWFpbCBpcyBsb25nZXIgdGhhbiBjYW52YXMgYW5kICovXG4gICAgLyogY2FudmFzIHNob3J0ZXIgdGhhbiB3aW5kb3cgKi9cbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG59XG5gLnJlcGxhY2UoL1xcbi9nLCBcIlwiKTtcbmRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXG5jb25zdCBjb25uZWN0aW9uUHJvbWlzZSA9IGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7IGZ1bmNOYW1lOiBbXCJnZXROZW92aW1JbnN0YW5jZVwiXSB9KTtcblxuY2xhc3MgVGh1bmRlcmJpcmRQYWdlRXZlbnRFbWl0dGVyIGV4dGVuZHMgUGFnZUV2ZW50RW1pdHRlciB7XG4gICAgcHJpdmF0ZSByZXNpemVDb3VudCA9IDA7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGNvbnN0IG9uUmVzaXplID0gKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzaXplQ291bnQgKz0gMTtcbiAgICAgICAgICAgIHRoaXMuZW1pdChcInJlc2l6ZVwiLCBbdGhpcy5yZXNpemVDb3VudCwgd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodF0pO1xuICAgICAgICB9KS5iaW5kKHRoaXMpXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uUmVzaXplKTtcbiAgICAgICAgLy8gV2UgbmVlZCB0byB0cmlnZ2VyIGEgcmVzaXplIG9uIHN0YXJ0dXAgYmVjYXVzZSBmb3Igc29tZSByZWFzb24gdGhlXG4gICAgICAgIC8vIHdpbmRvdyBtaWdodCBiZSAxcHggd2lkZSB3aGVuIHRoZSBjb21wb3NlIHNjcmlwdCBpcyBjcmVhdGVkLlxuICAgICAgICBzZXRUaW1lb3V0KG9uUmVzaXplLCAxMDApO1xuICAgIH1cbiAgICBhc3luYyBldmFsSW5QYWdlKGpzOiBzdHJpbmcpIHsgcmV0dXJuIGV2YWwoanMpIH1cbiAgICBhc3luYyBmb2N1c0lucHV0KCkgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7IH1cbiAgICBhc3luYyBmb2N1c1BhZ2UoKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUoKTsgfVxuICAgIGFzeW5jIGdldEVkaXRvckluZm8oKSB7IHJldHVybiBbZG9jdW1lbnQubG9jYXRpb24uaHJlZiwgXCJcIiwgWzEsIDFdLCB1bmRlZmluZWRdIGFzIFtzdHJpbmcsIHN0cmluZywgW251bWJlciwgbnVtYmVyXSwgc3RyaW5nXSB9XG4gICAgYXN5bmMgZ2V0RWxlbWVudENvbnRlbnQoKSB7XG4gICAgICAgIGNvbnN0IGRldGFpbHMgPSBhd2FpdCBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyBmdW5jTmFtZTogW1wiZ2V0T3duQ29tcG9zZURldGFpbHNcIl0sIGFyZ3M6IFtdIH0pO1xuICAgICAgICBpZiAoZGV0YWlscy5pc1BsYWluVGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIGRldGFpbHMucGxhaW5UZXh0Qm9keTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBcIkhUTUwgY29tcG9zaXRpb24gbW9kZSBub3Qgc3VwcG9ydGVkIGR1ZSB0byBleHRlbnNpb24gXCJcbiAgICAgICAgICAgICsgXCJyZXN0cmljdGlvbnMuIFN3aXRjaCB0byBwbGFpbnRleHQgZWRpdGluZyAoQWNjb3VudCBTZXR0aW5ncyBcIlxuICAgICAgICAgICAgKyBcIj4gQ29tcG9zaXRpb24gJiBBZGRyZXNzaW5nID4gVW50aWNrIGBDb21wb3NlIG1lc3NhZ2VzIGluIEhUTUwgXCJcbiAgICAgICAgICAgICsgXCJGb3JtYXRgKVwiO1xuICAgIH1cbiAgICBhc3luYyBoaWRlRWRpdG9yKCkgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7IH1cbiAgICBhc3luYyBraWxsRWRpdG9yKCkge1xuICAgICAgICByZXR1cm4gYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgICAgIGZ1bmNOYW1lOiBbXCJjbG9zZU93blRhYlwiXVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgYXN5bmMgcHJlc3NLZXlzKF86IGFueVtdKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUoKTsgfVxuICAgIGFzeW5jIHJlc2l6ZUVkaXRvcihfOiBudW1iZXIsIF9fOiBudW1iZXIpIHtcbiAgICAgICAgLy8gRG9uJ3QgZG8gYW55dGhpbmcsIHJlc2l6aW5nIGlzIGZ1bGx5IGNvbnRyb2xsZWQgYnkgcmVzaXppbmcgdGhlXG4gICAgICAgIC8vIGNvbXBvc2Ugd2luZG93XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgYXN5bmMgc2V0RWxlbWVudENvbnRlbnQoXzogc3RyaW5nKSB7IHJldHVybjsgfVxuICAgIGFzeW5jIHNldEVsZW1lbnRDdXJzb3IoXzogbnVtYmVyLCBfXzogbnVtYmVyKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUoKTsgfVxufVxuXG5jbGFzcyBUaHVuZGVyYmlyZEtleUhhbmRsZXIgZXh0ZW5kcyBLZXlkb3duSGFuZGxlciB7XG4gICAgcHJpdmF0ZSBlbmFibGVkOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBHbG9iYWxTZXR0aW5ncykge1xuICAgICAgICBzdXBlcihkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICBjb25zdCBhY2NlcHRJbnB1dCA9ICgoZXZ0OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJpbnB1dFwiLCBldnQuZGF0YSk7XG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZXZ0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5iaW5kKHRoaXMpO1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImJlZm9yZWlucHV0XCIsIChldnQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2dC5pc1RydXN0ZWQgJiYgIWV2dC5pc0NvbXBvc2luZykge1xuICAgICAgICAgICAgICAgIGFjY2VwdElucHV0KGV2dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZvY3VzKCkge1xuICAgICAgICB3aW5kb3cuZm9jdXMoKTtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmZvY3VzKCk7XG4gICAgfVxufVxuXG5jb25mUmVhZHkudGhlbihhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qga2V5SGFuZGxlciA9IG5ldyBUaHVuZGVyYmlyZEtleUhhbmRsZXIoZ2V0R2xvYmFsQ29uZigpKTtcbiAgICBjb25zdCBwYWdlID0gbmV3IFRodW5kZXJiaXJkUGFnZUV2ZW50RW1pdHRlcigpO1xuICAgIHBhZ2Uub24oXCJwYXVzZV9rZXloYW5kbGVyXCIsICgpID0+IHtcbiAgICAgICAga2V5SGFuZGxlci5zdG9wKCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ga2V5SGFuZGxlci5zdGFydCgpLCAxMDAwKTtcbiAgICB9KTtcbiAgICBzZXR1cElucHV0KFxuICAgICAgICBwYWdlLFxuICAgICAgICBjYW52YXMsXG4gICAgICAgIGtleUhhbmRsZXIsXG4gICAgICAgIGNvbm5lY3Rpb25Qcm9taXNlKTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9