// VALID EMAIL
// Attempting to follow rules from https://en.wikipedia.org/wiki/Email_address.
// Checks if the email is valid.

import { MxRecord } from 'dns'
import * as tlds from 'tlds/index.json'
class EmailSyntaxValidator {
  defaultConfig: EmailValidatorConfig = {
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
      charsBeforeDot: 1, // -1 means don't check.
      charsAfterDot: 2, // -1 means don't check.
    },
  }
  config: EmailValidatorConfig = this.defaultConfig
  chars = {
    alphaLower: 'abcdefghijklmnopqrstuvwxyz',
    alphaUpper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numeric: '0123456789',
    dot: ',',
    printable: "!#$%&'*+/=?^_`{|}~",
    space: ' ',
    quote: '"',
    hyphen: '-',
    period: '.',
  }
  email = ''
  originalEmail = ''

  constructor(configParam: EmailValidatorParam = {} as EmailValidatorParam) {
    let key: keyof EmailValidatorConfig

    console.log('validate config')

    for (key in configParam) {
      const configGroup = configParam[key]
      for (const subKey in configGroup) {
        const subKeyType = subKey as keyof typeof configGroup
        this.config[key][subKeyType] = configGroup[subKeyType]
      }
    }
  }
  private gatherChars(charConfig: LocalConfig | DomainConfig): string[] {
    let characters = ''

    if (charConfig.alphaUpper === true) {
      characters += this.chars.alphaUpper
    }
    if (charConfig.alphaLower === true) {
      characters += this.chars.alphaLower
    }
    if (charConfig.numeric === true) {
      characters += this.chars.numeric
    }

    if (charConfig.hyphen === true) {
      characters += this.chars.hyphen
    }
    if ('printable' in charConfig && charConfig.printable === true) {
      characters += this.chars.printable
    }

    if ('spaces' in charConfig && charConfig.spaces === true) {
      characters += this.chars.space
    }

    if ('quote' in charConfig && charConfig.quote === true) {
      characters += this.chars.quote
    }

    if (charConfig.period === true) {
      characters += this.chars.period
    }

    return characters.split('')
  }
  private validateGeneral(): boolean {
    // Confirm that there is an at symbol and it isn't the first character.
    const atSymbolIndex = this.email.indexOf('@')
    if (atSymbolIndex < 1) {
      return false
    }

    return true
  }
  private validateChars(chars: string[], charsToValidate: string[]): boolean {
    let quoteOpen = false
    for (let l = 0; l < charsToValidate.length; l++) {
      const letter = charsToValidate[l]
      if (this.config.local.quote) {
        if (letter === '"') {
          quoteOpen = !quoteOpen

          if (l !== 0 && l !== charsToValidate.length - 1) {
            if (quoteOpen && !(charsToValidate[l - 1] === '.')) {
              return false
            } else if (!quoteOpen && !(charsToValidate[l + 1] === '.')) {
              return false
            }
          }
        }
      }

      const letterInAllowed = chars.indexOf(letter) !== -1

      if (!letterInAllowed) {
        return false
      }
    }

    return true
  }
  private validateLocal(): boolean {
    const validChars = this.gatherChars(this.config.local)
    let localLetters = this.email.slice(0, this.email.indexOf('@')).split('')

    if (this.config.local.printable) {
      const percentInLocalIndex = localLetters.indexOf('%')

      if (percentInLocalIndex !== -1) {
        localLetters = localLetters.slice(0, percentInLocalIndex)
      }

      const bangInLocalIndex = localLetters.indexOf('!')

      if (bangInLocalIndex !== -1) {
        localLetters = localLetters.slice(bangInLocalIndex)
      }
    }

    // Validate local length
    if (localLetters.length > 64) {
      return false
    }

    const charsValid = this.validateChars(validChars, localLetters)

    if (!charsValid) {
      return false
    }

    // Make sure there are not two periods together.
    const indexOfDoublePeriods = this.email.indexOf('..')

    if (indexOfDoublePeriods !== -1) {
      // If double periods before at symbol it's invalid.
      const atSymbolIndex = this.email.indexOf('@')
      if (indexOfDoublePeriods > atSymbolIndex) {
        return false
      }

      // If double period is not within quotes.
      const indexOfFirstQuoteInLocal = localLetters.indexOf('"')
      const indexOfLastQuoteInLocal =
        localLetters.length -
        `${localLetters}`.split('').reverse().join('').indexOf('"') -
        1

      if (indexOfFirstQuoteInLocal < 0 || indexOfLastQuoteInLocal < 0) {
        return false
      }

      if (
        indexOfFirstQuoteInLocal >= indexOfDoublePeriods ||
        indexOfDoublePeriods >= indexOfLastQuoteInLocal
      ) {
        return false
      }
    }

    // Confirm that there is no spaces that are not surrounded by quotes.
    const indexOfSpace = localLetters.indexOf(' ')

    if (
      indexOfSpace !== -1 &&
      (localLetters[indexOfSpace + 1] !== '"' ||
        localLetters[indexOfSpace - 1] !== '"')
    ) {
      return false
    }

    return true
  }
  private validateDomainParts(domain: string): boolean {
    const dotIndex = domain.lastIndexOf('.')

    if (dotIndex === -1 && this.config.domain.localhost === false) {
      return false
    }

    if (dotIndex !== -1) {
      if (this.config.domain.charsBeforeDot !== -1) {
        if (dotIndex <= this.config.domain.charsBeforeDot) {
          return false
        }
      }

      if (this.config.domain.charsAfterDot !== -1) {
        if (dotIndex === domain.length - this.config.domain.charsAfterDot) {
          return false
        }
      }

      if (this.config.domain.tld) {
        const tld = domain.slice(dotIndex + 1)

        let tldExists = false

        for (let t = 0; t < tlds.length; t++) {
          const currentTld = tlds[t]

          if (tld.toLowerCase() === currentTld) {
            tldExists = true
          }

          if (tldExists) {
            break
          }
        }

        if (!tldExists) {
          return false
        }
      }
    }

    return true
  }
  private validateDomain(): boolean {
    // Confirm that there is a dot at least 1 character after the at and 2 characters before the end.
    const domain = this.email.slice(this.email.indexOf('@') + 1)

    const domainPartsValid = this.validateDomainParts(domain)

    if (!domainPartsValid) {
      return false
    }

    const validChars = this.gatherChars(this.config.domain)
    const domainLetters = domain.split('')

    if (this.config.local.printable) {
      const localLetters = this.email
        .slice(0, this.email.indexOf('@'))
        .split('')

      const percentInLocalIndex = localLetters.indexOf('%')

      if (percentInLocalIndex !== -1) {
        const relayDomain = localLetters.slice(percentInLocalIndex + 1)

        const relayDomainPartsValid = this.validateDomainParts(
          relayDomain.join('')
        )

        if (!relayDomainPartsValid) {
          return false
        }

        const charsValid = this.validateChars(validChars, relayDomain)

        if (!charsValid) {
          return false
        }
      }

      const bangInLocalIndex = localLetters.indexOf('!')

      if (bangInLocalIndex !== -1) {
        const relayDomain = localLetters.slice(0, bangInLocalIndex)

        const relayDomainPartsValid = this.validateDomainParts(
          relayDomain.join('')
        )

        if (!relayDomainPartsValid) {
          return false
        }

        const charsValid = this.validateChars(validChars, relayDomain)

        if (!charsValid) {
          return false
        }
      }
    }

    const charsValid = this.validateChars(validChars, domainLetters)

    if (!charsValid) {
      return false
    }

    return true
  }

  public async validate(email: string): Promise<boolean> {
    this.email = email
    // Need to add support for special local chars that are properly quoted.
    // Need to add support for quotes in ().
    const generalValid = this.validateGeneral()
    if (!generalValid) {
      return false
    }

    const localValid = this.validateLocal()
    if (!localValid) {
      return false
    }

    const domainValid = this.validateDomain()
    if (!domainValid) {
      return false
    }

    return true
  }
}

export default EmailSyntaxValidator
