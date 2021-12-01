"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmailSanitizer {
    constructor(configParam = {}) {
        this.defaultConfig = {
            common: {
                lowercase: true,
            },
            local: {
                removePeriods: false,
                removePlusTag: false,
            },
        };
        this.config = this.defaultConfig;
        this.email = '';
        this.originalEmail = '';
        let key;
        for (key in configParam) {
            const configGroup = configParam[key];
            for (const subKey in configGroup) {
                const subKeyType = subKey;
                this.config[key][subKeyType] = configGroup[subKeyType];
            }
        }
    }
    sanitize(email) {
        this.originalEmail = email;
        this.email = email;
        if (this.config.common.lowercase) {
            this.email = this.email.toLowerCase();
        }
        if (this.config.local.removePeriods) {
            this.removePeriodsFromLocal();
        }
        if (this.config.local.removePlusTag) {
            this.removePlusTag();
        }
        return this.email;
    }
    removePeriodsFromLocal() {
        const atIndex = this.email.indexOf('@');
        if (atIndex !== -1) {
            const domain = this.email.slice(atIndex, this.email.length);
            this.email = `${this.email
                .substring(0, this.email.indexOf('@'))
                .replace(/\./g, '')}${domain}`;
        }
    }
    removePlusTag() {
        const atIndex = this.email.indexOf('@');
        if (atIndex !== -1) {
            const domain = this.email.slice(atIndex, this.email.length);
            const plusIndex = this.email.indexOf('+');
            if (plusIndex !== -1 && plusIndex < atIndex) {
                this.email = `${this.email.substring(0, plusIndex)}${domain}`;
            }
        }
    }
    sanitizeGSuite() {
        this.removePeriodsFromLocal();
        this.removePlusTag();
    }
}
exports.default = EmailSanitizer;
//# sourceMappingURL=sanitize.js.map