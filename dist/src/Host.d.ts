import type { Polar as FfiPolar } from './polar_wasm_api';
import type { Class, ClassParams, EqualityFn, PolarComparisonOperator, PolarTerm, UserTypeParams, BuildQueryFn, ExecQueryFn, CombineQueryFn, DataFilteringQueryParams, IsaCheck } from './types';
import { Relation } from './dataFiltering';
import type { SerializedFields } from './dataFiltering';
export declare class UserType<Type extends Class<T>, T = any, Query = any> {
    name: string;
    cls: Type;
    id: number;
    fields: Map<string, Class | Relation>;
    buildQuery: BuildQueryFn<Promise<Query>>;
    execQuery: ExecQueryFn<Query, Promise<T[]>>;
    combineQuery: CombineQueryFn<Query>;
    isaCheck: IsaCheck;
    constructor({ name, cls, id, fields, buildQuery, execQuery, combineQuery, isaCheck }: UserTypeParams<Type>);
}
/**
 * Translator between Polar and JavaScript.
 *
 * @internal
 */
export declare class Host implements Required<DataFilteringQueryParams> {
    #private;
    types: Map<string | Class, UserType<any>>;
    buildQuery: BuildQueryFn;
    execQuery: ExecQueryFn;
    combineQuery: CombineQueryFn;
    /**
     * Shallow clone a host to extend its state for the duration of a particular
     * query without modifying the longer-lived [[`Polar`]] host state.
     *
     * @internal
     */
    static clone(host: Host): Host;
    /** @internal */
    constructor(ffiPolar: FfiPolar, equalityFn: EqualityFn);
    /**
     * Fetch a JavaScript class from the class cache.
     *
     * @param name Class name to look up.
     *
     * @internal
     */
    private getClass;
    /**
     * Get user type for `cls`.
     *
     * @param cls Class or class name.
     */
    getType<Type extends Class>(cls?: Type | string): UserType<Type> | undefined;
    /**
     * Return user types that are registered with Host.
     */
    private distinctUserTypes;
    serializeTypes(): {
        [tag: string]: SerializedFields;
    };
    /**
     * Store a JavaScript class in the class cache.
     *
     * @param cls Class to cache.
     * @param params Optional parameters.
     *
     * @internal
     */
    cacheClass(cls: Class, params?: ClassParams): string;
    /**
     * Return cached instances.
     *
     * Only used by the test suite.
     *
     * @internal
     */
    instances(): unknown[];
    /**
     * Check if an instance exists in the instance cache.
     *
     * @internal
     */
    hasInstance(id: number): boolean;
    /**
     * Fetch a JavaScript instance from the instance cache.
     *
     * Public for the test suite.
     *
     * @internal
     */
    getInstance(id: number): unknown;
    /**
     * Store a JavaScript instance in the instance cache, fetching a new instance
     * ID from the Polar VM if an ID is not provided.
     *
     * @internal
     */
    cacheInstance(instance: unknown, id?: number): number;
    /**
     * Register the MROs of all registered classes.
     */
    registerMros(): void;
    /**
     * Construct a JavaScript instance and store it in the instance cache.
     *
     * @internal
     */
    makeInstance(name: string, fields: PolarTerm[], id: number): Promise<void>;
    /**
     * Check if the left class is more specific than the right class with respect
     * to the given instance.
     *
     * @internal
     */
    isSubspecializer(id: number, left: string, right: string): Promise<boolean>;
    /**
     * Check if the left class is a subclass of the right class.
     *
     * @internal
     */
    isSubclass(left: string, right: string): boolean;
    /**
     * Check if the given instance is an instance of a particular class.
     *
     * @internal
     */
    isa(polarInstance: PolarTerm, name: string): Promise<boolean>;
    /**
     * Check if a sequence of field accesses on the given class is an
     * instance of another class.
     *
     * @internal
     */
    isaWithPath(baseTag: string, path: PolarTerm[], classTag: string): Promise<boolean>;
    /**
     * Check if the given instances conform to the operator.
     *
     * @internal
     */
    externalOp(op: PolarComparisonOperator, leftTerm: PolarTerm, rightTerm: PolarTerm): Promise<boolean>;
    /**
     * Turn a JavaScript value into a Polar term that's ready to be sent to the
     * Polar VM.
     *
     * @internal
     */
    toPolar(v: unknown): PolarTerm;
    /**
     * Turn a Polar term from the Polar VM into a JavaScript value.
     *
     * @internal
     */
    toJs(v: PolarTerm): Promise<unknown>;
}
