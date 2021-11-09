declare namespace EmailValidator {
  interface EmailValidatorConfig {
    local: LocalConfig
    domain: DomainConfig
    sanitize: SanitizeConfig
    dns: DnsConfig
  }
  type LocalConfig = {
    alphaUpper: boolean
    alphaLower: boolean
    numeric: boolean
    period: boolean
    printable: boolean
    space: boolean
    quote: boolean
    doublePeriodsInQuotes: boolean
    spacesSurroundedByQuote: boolean
  }

  type DomainConfig = {
    alphaUpper: boolean
    alphaLower: boolean
    numeric: boolean
    period: boolean
    hyphen: boolean
    charsBeforeDot: number // -1 means don't check.
    charsAfterDot: number // -1 means don't check.
  }

  type SanitizeConfig = {
    lowercase: boolean
    gmail: boolean
  }

  type DnsConfig = {
    a: number // -1 means don't check.
    ns: number // -1 means don't check.
    spf: number // -1 means don't check.
    port: number // -1 means don't check.
    mx: number // -1 means don't check.
    validScore: number // -1 means don't check.
    smtpPorts: number[]
  }
}
