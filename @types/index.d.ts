interface EmailValidatorConfig {
  local: LocalValidateConfig
  domain: DomainValidateConfig
}
interface EmailValidatorParam {
  local?: LocalValidateConfig
  domain?: DomainValidateConfig
}
type LocalValidateConfig = {
  alphaUpper: boolean
  alphaLower: boolean
  numeric: boolean
  period: boolean
  printable: boolean
  quote: boolean
  hyphen: boolean
  spaces: boolean
}

type DomainValidateConfig = {
  alphaUpper: boolean
  alphaLower: boolean
  numeric: boolean
  period: boolean
  hyphen: boolean
  tld: boolean
  localhost: boolean
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

type LocalSanitizeConfig = {
  removePeriods: boolean
  removePlusTag: boolean
}

type CommonSanitizeConfig = {
  lowercase: boolean
}

type SanitizeConfig = {
  common: CommonSanitizeConfig
  local: LocalSanitizeConfig
}

type SanitizeParam = {
  common?: CommonSanitizeConfig
  local?: LocalSanitizeConfig
}
