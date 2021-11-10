interface EmailValidatorConfig {
  local: LocalConfig
  domain: DomainConfig
  dns: DnsConfig
}
interface EmailValidatorParam {
  local?: LocalConfig
  domain?: DomainConfig
  dns?: DnsConfig
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

type DnsConfig = {
  a: number // -1 means don't check.
  ns: number // -1 means don't check.
  spf: number // -1 means don't check.
  port: number // -1 means don't check.
  mx: number // -1 means don't check.
  validScore: number // -1 means don't check.
  smtpPorts: number[]
}

type DnsParam = {
  a: number // -1 means don't check.
  ns: number // -1 means don't check.
  spf: number // -1 means don't check.
  port: number // -1 means don't check.
  mx: number // -1 means don't check.
  validScore: number // -1 means don't check.
  smtpPorts: number[]
}

type SanitizeConfig = {
  lowercase: boolean
  gmail: boolean
}

type SanitizeParam = {
  lowercase?: boolean
  gmail?: boolean
}
