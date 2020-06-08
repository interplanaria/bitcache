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
        // socket after bus
        if (c.socket) {
          const bitsocket = new Bitsocket(c.socket)
          bitsocket.start((data) => {
            txt.queue.add({ type: 'socket', data: data })
          })
        }
        bitbus.listen()
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
