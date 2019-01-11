const crypto = require('crypto')
class Appkey {
  constructor(accessKey, secretKey) {
    this.accessKey = accessKey
    this.secretKey = secretKey
    this.hmac = crypto('sha265', secretKey)
  }
  verify({accesskey, sign, ts}) {
    if (!this.accessKey && !this.secretKey) {
      return true
    }

    if (!accesskey || !sign || !ts) {
      return false
    }

    const current = new Date().getTime()
    if ((current - ts)/60000 > 15 ) {
      return false
    }

    const calcSign = this.hmac.update(ts).digest().toString('base64')

    return this.accessKey === accesskey && calcSign === sign
  }
}

module.exports = Appkey