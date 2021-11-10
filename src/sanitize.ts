class EmailSanitizer {
  defaultConfig: SanitizeConfig = {
    lowercase: true,
    gmail: true,
  }
  config: SanitizeConfig = this.defaultConfig
  email = ''
  originalEmail = ''

  constructor(configParam: SanitizeParam = {} as SanitizeParam) {
    let key: keyof SanitizeParam

    for (key in configParam) {
      this.config[key] = configParam[key] as boolean
    }
  }
  public sanitize(email: string) {
    this.originalEmail = email
    this.email = email

    if (this.config.lowercase) this.email = this.email.toLowerCase()

    if (this.config.gmail) this.sanitizeGmail()

    return this.email
  }
  private sanitizeGmail() {
    const lowercase = this.email.toLowerCase()
    const gmailIndex = lowercase.indexOf('@gmail.com')
    if (gmailIndex > 0) {
      const gmail = this.email.slice(gmailIndex, this.email.length)
      this.email = `${this.email
        .substring(0, this.email.indexOf('@'))
        .replace(/\./g, '')}${gmail}`

      if (this.email.indexOf('+') > 0) {
        this.email = `${this.email.substring(
          0,
          this.email.indexOf('+')
        )}${gmail}`
      }
    }
  }
}

export default EmailSanitizer
