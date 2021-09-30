"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterData = exports.Field = exports.Relation = void 0;
const types_1 = require("./types");
const helpers_1 = require("./helpers");
const errors_1 = require("./errors");
/** Represents relationships between two resources, eg. one-one or one-many. */
class Relation {
    constructor(kind, otherType, myField, otherField) {
        this.kind = kind;
        this.otherType = otherType;
        this.myField = myField;
        this.otherField = otherField;
    }
    serialize() {
        return {
            Relation: {
                kind: this.kind,
                other_class_tag: this.otherType,
                my_field: this.myField,
                other_field: this.otherField,
            },
        };
    }
}
exports.Relation = Relation;
class Field {
    constructor(field) {
        this.field = field;
    }
}
exports.Field = Field;
class Ref {
    constructor(resultId, field) {
        this.resultId = resultId;
        this.field = field;
    }
}
async function parseFilter(host, filter) {
    const { kind, field } = filter;
    if (!['Eq', 'Neq', 'In', 'Contains'].includes(kind))
        throw new Error();
    if (field !== undefined && !helpers_1.isString(field))
        throw new Error();
    let { value } = filter;
    if (!helpers_1.isObj(value))
        throw new Error();
    if (types_1.isPolarTerm(value['Term'])) {
        value = await host.toJs(value['Term']);
    }
    else if (helpers_1.isObj(value['Ref'])) {
        const { field: childField, result_id: resultId } = value['Ref'];
        if (childField !== undefined && !helpers_1.isString(childField))
            throw new Error();
        if (!Number.isInteger(resultId))
            throw new Error();
        value = new Ref(resultId, childField);
    }
    else if (helpers_1.isString(value['Field'])) {
        value = new Field(value['Field']);
    }
    else {
        throw new Error();
    }
    return { kind, value, field };
}
function groundFilter(results, filter) {
    const ref = filter.value;
    if (!(ref instanceof Ref))
        return filter;
    const { field, resultId } = ref;
    let value = results.get(resultId);
    if (field !== undefined) {
        value = value === null || value === void 0 ? void 0 : value.map(v => {
            // NOTE(gj): if `v` can't be indexed by `field`, it'll blow up at
            // runtime. This indicates something is wrong either with the data
            // filtering configuration, the user's ORM, etc.
            //
            // ref: https://github.com/osohq/oso/pull/1227#discussion_r715813796
            return v[field]; // eslint-disable-line
        });
    }
    return { ...filter, value };
}
async function filterData(host, plan) {
    const queries = [];
    let combine;
    for (const rs of plan.result_sets) {
        const setResults = new Map();
        for (const i of rs.resolve_order) {
            const req = rs.requests.get(i);
            if (req === undefined)
                throw new Error();
            const filters = await Promise.all(req.constraints.map(async (constraint) => {
                const con = await parseFilter(host, constraint);
                // Substitute in results from previous requests.
                return groundFilter(setResults, con);
            }));
            // NOTE(gj|gw): The class_tag on the request comes from serializeTypes(),
            // a function we use to pass type information to the core in order to
            // generate the filter plan. The type information is derived from
            // Host.userTypes, so anything you get back as a class_tag will exist as
            // a key in the Host.userTypes Map.
            const typ = host.getType(req.class_tag);
            if (typ === undefined)
                throw new errors_1.UnregisteredClassError(req.class_tag);
            const query = await typ.buildQuery(filters); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
            if (i !== rs.result_id) {
                setResults.set(i, await typ.execQuery(query));
            }
            else {
                queries.push(query);
                combine = typ.combineQuery;
            }
        }
    }
    if (queries.length === 0)
        return null;
    // NOTE(gw|gj): combine will only be undefined in two cases: (1) if
    // result_set.result_id is not a member of result_set.resolve_order; (2)
    // there are no result_sets. Either one of these would be a bug in the data
    // filtering logic in the core.
    if (combine === undefined)
        throw new Error();
    // @TODO remove duplicates
    return queries.reduce(combine); // eslint-disable-line @typescript-eslint/no-unsafe-return
}
exports.filterData = filterData;
//# sourceMappingURL=dataFiltering.js.map