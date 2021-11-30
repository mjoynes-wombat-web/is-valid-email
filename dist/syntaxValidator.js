"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tlds = require("tlds/index.json");
class EmailSyntaxValidator {
    constructor(configParam = {}) {
        this.defaultConfig = {
            local: {
                alphaUpper: true,
                alphaLower: true,
                numeric: true,
                period: true,
                printable: true,
                quote: true,
                hyphen: true,
                spaces: true,
            },
            domain: {
                alphaUpper: true,
                alphaLower: true,
                numeric: true,
                period: true,
                hyphen: true,
                tld: true,
                localhost: false,
                charsBeforeDot: 1,
                charsAfterDot: 2,
            },
        };
        this.config = this.defaultConfig;
        this.chars = {
            alphaLower: 'abcdefghijklmnopqrstuvwxyz',
            alphaUpper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numeric: '0123456789',
            dot: ',',
            printable: "!#$%&'*+/=?^_`{|}~",
            space: ' ',
            quote: '"',
            hyphen: '-',
            period: '.',
        };
        this.email = '';
        this.originalEmail = '';
        let key;
        console.log('validate config');
        for (key in configParam) {
            const configGroup = configParam[key];
            for (const subKey in configGroup) {
                const subKeyType = subKey;
                this.config[key][subKeyType] = configGroup[subKeyType];
            }
        }
    }
    gatherChars(charConfig) {
        let characters = '';
        if (charConfig.alphaUpper === true) {
            characters += this.chars.alphaUpper;
        }
        if (charConfig.alphaLower === true) {
            characters += this.chars.alphaLower;
        }
        if (charConfig.numeric === true) {
            characters += this.chars.numeric;
        }
        if (charConfig.hyphen === true) {
            characters += this.chars.hyphen;
        }
        if ('printable' in charConfig && charConfig.printable === true) {
            characters += this.chars.printable;
        }
        if ('spaces' in charConfig && charConfig.spaces === true) {
            characters += this.chars.space;
        }
        if ('quote' in charConfig && charConfig.quote === true) {
            characters += this.chars.quote;
        }
        if (charConfig.period === true) {
            characters += this.chars.period;
        }
        return characters.split('');
    }
    validateGeneral() {
        const atSymbolIndex = this.email.indexOf('@');
        if (atSymbolIndex < 1) {
            return false;
        }
        return true;
    }
    validateChars(chars, charsToValidate) {
        let quoteOpen = false;
        for (let l = 0; l < charsToValidate.length; l++) {
            const letter = charsToValidate[l];
            if (this.config.local.quote) {
                if (letter === '"') {
                    quoteOpen = !quoteOpen;
                    if (l !== 0 && l !== charsToValidate.length - 1) {
                        if (quoteOpen && !(charsToValidate[l - 1] === '.')) {
                            return false;
                        }
                        else if (!quoteOpen && !(charsToValidate[l + 1] === '.')) {
                            return false;
                        }
                    }
                }
            }
            const letterInAllowed = chars.indexOf(letter) !== -1;
            if (!letterInAllowed) {
                return false;
            }
        }
        return true;
    }
    validateLocal() {
        const validChars = this.gatherChars(this.config.local);
        let localLetters = this.email.slice(0, this.email.indexOf('@')).split('');
        if (this.config.local.printable) {
            const percentInLocalIndex = localLetters.indexOf('%');
            if (percentInLocalIndex !== -1) {
                localLetters = localLetters.slice(0, percentInLocalIndex);
            }
            const bangInLocalIndex = localLetters.indexOf('!');
            if (bangInLocalIndex !== -1) {
                localLetters = localLetters.slice(bangInLocalIndex);
            }
        }
        if (localLetters.length > 64) {
            return false;
        }
        const charsValid = this.validateChars(validChars, localLetters);
        if (!charsValid) {
            return false;
        }
        const indexOfDoublePeriods = this.email.indexOf('..');
        if (indexOfDoublePeriods !== -1) {
            const atSymbolIndex = this.email.indexOf('@');
            if (indexOfDoublePeriods > atSymbolIndex) {
                return false;
            }
            const indexOfFirstQuoteInLocal = localLetters.indexOf('"');
            const indexOfLastQuoteInLocal = localLetters.length -
                `${localLetters}`.split('').reverse().join('').indexOf('"') -
                1;
            if (indexOfFirstQuoteInLocal < 0 || indexOfLastQuoteInLocal < 0) {
                return false;
            }
            if (indexOfFirstQuoteInLocal >= indexOfDoublePeriods ||
                indexOfDoublePeriods >= indexOfLastQuoteInLocal) {
                return false;
            }
        }
        const indexOfSpace = localLetters.indexOf(' ');
        if (indexOfSpace !== -1 &&
            (localLetters[indexOfSpace + 1] !== '"' ||
                localLetters[indexOfSpace - 1] !== '"')) {
            return false;
        }
        return true;
    }
    validateDomainParts(domain) {
        const dotIndex = domain.lastIndexOf('.');
        if (dotIndex === -1 && this.config.domain.localhost === false) {
            return false;
        }
        if (dotIndex !== -1) {
            if (this.config.domain.charsBeforeDot !== -1) {
                if (dotIndex <= this.config.domain.charsBeforeDot) {
                    return false;
                }
            }
            if (this.config.domain.charsAfterDot !== -1) {
                if (dotIndex === domain.length - this.config.domain.charsAfterDot) {
                    return false;
                }
            }
            if (this.config.domain.tld) {
                const tld = domain.slice(dotIndex + 1);
                let tldExists = false;
                for (let t = 0; t < tlds.length; t++) {
                    const currentTld = tlds[t];
                    if (tld.toLowerCase() === currentTld) {
                        tldExists = true;
                    }
                    if (tldExists) {
                        break;
                    }
                }
                if (!tldExists) {
                    return false;
                }
            }
        }
        return true;
    }
    validateDomain() {
        const domain = this.email.slice(this.email.indexOf('@') + 1);
        const domainPartsValid = this.validateDomainParts(domain);
        if (!domainPartsValid) {
            return false;
        }
        const validChars = this.gatherChars(this.config.domain);
        const domainLetters = domain.split('');
        if (this.config.local.printable) {
            const localLetters = this.email
                .slice(0, this.email.indexOf('@'))
                .split('');
            const percentInLocalIndex = localLetters.indexOf('%');
            if (percentInLocalIndex !== -1) {
                const relayDomain = localLetters.slice(percentInLocalIndex + 1);
                const relayDomainPartsValid = this.validateDomainParts(relayDomain.join(''));
                if (!relayDomainPartsValid) {
                    return false;
                }
                const charsValid = this.validateChars(validChars, relayDomain);
                if (!charsValid) {
                    return false;
                }
            }
            const bangInLocalIndex = localLetters.indexOf('!');
            if (bangInLocalIndex !== -1) {
                const relayDomain = localLetters.slice(0, bangInLocalIndex);
                const relayDomainPartsValid = this.validateDomainParts(relayDomain.join(''));
                if (!relayDomainPartsValid) {
                    return false;
                }
                const charsValid = this.validateChars(validChars, relayDomain);
                if (!charsValid) {
                    return false;
                }
            }
        }
        const charsValid = this.validateChars(validChars, domainLetters);
        if (!charsValid) {
            return false;
        }
        return true;
    }
    validate(email) {
        return __awaiter(this, void 0, void 0, function* () {
            this.email = email;
            const generalValid = this.validateGeneral();
            if (!generalValid) {
                return false;
            }
            const localValid = this.validateLocal();
            if (!localValid) {
                return false;
            }
            const domainValid = this.validateDomain();
            if (!domainValid) {
                return false;
            }
            return true;
        });
    }
}
exports.default = EmailSyntaxValidator;
//# sourceMappingURL=syntaxValidator.js.map