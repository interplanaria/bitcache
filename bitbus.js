const axios = require('axios')
const es = require('event-stream')
class Bitbus {
  constructor(o, txt) {
    if (!o.url) {
      console.log("bitbus url required")
      process.exit(1)
    }
    if (!o.query) {
      console.log("bitbus query required")
      process.exit(1)
    }
    this.url = {
      crawl: o.url + "/block",
      status: o.url + "/status"
    }
    this.query = JSON.parse(JSON.stringify(o.query))
    this.token = o.token;
    this.txt = txt
    this.from = o.from
    this.fresh = o.fresh
  }
  listen() {
    axios.get(this.url.status).then((res) => {
      if (this.checkpoint) {
        if (this.checkpoint < res.data.height) {
          // new checkpoint
          console.log("new checkpoint = ", this.checkpoint)
          this.checkpoint = res.data.height
          this.start({
            onend: () => {
              setTimeout(() => {
                this.listen(this.query)
              }, 1000)
            }
          })
        } else {
          // same height
          setTimeout(() => {
            this.listen(this.query)
          }, 10000)
        }
      } else {
        // checkpoint doesn't exist. first time
        this.checkpoint = res.data.height
        this.start({
          onend: () => {
            setTimeout(() => {
              this.listen()
            }, 1000)
          }
        })
      }
    })
  }
  async start(o) {
    const height = await this.txt.last()
    console.log("### height = ", height)
    if (this.fresh) {
      if (this.from) {
        this.query.q.find["blk.i"] = {
          $gte: this.from
        }
      }
    } else {
      if (height) {
        this.query.q.find["blk.i"] = {
          $gte: height
        }
      } else {
        if (this.from) {
          this.query.q.find["blk.i"] = {
            $gte: this.from
          }
        }
      }
    }
    if (o.ondata) this.ondata = o.ondata
    if (o.onend) this.onend = o.onend
    let res = await axios({
      url: this.url.crawl,
      method: "POST",
      data: this.query,
      responseType: "stream",
      headers: { 'Content-type': 'application/json; charset=utf-8', token: this.token },
    })
    res.data.pipe(es.split())
    .pipe(es.parse())
    .pipe(es.mapSync((data) => {
      this.ondata(data)
    }))
    .on("end", () => {
      this.onend()
    })
  }
}
module.exports = Bitbus
