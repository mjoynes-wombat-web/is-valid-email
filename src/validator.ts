// VALID EMAIL
// Attempting to follow rules from https://en.wikipedia.org/wiki/Email_address.
// Checks if the email is valid.

import { MxRecord } from 'dns'
class EmailValidator {
  defaultConfig: EmailValidatorConfig = {
    local: {
      alphaUpper: true,
      alphaLower: true,
      numeric: true,
      period: true,
      printable: true,
      space: true,
      quote: true,
      doublePeriodsInQuotes: true,
      spacesSurroundedByQuote: true,
    },
    domain: {
      alphaUpper: true,
      alphaLower: true,
      numeric: true,
      period: true,
      hyphen: true,
      charsBeforeDot: 1, // -1 means don't check.
      charsAfterDot: 2, // -1 means don't check.
    },
    dns: {
      a: 1,
      ns: 100,
      spf: 10,
      mx: 100,
      port: 10,
      validScore: 310,
      smtpPorts: [25, 465, 587],
    },
  }
  config: EmailValidatorConfig = this.defaultConfig
  chars = {
    alphaLower: 'abcdefghijklmnopqrstuvwxyz',
    alphaUpper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numeric: '0123456789',
    dot: ',',
    printable: "!#$%&' * +-/=?^_`{|}~",
    space: ' ',
    quote: '"',
    hyphen: '-',
    period: '.',
  }
  email = ''
  originalEmail = ''

  constructor(configParam: EmailValidatorParam = {} as EmailValidatorParam) {
    let key: keyof EmailValidatorConfig

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

    if (charConfig.alphaUpper === true) characters += this.chars.alphaUpper
    if (charConfig.alphaLower === true) characters += this.chars.alphaLower
    if (charConfig.numeric === true) characters += this.chars.numeric
    if (charConfig.period === true) characters += this.chars.period
    if ('printable' in charConfig && charConfig.printable === true)
      characters += this.chars.printable
    if ('space' in charConfig && charConfig.space === true)
      characters += this.chars.space
    if ('quote' in charConfig && charConfig.quote === true)
      characters += this.chars.quote
    if ('hyphen' in charConfig && charConfig.hyphen === true)
      characters += this.chars.hyphen

    return characters.split('')
  }
  private validateGeneral(): boolean {
    // Confirm that there is an at symbol and it isn't the first character.
    const atSymbolIndex = this.email.indexOf('@')
    if (atSymbolIndex < 1) return false

    return true
  }
  private validateChars(chars: string[], charsToValidate: string[]): boolean {
    for (let l = 0; l < charsToValidate.length; l++) {
      const letter = charsToValidate[l]
      if (this.config.local.quote) {
        if (
          letter === '"' &&
          l !== 0 &&
          l !== charsToValidate.length - 1 &&
          !(charsToValidate[l - 1] === '.' || charsToValidate[l + 1] === '.')
        )
          return false
      }

      const letterInAllowed = chars.indexOf(letter) !== -1

      if (!letterInAllowed) return false
    }

    return true
  }
  private validateLocal(): boolean {
    const validChars = this.gatherChars(this.config.local)
    const localLetters = this.email.slice(0, this.email.indexOf('@')).split('')

    // Validate local length
    if (localLetters.length > 64) return false

    const charsValid = this.validateChars(validChars, localLetters)

    if (!charsValid) return false

    // Make sure there are not two periods together.
    const indexOfDoublePeriods = this.email.indexOf('..')

    if (
      this.config.local.doublePeriodsInQuotes &&
      indexOfDoublePeriods !== -1
    ) {
      // If double periods before at symbol it's invalid.
      const atSymbolIndex = this.email.indexOf('@')
      if (indexOfDoublePeriods > atSymbolIndex) return false

      // If double period is not within quotes.
      const indexOfFirstQuoteInLocal = localLetters.indexOf('"')
      const indexOfLastQuoteInLocal =
        localLetters.length -
        `${localLetters}`.split('').reverse().join('').indexOf('"') -
        1

      if (indexOfFirstQuoteInLocal < 0 || indexOfLastQuoteInLocal < 0)
        return false

      if (
        indexOfFirstQuoteInLocal >= indexOfDoublePeriods ||
        indexOfDoublePeriods >= indexOfLastQuoteInLocal
      )
        return false
    } else if (indexOfDoublePeriods !== -1) return false

    // Confirm that there is no spaces that are not surrounded by quotes.
    const indexOfSpace = localLetters.indexOf(' ')

    if (this.config.local.spacesSurroundedByQuote) {
      if (
        indexOfSpace !== -1 &&
        (localLetters[indexOfSpace + 1] !== '"' ||
          localLetters[indexOfSpace - 1] !== '"')
      )
        return false
    } else if (indexOfSpace !== -1) return false

    return true
  }
  private validateDomain(): boolean {
    // Confirm that there is a dot at least 1 character after the at and 2 characters before the end.
    const dotIndex = this.email.lastIndexOf('.')

    const atSymbolIndex = this.email.indexOf('@')

    if (dotIndex === -1) return false

    if (this.config.domain.charsBeforeDot !== -1) {
      if (dotIndex <= atSymbolIndex + this.config.domain.charsBeforeDot + 1)
        return false
    }

    if (this.config.domain.charsAfterDot !== -1) {
      if (dotIndex === this.email.length - this.config.domain.charsAfterDot)
        return false
    }

    const validChars = this.gatherChars(this.config.domain)
    const domainLetters = this.email
      .slice(this.email.indexOf('@') + 1)
      .split('')

    const charsValid = this.validateChars(validChars, domainLetters)

    if (!charsValid) return false

    return true
  }

  public async validate(email: string): Promise<boolean> {
    this.email = email
    // Need to add support for special local chars that are properly quoted.
    // Need to add support for quotes in ().
    const generalValid = this.validateGeneral()
    if (!generalValid) return false

    const localValid = this.validateLocal()
    if (!localValid) return false

    const domainValid = this.validateDomain()
    if (!domainValid) return false

    return true
  }
}

export default EmailValidator
