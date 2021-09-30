let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder, TextEncoder } = require(`util`);

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error('expected a boolean argument');
    }
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    if (typeof(heap_next) !== 'number') throw new Error('corrupt heap');

    heap[idx] = obj;
    return idx;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error('expected a number argument');
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (typeof(arg) !== 'string') throw new Error('expected a string argument');

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        if (ret.read !== arg.length) throw new Error('failed to pass whole string');
        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function logError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        let error = (function () {
            try {
                return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
            } catch(_) {
                return "<failed to stringify thrown value>";
            }
        }());
        console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
        throw e;
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
class Polar {

    static __wrap(ptr) {
        const obj = Object.create(Polar.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_polar_free(ptr);
    }
    /**
    */
    constructor() {
        var ret = wasm.polar_wasm_new();
        return Polar.__wrap(ret);
    }
    /**
    * @param {any} sources
    */
    load(sources) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        wasm.polar_load(this.ptr, addHeapObject(sources));
    }
    /**
    */
    clearRules() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        wasm.polar_clearRules(this.ptr);
    }
    /**
    * @param {string} name
    * @param {any} value
    */
    registerConstant(name, value) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.polar_registerConstant(this.ptr, ptr0, len0, addHeapObject(value));
    }
    /**
    * @returns {Query | undefined}
    */
    nextInlineQuery() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ret = wasm.polar_nextInlineQuery(this.ptr);
        return ret === 0 ? undefined : Query.__wrap(ret);
    }
    /**
    * @param {string} src
    * @returns {Query}
    */
    newQueryFromStr(src) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ptr0 = passStringToWasm0(src, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.polar_newQueryFromStr(this.ptr, ptr0, len0);
        return Query.__wrap(ret);
    }
    /**
    * @param {any} value
    * @returns {Query}
    */
    newQueryFromTerm(value) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ret = wasm.polar_newQueryFromTerm(this.ptr, addHeapObject(value));
        return Query.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    newId() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ret = wasm.polar_newId(this.ptr);
        return ret;
    }
    /**
    * @returns {any}
    */
    nextMessage() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ret = wasm.polar_nextMessage(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {string} name
    * @param {any} mro
    */
    registerMro(name, mro) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.polar_registerMro(this.ptr, ptr0, len0, addHeapObject(mro));
    }
    /**
    * @param {any} types
    * @param {any} partial_results
    * @param {string} variable
    * @param {string} class_tag
    * @returns {any}
    */
    buildFilterPlan(types, partial_results, variable, class_tag) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ptr0 = passStringToWasm0(variable, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(class_tag, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.polar_buildFilterPlan(this.ptr, addHeapObject(types), addHeapObject(partial_results), ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
}
module.exports.Polar = Polar;
/**
*/
class Query {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    static __wrap(ptr) {
        const obj = Object.create(Query.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_query_free(ptr);
    }
    /**
    * @returns {any}
    */
    nextEvent() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ret = wasm.query_nextEvent(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {number} call_id
    * @param {any} value
    */
    callResult(call_id, value) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        wasm.query_callResult(this.ptr, call_id, addHeapObject(value));
    }
    /**
    * @param {number} call_id
    * @param {boolean} result
    */
    questionResult(call_id, result) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertBoolean(result);
        wasm.query_questionResult(this.ptr, call_id, result);
    }
    /**
    * @param {string} command
    */
    debugCommand(command) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ptr0 = passStringToWasm0(command, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.query_debugCommand(this.ptr, ptr0, len0);
    }
    /**
    * @param {string} msg
    */
    appError(msg) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ptr0 = passStringToWasm0(msg, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.query_appError(this.ptr, ptr0, len0);
    }
    /**
    * @returns {any}
    */
    nextMessage() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ret = wasm.query_nextMessage(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {string}
    */
    source() {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.ptr);
            wasm.query_source(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} name
    * @param {any} value
    */
    bind(name, value) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.query_bind(this.ptr, ptr0, len0, addHeapObject(value));
    }
    /**
    * @param {string | undefined} rust_log
    * @param {string | undefined} polar_log
    */
    setLoggingOptions(rust_log, polar_log) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ptr0 = isLikeNone(rust_log) ? 0 : passStringToWasm0(rust_log, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(polar_log) ? 0 : passStringToWasm0(polar_log, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        wasm.query_setLoggingOptions(this.ptr, ptr0, len0, ptr1, len1);
    }
}
module.exports.Query = Query;

module.exports.__wbindgen_is_object = function(arg0) {
    const val = getObject(arg0);
    var ret = typeof(val) === 'object' && val !== null;
    _assertBoolean(ret);
    return ret;
};

module.exports.__wbindgen_is_undefined = function(arg0) {
    var ret = getObject(arg0) === undefined;
    _assertBoolean(ret);
    return ret;
};

module.exports.__wbindgen_is_null = function(arg0) {
    var ret = getObject(arg0) === null;
    _assertBoolean(ret);
    return ret;
};

module.exports.__wbindgen_number_new = function(arg0) {
    var ret = arg0;
    return addHeapObject(ret);
};

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbindgen_object_clone_ref = function(arg0) {
    var ret = getObject(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_get_2d1407dba3452350 = function() { return logError(function (arg0, arg1) {
    var ret = getObject(arg0)[takeObject(arg1)];
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_set_f1a4ac8f3a605b11 = function() { return logError(function (arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
}, arguments) };

module.exports.__wbg_String_c8baaa0740def8c6 = function() { return logError(function (arg0, arg1) {
    var ret = String(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };

module.exports.__wbg_error_4bb6c2a97407129a = function() { return logError(function (arg0, arg1) {
    try {
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(arg0, arg1);
    }
}, arguments) };

module.exports.__wbg_new_59cb74e423758ede = function() { return logError(function () {
    var ret = new Error();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_stack_558ba5917b466edd = function() { return logError(function (arg0, arg1) {
    var ret = getObject(arg1).stack;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };

module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

module.exports.__wbg_error_d45b346d0fa95c8b = function() { return logError(function (arg0, arg1) {
    console.error(getStringFromWasm0(arg0, arg1));
}, arguments) };

module.exports.__wbg_new_ec75d0d5815be736 = function() { return logError(function () {
    var ret = new Array();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_get_73c087db0a496c21 = function() { return logError(function (arg0, arg1) {
    var ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_isArray_8c5958cbfaf9bb48 = function() { return logError(function (arg0) {
    var ret = Array.isArray(getObject(arg0));
    _assertBoolean(ret);
    return ret;
}, arguments) };

module.exports.__wbg_length_c5fa152b8c3f311f = function() { return logError(function (arg0) {
    var ret = getObject(arg0).length;
    _assertNum(ret);
    return ret;
}, arguments) };

module.exports.__wbg_push_0daae9343162dbe7 = function() { return logError(function (arg0, arg1) {
    var ret = getObject(arg0).push(getObject(arg1));
    _assertNum(ret);
    return ret;
}, arguments) };

module.exports.__wbg_instanceof_ArrayBuffer_8431a1911282ee67 = function() { return logError(function (arg0) {
    var ret = getObject(arg0) instanceof ArrayBuffer;
    _assertBoolean(ret);
    return ret;
}, arguments) };

module.exports.__wbg_values_3ecc6f723c37f081 = function() { return logError(function (arg0) {
    var ret = getObject(arg0).values();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_new_80811dcb66d1b53f = function() { return logError(function (arg0, arg1) {
    var ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_setname_bc298e99dbc67a5d = function() { return logError(function (arg0, arg1, arg2) {
    getObject(arg0).name = getStringFromWasm0(arg1, arg2);
}, arguments) };

module.exports.__wbg_call_e91f71ddf1f45cff = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_new_193281ce8fd4b1c8 = function() { return logError(function () {
    var ret = new Map();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_set_b9dad32fc360b408 = function() { return logError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_next_f6ffce741b18af05 = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).next();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_next_a153d72ec9f76de7 = function() { return logError(function (arg0) {
    var ret = getObject(arg0).next;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_done_1d79fc301127c139 = function() { return logError(function (arg0) {
    var ret = getObject(arg0).done;
    _assertBoolean(ret);
    return ret;
}, arguments) };

module.exports.__wbg_value_4c025ad337ce3912 = function() { return logError(function (arg0) {
    var ret = getObject(arg0).value;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_isSafeInteger_28116e8fdbf3883c = function() { return logError(function (arg0) {
    var ret = Number.isSafeInteger(getObject(arg0));
    _assertBoolean(ret);
    return ret;
}, arguments) };

module.exports.__wbg_now_d89e184b3e3c06ec = function() { return logError(function () {
    var ret = Date.now();
    return ret;
}, arguments) };

module.exports.__wbg_entries_a3fad9ebd955672b = function() { return logError(function (arg0) {
    var ret = Object.entries(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_new_4b48f9f8159fea77 = function() { return logError(function () {
    var ret = new Object();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_iterator_18e2d2132471e894 = function() { return logError(function () {
    var ret = Symbol.iterator;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_instanceof_Uint8Array_04a60be10585d9dc = function() { return logError(function (arg0) {
    var ret = getObject(arg0) instanceof Uint8Array;
    _assertBoolean(ret);
    return ret;
}, arguments) };

module.exports.__wbg_new_945397fb09fec0b8 = function() { return logError(function (arg0) {
    var ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_length_68e13e7bbd918464 = function() { return logError(function (arg0) {
    var ret = getObject(arg0).length;
    _assertNum(ret);
    return ret;
}, arguments) };

module.exports.__wbg_set_223873223acf6d07 = function() { return logError(function (arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
}, arguments) };

module.exports.__wbg_buffer_79a3294266d4e783 = function() { return logError(function (arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbindgen_is_function = function(arg0) {
    var ret = typeof(getObject(arg0)) === 'function';
    _assertBoolean(ret);
    return ret;
};

module.exports.__wbg_get_6d26c712aa73c8b2 = function() { return handleError(function (arg0, arg1) {
    var ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_has_6beec53675bce86a = function() { return handleError(function (arg0, arg1) {
    var ret = Reflect.has(getObject(arg0), getObject(arg1));
    _assertBoolean(ret);
    return ret;
}, arguments) };

module.exports.__wbindgen_number_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'number' ? obj : undefined;
    if (!isLikeNone(ret)) {
        _assertNum(ret);
    }
    getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};

module.exports.__wbindgen_is_string = function(arg0) {
    var ret = typeof(getObject(arg0)) === 'string';
    _assertBoolean(ret);
    return ret;
};

module.exports.__wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbindgen_boolean_get = function(arg0) {
    const v = getObject(arg0);
    var ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    _assertNum(ret);
    return ret;
};

module.exports.__wbindgen_debug_string = function(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbindgen_rethrow = function(arg0) {
    throw takeObject(arg0);
};

module.exports.__wbindgen_memory = function() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};

const path = require('path').join(__dirname, 'polar_wasm_api_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

