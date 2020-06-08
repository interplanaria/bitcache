const bitcache = require('../index')
const query = {
  "q": {
    "find": { "out.tape.cell.s": "18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p" },
    "project": { "out.tape.cell.s": 1, "out.tape.cell.f": 1, "tx.h": 1 }
  }
}
const transform = async (o) => {
  let out = o.out
  return {
    meta: {
      title: out[0].tape[2].cell[1].s,
      content: "bitpic for " + out[0].tape[2].cell[1].s + "\n\n ![image](https://x.bitfs.network/" + o.tx.h + ".out.0.3) \n\n- Profile page: https://bitpic.network/me/" + out[0].tape[2].cell[1].s + "\n- Image URL: https://bitpic.network/u/" + out[0].tape[2].cell[1].s + "\n- BitFS: https://view.bitfs.network/" + out[0].tape[1].cell[1].f,
      url: "https://bitpic.network/me/" + out[0].tape[2].cell[1].s,
      image: "https://x.bitfs.network/" + o.tx.h + ".out.0.3",
      description: "bitpic for " + out[0].tape[2].cell[1].s
    },
    data: {
      bitfs: "https://bitfs.network/" + out[0].tape[1].cell[1].f,
      uri: out[0].tape[1].cell[1].f,
      paymail: out[0].tape[2].cell[1].s,
    }
  }
}
bitcache.init({
  txt: {
    channel: "bitpic",
    url: "http://localhost:3013",
  },
  socket: {
    url: "https://bob.bitsocket.network",
    query: query,
    transform: transform
  },
  bus: {
    url: "https://bob.bitbus.network",
    token: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxRzZhYldrNE5iOExzZURTWmQ0dGN5dUt5Q2paMzFzZzdzIiwiaXNzdWVyIjoiZ2VuZXJpYy1iaXRhdXRoIn0.SHpINkRSbEJ3UE5rMHJnektGclFSWlBGRUlWY1RMZFgwL1FVVVBiUzdNalhJMjVNbjdNeTE1VXI5WEVZUU5VRFhidEg0OHhrWTlQVTJCdTg2Tk1uMWpjPQ',
    query: query,
    transform: transform
  }
})
