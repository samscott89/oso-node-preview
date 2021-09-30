"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Query_ffiQuery, _Query_calls, _Query_host;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const readline_1 = require("readline");
const helpers_1 = require("./helpers");
const errors_1 = require("./errors");
const messages_1 = require("./messages");
const types_1 = require("./types");
const dataFiltering_1 = require("./dataFiltering");
function getLogLevelsFromEnv() {
    if (typeof (process === null || process === void 0 ? void 0 : process.env) === 'undefined')
        return [undefined, undefined];
    return [process.env.RUST_LOG, process.env.POLAR_LOG];
}
/**
 * A single Polar query.
 *
 * @internal
 */
class Query {
    constructor(ffiQuery, host, bindings) {
        _Query_ffiQuery.set(this, void 0);
        _Query_calls.set(this, void 0);
        _Query_host.set(this, void 0);
        ffiQuery.setLoggingOptions(...getLogLevelsFromEnv());
        __classPrivateFieldSet(this, _Query_ffiQuery, ffiQuery, "f");
        __classPrivateFieldSet(this, _Query_calls, new Map(), "f");
        __classPrivateFieldSet(this, _Query_host, host, "f");
        if (bindings)
            for (const [k, v] of bindings)
                this.bind(k, v);
        this.results = this.start();
    }
    /**
     * Process messages received from the Polar VM.
     *
     * @internal
     */
    bind(name, value) {
        __classPrivateFieldGet(this, _Query_ffiQuery, "f").bind(name, __classPrivateFieldGet(this, _Query_host, "f").toPolar(value));
    }
    /**
     * Process messages received from the Polar VM.
     *
     * @internal
     */
    processMessages() {
        for (;;) {
            const msg = __classPrivateFieldGet(this, _Query_ffiQuery, "f").nextMessage();
            if (msg === undefined)
                break;
            messages_1.processMessage(msg);
        }
    }
    /**
     * Send result of predicate check back to the Polar VM.
     *
     * @internal
     */
    questionResult(result, callId) {
        __classPrivateFieldGet(this, _Query_ffiQuery, "f").questionResult(callId, result);
    }
    /**
     * Send next result of JavaScript method call or property lookup to the Polar
     * VM.
     *
     * @internal
     */
    callResult(callId, result) {
        __classPrivateFieldGet(this, _Query_ffiQuery, "f").callResult(callId, result);
    }
    /**
     * Retrieve the next result from a registered call and prepare it for
     * transmission back to the Polar VM.
     *
     * @internal
     */
    async nextCallResult(callId) {
        const call = __classPrivateFieldGet(this, _Query_calls, "f").get(callId);
        if (call === undefined)
            throw new Error('invalid call');
        const { done, value } = await call.next(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        if (done)
            return undefined;
        return __classPrivateFieldGet(this, _Query_host, "f").toPolar(value);
    }
    /**
     * Send application error back to the Polar VM.
     *
     * @internal
     */
    applicationError(message) {
        __classPrivateFieldGet(this, _Query_ffiQuery, "f").appError(message);
    }
    /**
     * Handle an external call on a relation.
     *
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async handleRelation(receiver, rel) {
        // TODO(gj|gw): we should add validation for UserType relations once we
        // have a nice hook where we know every class has been registered
        // (e.g., once we enforce that all registerCalls() have to happen
        // before loadFiles()).
        const typ = __classPrivateFieldGet(this, _Query_host, "f").getType(rel.otherType);
        if (typ === undefined)
            throw new errors_1.UnregisteredClassError(rel.otherType);
        // NOTE(gj): disabling ESLint for following line b/c we're fine if
        // `receiver[rel.myField]` blows up -- we catch the error and relay it to
        // the core in `handleCall`.
        const value = receiver[rel.myField]; // eslint-disable-line
        // Use the fetcher for the other type to traverse
        // the relationship.
        const filter = { kind: 'Eq', value, field: rel.otherField };
        const query = await typ.buildQuery([filter]); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        const results = await typ.execQuery(query);
        if (rel.kind === 'one') {
            if (results.length !== 1)
                throw new Error(`Wrong number of parents: ${results.length}`);
            return results[0]; // eslint-disable-line @typescript-eslint/no-unsafe-return
        }
        else {
            return results; // eslint-disable-line @typescript-eslint/no-unsafe-return
        }
    }
    /**
     * Handle an application call.
     *
     * @internal
     */
    async handleCall(attr, callId, instance, args) {
        var _a, _b;
        let value;
        try {
            const receiver = (await __classPrivateFieldGet(this, _Query_host, "f").toJs(instance));
            const rel = (_b = (_a = __classPrivateFieldGet(this, _Query_host, "f").getType(receiver === null || receiver === void 0 ? void 0 : receiver.constructor)) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.get(attr);
            if (rel instanceof dataFiltering_1.Relation) {
                value = await this.handleRelation(receiver, rel);
            }
            else {
                // NOTE(gj): disabling ESLint for following line b/c we're fine if
                // `receiver[attr]` blows up -- we catch the error and relay it to the
                // core below.
                value = receiver[attr]; // eslint-disable-line
                if (args !== undefined) {
                    if (typeof value === 'function') {
                        // If value is a function, call it with the provided args.
                        const jsArgs = await Promise.all(args.map(async (a) => await __classPrivateFieldGet(this, _Query_host, "f").toJs(a)));
                        // NOTE(gj): disabling ESLint for following line b/c we know
                        // `receiver[attr]` (A) won't blow up (because if it was going to
                        // it already would've happened above) and (B) is a function
                        // (thanks to the `typeof value === 'function'` check above).
                        //
                        // The function invocation could still blow up with a `TypeError`
                        // if `receiver[attr]` is a class constructor (e.g., if instance
                        // were something like `{x: class{}}`), but that'll be caught &
                        // relayed to the core down below.
                        value = receiver[attr](...jsArgs); // eslint-disable-line
                    }
                    else {
                        // Error on attempt to call non-function.
                        throw new errors_1.InvalidCallError(receiver, attr);
                    }
                }
                else {
                    // If value isn't a property anywhere in receiver's prototype chain,
                    // throw an error.
                    //
                    // NOTE(gj): disabling TS for following line b/c we're fine if `attr
                    // in receiver` blows up -- we catch the error and relay it to the
                    // core below.
                    //
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (value === undefined && !(attr in receiver)) {
                        throw new errors_1.InvalidAttributeError(receiver, attr);
                    }
                }
            }
        }
        catch (e) {
            if (e instanceof TypeError ||
                e instanceof errors_1.InvalidCallError ||
                e instanceof errors_1.InvalidAttributeError) {
                this.applicationError(e.message);
            }
            else {
                throw e;
            }
        }
        finally {
            // resolve promise if necessary
            // convert result to JSON and return
            value = await Promise.resolve(value); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
            value = __classPrivateFieldGet(this, _Query_host, "f").toPolar(value);
            this.callResult(callId, value);
        }
    }
    async handleNextExternal(callId, iterable) {
        if (!__classPrivateFieldGet(this, _Query_calls, "f").has(callId)) {
            const value = await __classPrivateFieldGet(this, _Query_host, "f").toJs(iterable);
            const generator = (async function* () {
                if (types_1.isIterableIterator(value)) {
                    // If the call result is an iterable iterator, yield from it.
                    yield* value;
                }
                else if (types_1.isAsyncIterable(value)) {
                    // Same for async iterators.
                    for await (const result of value) {
                        yield result;
                    }
                }
                else if (types_1.isIterable(value)) {
                    for (const result of value) {
                        yield result;
                    }
                }
                else {
                    // Otherwise, error
                    throw new errors_1.InvalidIteratorError(typeof value);
                }
            })();
            __classPrivateFieldGet(this, _Query_calls, "f").set(callId, generator);
        }
        const result = await this.nextCallResult(callId);
        this.callResult(callId, result);
    }
    /**
     * Create an `AsyncGenerator` that can be polled to advance the query loop.
     *
     * @internal
     */
    async *start() {
        try {
            while (true) {
                const nextEvent = __classPrivateFieldGet(this, _Query_ffiQuery, "f").nextEvent(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
                this.processMessages();
                const event = helpers_1.parseQueryEvent(nextEvent);
                switch (event.kind) {
                    case types_1.QueryEventKind.Done:
                        return;
                    case types_1.QueryEventKind.Result: {
                        const { bindings } = event.data;
                        const transformed = new Map();
                        for (const [k, v] of bindings) {
                            transformed.set(k, await __classPrivateFieldGet(this, _Query_host, "f").toJs(v));
                        }
                        yield transformed;
                        break;
                    }
                    case types_1.QueryEventKind.MakeExternal: {
                        const { instanceId, tag, fields } = event.data;
                        if (__classPrivateFieldGet(this, _Query_host, "f").hasInstance(instanceId))
                            throw new errors_1.DuplicateInstanceRegistrationError(instanceId);
                        await __classPrivateFieldGet(this, _Query_host, "f").makeInstance(tag, fields, instanceId);
                        break;
                    }
                    case types_1.QueryEventKind.ExternalCall: {
                        const { attribute, callId, instance, args } = event.data;
                        await this.handleCall(attribute, callId, instance, args);
                        break;
                    }
                    case types_1.QueryEventKind.ExternalIsSubspecializer: {
                        const { instanceId, leftTag, rightTag, callId } = event.data;
                        const answer = await __classPrivateFieldGet(this, _Query_host, "f").isSubspecializer(instanceId, leftTag, rightTag);
                        this.questionResult(answer, callId);
                        break;
                    }
                    case types_1.QueryEventKind.ExternalIsSubclass: {
                        const { leftTag, rightTag, callId } = event.data;
                        const answer = __classPrivateFieldGet(this, _Query_host, "f").isSubclass(leftTag, rightTag);
                        this.questionResult(answer, callId);
                        break;
                    }
                    case types_1.QueryEventKind.ExternalOp: {
                        const { args, callId, operator } = event.data;
                        const answer = await __classPrivateFieldGet(this, _Query_host, "f").externalOp(operator, args[0], args[1]);
                        this.questionResult(answer, callId);
                        break;
                    }
                    case types_1.QueryEventKind.ExternalIsa: {
                        const { instance, tag, callId } = event.data;
                        const answer = await __classPrivateFieldGet(this, _Query_host, "f").isa(instance, tag);
                        this.questionResult(answer, callId);
                        break;
                    }
                    case types_1.QueryEventKind.ExternalIsaWithPath: {
                        const { baseTag, path, classTag, callId } = event.data;
                        const answer = await __classPrivateFieldGet(this, _Query_host, "f").isaWithPath(baseTag, path, classTag);
                        this.questionResult(answer, callId);
                        break;
                    }
                    case types_1.QueryEventKind.NextExternal: {
                        const { callId, iterable } = event.data;
                        await this.handleNextExternal(callId, iterable);
                        break;
                    }
                    case types_1.QueryEventKind.Debug: {
                        if (typeof readline_1.createInterface !== 'function') {
                            console.warn('debug events not supported in browser Oso');
                            break;
                        }
                        const { message } = event.data;
                        if (message)
                            console.log(message);
                        readline_1.createInterface({
                            input: process.stdin,
                            output: process.stdout,
                            prompt: 'debug> ',
                            tabSize: 4,
                        }).on('line', (line) => {
                            const trimmed = line.trim().replace(/;+$/, '');
                            const command = __classPrivateFieldGet(this, _Query_host, "f").toPolar(trimmed);
                            __classPrivateFieldGet(this, _Query_ffiQuery, "f").debugCommand(JSON.stringify(command));
                            this.processMessages();
                        });
                        break;
                    }
                    default: {
                        const _ = event.kind;
                        return _;
                    }
                }
            }
        }
        finally {
            __classPrivateFieldGet(this, _Query_ffiQuery, "f").free();
        }
    }
}
exports.Query = Query;
_Query_ffiQuery = new WeakMap(), _Query_calls = new WeakMap(), _Query_host = new WeakMap();
//# sourceMappingURL=Query.js.map