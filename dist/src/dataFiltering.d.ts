import { Host } from './Host';
interface Request {
    class_tag: string;
    constraints: Filter[];
}
interface ResultSet {
    result_id: number;
    resolve_order: number[];
    requests: Map<number, Request>;
}
export interface FilterPlan {
    result_sets: ResultSet[];
}
interface SerializedRelation {
    Relation: {
        kind: string;
        other_class_tag: string;
        my_field: string;
        other_field: string;
    };
}
declare type RelationKind = 'one' | 'many';
/** Represents relationships between two resources, eg. one-one or one-many. */
export declare class Relation {
    kind: RelationKind;
    otherType: string;
    myField: string;
    otherField: string;
    constructor(kind: RelationKind, otherType: string, myField: string, otherField: string);
    serialize(): SerializedRelation;
}
export declare class Field {
    field: string;
    constructor(field: string);
}
export declare type FilterKind = 'Eq' | 'Neq' | 'In' | 'Contains';
/** Represents a condition that must hold on a resource. */
export interface Filter {
    kind: FilterKind;
    value: unknown;
    field?: string;
}
export declare type SerializedFields = {
    [field: string]: SerializedRelation | {
        Base: {
            class_tag: string;
        };
    };
};
export declare function filterData<T>(host: Host, plan: FilterPlan): Promise<T | null>;
export {};
