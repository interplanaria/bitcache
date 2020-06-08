const bitcache = require('../index')
const query = {
  "q": {
    "find": {
      "out.s2": "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut",
      "out.f3": { $exists: true }
    },
    "project": { "out.f3": 1, "tx.h": 1 }
  }
}
const transform = async (o) => {
  let filtered = o.out.filter((ou) => {
    return ou.f3
  })
  let f = filtered[0]
  return {
    meta: {},
    data: { uri: f.f3 }
  }
}
bitcache.init({
  socket: {
    url: "https://txo.bitsocket.network",
    query: query,
    transform: transform,
  },
  bus: {
//    fresh: true,
    from: 638000,
    url: "https://txo.bitbus.network",
    token: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxRzZhYldrNE5iOExzZURTWmQ0dGN5dUt5Q2paMzFzZzdzIiwiaXNzdWVyIjoiZ2VuZXJpYy1iaXRhdXRoIn0.SHpINkRSbEJ3UE5rMHJnektGclFSWlBGRUlWY1RMZFgwL1FVVVBiUzdNalhJMjVNbjdNeTE1VXI5WEVZUU5VRFhidEg0OHhrWTlQVTJCdTg2Tk1uMWpjPQ',
    query: query,
    transform: transform,
  },
  txt: {
    channel: "b",
    url: "http://localhost:3013",
  },
})
