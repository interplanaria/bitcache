const axios = require('axios')
class Txt {
  constructor(o) {
    if (!o) {
      console.log("txt config required")
      process.exit(1)
    }
    if (!o.url) {
      console.log("txt url required")
      process.exit(1)
    }
    this.url = o.url
    this.channel = (o.channel ? o.channel : "txt")
    this.headers = o.headers
    this.queue = new Set()
  }
  async last () {
    let res = await axios.get(this.url + "/" + this.channel + "/json?at=-null&limit=1")
    if (res.data.result.length > 0) {
      return res.data.result[0].i
    } else {
      return null;
    }
  }
  async start (fn) {
    for (let ev of this.queue) {
      let o = ev.data
      let f = fn[ev.type]
      if (!f) {
        f = (x) => {
          return {}
        }
      }
      let result = await f(o)
      if (result) {
        let res = await axios.post(this.url + "/api", {
          channel: this.channel,
          set: { [o.tx.h]: result }
        }, { headers: this.headers })
      } else {
        // ignored item
      }
      this.queue.delete(ev)
    }
    setTimeout(() => {
      this.start(fn)
    }, 1000)
  };
};
module.exports = Txt
