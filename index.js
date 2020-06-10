/**************************************************************************
*
* Bitcache
* > A peer to peer electronic cache system for Bitbus and Bitsocket
*
* Filters Bitbus and/or Bitsocket and stores into TXT.
*
**************************************************************************/
const Bitbus = require('./bitbus')
const Bitsocket = require('./bitsocket')
const Txt = require('./txt')
const init = async (c) => {
  // start txt
  const trans = {}
  const txt = new Txt(c.txt)
  if (c.socket && c.socket.transform) trans.socket = c.socket.transform 
  if (c.bus && c.bus.transform) trans.bus = c.bus.transform 
  txt.start(trans)
  if (c.bus) {
    // bus only
    const bitbus = new Bitbus(c.bus, txt)
    // start bitbus
    bitbus.start({
      ondata: (data) => {
        txt.queue.add({ type: 'bus', data: data })
      },
      onend: () => {
        let interval = setInterval(() => {
          txt.status().then((status) => {
            console.log("status = ", status)
            if (!status || status && status.queue.size === 0) {
              console.log("queue empty. ready to listen...")
              clearInterval(interval)
              if (c.socket) {
                console.log("bitsocket start listening...")
                const bitsocket = new Bitsocket(c.socket)
                bitsocket.start((data) => {
                  txt.queue.add({ type: 'socket', data: data })
                })
              }
              console.log("bitbus start listening...")
              bitbus.listen()
            }
          })
        }, 1000)
      },
    })
  } else if (c.socket) {
    // socket only
    const bitsocket = new Bitsocket(c.socket)
    bitsocket.start((data) => {
      txt.queue.add({ type: 'socket', data: data })
    })
  } else {
    // meaningless
    console.log("need at least bus or socket")
    process.exit()
  }
}
module.exports = { init: init }
