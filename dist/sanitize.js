"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmailSanitizer {
    constructor(configParam = {}) {
        this.defaultConfig = {
            lowercase: true,
            gmail: true,
        };
        this.config = this.defaultConfig;
        this.email = '';
        this.originalEmail = '';
        let key;
        for (key in configParam) {
            this.config[key] = configParam[key];
        }
    }
    sanitize(email) {
        this.originalEmail = email;
        this.email = email;
        if (this.config.lowercase) {
            this.email = this.email.toLowerCase();
        }
        if (this.config.gmail) {
            this.sanitizeGmail();
        }
        return this.email;
    }
    sanitizeGmail() {
        const lowercase = this.email.toLowerCase();
        const gmailIndex = lowercase.indexOf('@gmail.com');
        if (gmailIndex > 0) {
            const gmail = this.email.slice(gmailIndex, this.email.length);
            this.email = `${this.email
                .substring(0, this.email.indexOf('@'))
                .replace(/\./g, '')}${gmail}`;
            if (this.email.indexOf('+') > 0) {
                this.email = `${this.email.substring(0, this.email.indexOf('+'))}${gmail}`;
            }
        }
    }
}
exports.default = EmailSanitizer;
//# sourceMappingURL=sanitize.js.map