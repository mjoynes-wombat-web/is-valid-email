"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailDnsValidator = exports.EmailSanitizer = exports.EmailSyntaxValidator = void 0;
const syntaxValidator_1 = require("./syntaxValidator");
exports.EmailSyntaxValidator = syntaxValidator_1.default;
const sanitize_1 = require("./sanitize");
exports.EmailSanitizer = sanitize_1.default;
const dnsValidator_1 = require("./dnsValidator");
exports.EmailDnsValidator = dnsValidator_1.default;
//# sourceMappingURL=index.js.map