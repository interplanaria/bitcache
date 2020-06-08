EventSource = require('eventsource')
const ReconnectingEventSource = require('reconnecting-eventsource').default
class Bitsocket {
  constructor(o) {
    if (!o.url) {
      console.log("bitsocket url required")
      process.exit(1)
    }
    if (!o.query) {
      console.log("bitsocket query required")
      process.exit(1)
    }
    this.url = o.url
    this.query = o.query
  }
  start(cb) {
    console.log("starting with query", this.query)
    console.log("socket = ", this.url + "/s/")
    const b64 = Buffer.from(JSON.stringify(this.query)).toString("base64")
    const sock = new ReconnectingEventSource(this.url + "/s/" + b64)
    sock.addEventListener('error', (error) => {
      console.error('eventSource error', error);
    });
    sock.addEventListener('message', (e) => {
      let d =  JSON.parse(e.data).data
      d.forEach((x) => {
        cb(x)
      })
    });
  }
}
module.exports = Bitsocket
