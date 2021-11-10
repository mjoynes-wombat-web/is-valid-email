// VALID EMAIL
// Attempting to follow rules from https://en.wikipedia.org/wiki/Email_address.
// Checks if the email is valid.

import { MxRecord } from 'dns'
class EmailDnsValidator {
  defaultConfig: DnsConfig = {
    a: 1,
    ns: 100,
    spf: 10,
    mx: 100,
    port: 10,
    validScore: 310,
    smtpPorts: [25, 465, 587],
  }
  config: DnsConfig = this.defaultConfig
  email = ''

  constructor(configParam: DnsParam = {} as DnsParam) {
    let key: keyof DnsParam

    for (key in configParam) {
      this.config[key] = configParam[key] as number & number[]
    }
  }
  dns?: typeof import('dns')
  net?: typeof import('net')
  os?: typeof import('os')
  private async validateDNS(): Promise<boolean> {
    if (
      typeof window === 'undefined' &&
      (this.config.ns !== -1 ||
        this.config.mx !== -1 ||
        this.config.spf !== -1 ||
        this.config.a !== -1)
    ) {
      let dnsValidationFail = false
      this.dns = await import('dns')
      this.net = await import('net')
      this.os = await import('os')

      let score = 0
      const promises = []

      const domain = this.email.slice(this.email.indexOf('@') + 1)

      if (this.config.ns !== -1) {
        promises.push(
          this.getNsRecord(domain)
            .then((addresses) => {
              if (addresses.length) {
                score += this.config.ns
              }
            })
            .catch((err) => {
              dnsValidationFail = true
              console.error('ERROR GETTING NS: ', err)
            })
        )
      }

      if (this.config.mx !== -1) {
        // Grab MX records.
        promises.push(
          this.getMxRecord(domain)
            .then((addresses) => {
              if (addresses.length) {
                score += this.config.mx
                if (this.config.port !== -1) {
                  // Check ports on MX records.
                  for (let p = 0; p < this.config.smtpPorts.length; p++) {
                    const port = this.config.smtpPorts[p]
                    for (let a = 0; a < addresses.length; a++) {
                      const host = addresses[a].exchange

                      promises.push(
                        this.isPortReachable(port, { host })
                          .then((reachable) => {
                            if (reachable) score += this.config.port
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

      if (this.config.spf !== -1) {
        // Grab TXT records and check for spf.
        promises.push(
          this.getTxtRecord(domain)
            .then((addresses) => {
              for (let a = 0; a < addresses.length; a++) {
                const address = addresses[a]

                if (address.indexOf('spf') !== -1) {
                  score += this.config.spf
                  break
                }
              }
            })
            .catch((err) => {
              console.error('ERROR GETTING TXT: ', err)
            })
        )
      }

      if (this.config.a !== -1) {
        promises.push(
          this.getARecord(domain)
            .then((addresses) => {
              if (addresses.length) {
                score += this.config.a
              }
            })
            .catch((err) => {
              console.error('ERROR GETTING A: ', err)
            })
        )
      }

      await Promise.all(promises)

      if (dnsValidationFail) return false

      if (this.config.validScore <= score) {
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
    this.email = email

    const dnsValid = await this.validateDNS()
    if (!dnsValid) return false

    return true
  }
}

export default EmailDnsValidator
