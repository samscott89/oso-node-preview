/* tslint:disable */
/* eslint-disable */
/**
*/
export class Polar {
  free(): void;
/**
*/
  constructor();
/**
* @param {any} sources
*/
  load(sources: any): void;
/**
*/
  clearRules(): void;
/**
* @param {string} name
* @param {any} value
*/
  registerConstant(name: string, value: any): void;
/**
* @returns {Query | undefined}
*/
  nextInlineQuery(): Query | undefined;
/**
* @param {string} src
* @returns {Query}
*/
  newQueryFromStr(src: string): Query;
/**
* @param {any} value
* @returns {Query}
*/
  newQueryFromTerm(value: any): Query;
/**
* @returns {number}
*/
  newId(): number;
/**
* @returns {any}
*/
  nextMessage(): any;
/**
* @param {string} name
* @param {any} mro
*/
  registerMro(name: string, mro: any): void;
/**
* @param {any} types
* @param {any} partial_results
* @param {string} variable
* @param {string} class_tag
* @returns {any}
*/
  buildFilterPlan(types: any, partial_results: any, variable: string, class_tag: string): any;
}
/**
*/
export class Query {
  free(): void;
/**
* @returns {any}
*/
  nextEvent(): any;
/**
* @param {number} call_id
* @param {any} value
*/
  callResult(call_id: number, value: any): void;
/**
* @param {number} call_id
* @param {boolean} result
*/
  questionResult(call_id: number, result: boolean): void;
/**
* @param {string} command
*/
  debugCommand(command: string): void;
/**
* @param {string} msg
*/
  appError(msg: string): void;
/**
* @returns {any}
*/
  nextMessage(): any;
/**
* @returns {string}
*/
  source(): string;
/**
* @param {string} name
* @param {any} value
*/
  bind(name: string, value: any): void;
/**
* @param {string | undefined} rust_log
* @param {string | undefined} polar_log
*/
  setLoggingOptions(rust_log?: string, polar_log?: string): void;
}
