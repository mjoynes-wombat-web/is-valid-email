// VALID EMAIL
// Attempting to follow rules from https://en.wikipedia.org/wiki/Email_address.
// Checks if the email is valid.

import { MxRecord } from 'dns'

export default class EmailValidator {
  defaultConfig: EmailValidator.EmailValidatorConfig = {
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
    sanitize: {
      lowercase: true,
      gmail: true,
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
  config: EmailValidator.EmailValidatorConfig = this.defaultConfig
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
  constructor(configParam?: EmailValidator.EmailValidatorConfig) {
    if (configParam) {
      let key: keyof EmailValidator.EmailValidatorConfig

      for (key in configParam) {
        if (key in configParam) {
          const configGroup = configParam[key]
          for (const subKey in configGroup) {
            const subKeyType = subKey as keyof typeof configGroup
            this.config[key][subKeyType] = configGroup[subKeyType]
          }
        }
      }
    }
  }
  private gatherChars(
    charConfig: EmailValidator.LocalConfig | EmailValidator.DomainConfig
  ): string[] {
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
  public sanitize(email: string) {
    this.originalEmail = email
    this.email = email

    if (this.config.sanitize.lowercase) this.email = this.email.toLowerCase()

    if (this.config.sanitize.gmail) this.sanitizeGmail()

    return this.email
  }
  private sanitizeGmail() {
    const lowercase = this.email.toLowerCase()
    if (lowercase.indexOf('@gmail.com') > 0) {
      this.email = `${this.email
        .substring(0, this.email.indexOf('@'))
        .replace(/\./g, '')}@gmail.com`

      if (this.email.indexOf('+') > 0) {
        this.email = `${this.email.substring(
          0,
          this.email.indexOf('+')
        )}@gmail.com`
      }
    }
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

    if (this.config.domain.charsBeforeDot !== -1) {
      if (dotIndex <= atSymbolIndex + this.config.domain.charsBeforeDot)
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
  dns?: typeof import('dns')
  net?: typeof import('net')
  os?: typeof import('os')
  private async validateDNS(): Promise<boolean> {
    if (
      typeof window === 'undefined' &&
      (this.config.dns.ns !== -1 ||
        this.config.dns.mx !== -1 ||
        this.config.dns.spf !== -1 ||
        this.config.dns.a !== -1)
    ) {
      let dnsValidationFail = false
      this.dns = await import('dns')
      this.net = await import('net')
      this.os = await import('os')

      let score = 0
      const promises = []

      const domain = this.email.slice(this.email.indexOf('@') + 1)

      if (this.config.dns.ns !== -1) {
        promises.push(
          this.getNsRecord(domain)
            .then((addresses) => {
              if (addresses.length) {
                score += this.config.dns.ns
              }
            })
            .catch((err) => {
              dnsValidationFail = true
              console.error('ERROR GETTING NS: ', err)
            })
        )
      }

      if (this.config.dns.mx !== -1) {
        // Grab MX records.
        promises.push(
          this.getMxRecord(domain)
            .then((addresses) => {
              if (addresses.length) {
                score += this.config.dns.mx
                if (this.config.dns.port !== -1) {
                  // Check ports on MX records.
                  for (let p = 0; p < this.config.dns.smtpPorts.length; p++) {
                    const port = this.config.dns.smtpPorts[p]
                    for (let a = 0; a < addresses.length; a++) {
                      const host = addresses[a].exchange

                      promises.push(
                        this.isPortReachable(port, { host })
                          .then((reachable) => {
                            if (reachable) score += this.config.dns.port
                          })
                          .catch((err) =>
                            console.error('ERROR REACHING PORT: ', err)
                          )
                      )
                    }
                  }
                }
              }
            })
            .catch((err) => {
              dnsValidationFail = true
              console.error('ERROR GETTING MX: ', err)
            })
        )
      }

      if (this.config.dns.spf !== -1) {
        // Grab TXT records and check for spf.
        promises.push(
          this.getTxtRecord(domain)
            .then((addresses) => {
              for (let a = 0; a < addresses.length; a++) {
                const address = addresses[a]

                if (address.indexOf('spf') !== -1) {
                  score += this.config.dns.spf
                  break
                }
              }
            })
            .catch((err) => {
              console.error('ERROR GETTING TXT: ', err)
            })
        )
      }

      if (this.config.dns.a !== -1) {
        promises.push(
          this.getARecord(domain)
            .then((addresses) => {
              if (addresses.length) {
                score += this.config.dns.a
              }
            })
            .catch((err) => {
              console.error('ERROR GETTING A: ', err)
            })
        )
      }

      await Promise.all(promises)

      if (dnsValidationFail) return false

      if (this.config.dns.validScore <= score) {
        return true
      } else {
        return false
      }
    }
    return true
  }

  private async getNsRecord(domain: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (this.dns) {
        this.dns.resolve(domain, 'NS', async function (err, addresses) {
          if (err) {
            console.log(domain, ' has no NS')
            reject()
          } else if (addresses) {
            resolve(addresses)
          } else {
            reject()
          }
        })
      } else {
        console.error('Not in node.')
        resolve([])
      }
    })
  }

  private async getARecord(domain: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (this.dns) {
        this.dns.resolve(domain, 'A', async function (err, addresses) {
          if (err) {
            console.log(domain, ' has no NS')
            reject()
          } else if (addresses) {
            resolve(addresses)
          } else {
            reject()
          }
        })
      } else {
        console.error('Not in node.')
        resolve([])
      }
    })
  }

  private async getMxRecord(domain: string): Promise<MxRecord[]> {
    return new Promise((resolve, reject) => {
      if (this.dns) {
        this.dns.resolve(domain, 'MX', async function (err, addresses) {
          if (err) {
            console.log(domain, ' has no MX')
            reject()
          } else if (addresses) {
            resolve(addresses)
          } else {
            reject()
          }
        })
      } else {
        console.error('Not in node.')
        resolve([])
      }
    })
  }

  private async getTxtRecord(domain: string): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      if (this.dns) {
        this.dns.resolve(domain, 'TXT', async function (err, addresses) {
          if (err) {
            console.log(domain, ' has no TXT')
            reject()
          } else if (addresses) {
            resolve(addresses)
          } else {
            reject()
          }
        })
      } else {
        console.error('Not in node.')
        resolve([])
      }
    })
  }

  private async isPortReachable(
    port: number,
    { host, timeout = 500 }: { host: string; timeout?: number }
  ): Promise<boolean> {
    const promise = new Promise((resolve, reject) => {
      if (this.net) {
        const socket = new this.net.Socket()

        const onError = () => {
          socket.destroy()
          reject()
        }

        socket.setTimeout(timeout)
        socket.once('error', onError)
        socket.once('timeout', onError)

        socket.connect(port, host, () => {
          socket.end()
          resolve(true)
        })
      } else {
        console.error('Not in node.')
        resolve(true)
      }
    })

    try {
      await promise
      return true
    } catch {
      return false
    }
  }

  public async validate(email: string): Promise<boolean> {
    this.sanitize(email)
    // Need to add support for special local chars that are properly quoted.
    // Need to add support for quotes in ().
    const generalValid = this.validateGeneral()
    if (!generalValid) return false

    const localValid = this.validateLocal()
    if (!localValid) return false

    const domainValid = this.validateDomain()
    if (!domainValid) return false

    const dnsValid = await this.validateDNS()
    if (!dnsValid) return false

    return true
  }
}
