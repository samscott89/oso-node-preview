"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relation = exports.NotFoundError = exports.ForbiddenError = exports.AuthorizationError = exports.Variable = exports.Oso = void 0;
var Oso_1 = require("./Oso");
Object.defineProperty(exports, "Oso", { enumerable: true, get: function () { return Oso_1.Oso; } });
var Variable_1 = require("./Variable");
Object.defineProperty(exports, "Variable", { enumerable: true, get: function () { return Variable_1.Variable; } });
var errors_1 = require("./errors");
Object.defineProperty(exports, "AuthorizationError", { enumerable: true, get: function () { return errors_1.AuthorizationError; } });
Object.defineProperty(exports, "ForbiddenError", { enumerable: true, get: function () { return errors_1.ForbiddenError; } });
Object.defineProperty(exports, "NotFoundError", { enumerable: true, get: function () { return errors_1.NotFoundError; } });
var dataFiltering_1 = require("./dataFiltering");
Object.defineProperty(exports, "Relation", { enumerable: true, get: function () { return dataFiltering_1.Relation; } });
//# sourceMappingURL=index.js.map