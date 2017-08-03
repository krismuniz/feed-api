const mcache = require('memory-cache')

/*
  Middleware for storing results in memory
*/
module.exports = (duration) => (req, res, next) => {
  let key = '__express__' + req.originalUrl || req.url
  let cachedBody = mcache.get(key)

  if (cachedBody) {
    res.send(cachedBody)
  } else {
    res.sendResponse = res.send
    res.send = (body) => {
      mcache.put(key, body, duration * 1000)
      res.sendResponse(body)
    }
    next()
  }
}
