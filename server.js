const express = require('express')
const app = express()

const cache = require('./middleware/cache')
const fetchFeed = require('./libraries/fetch-feed')

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

app.get('/', cache(process.env.CACHE_MAX_AGE || 1800), async (req, res) => {
  if (req.query.url) {
    try {
      res.send(
        await fetchFeed(req.query.url, { limit: req.query.limit || 10 })
      )
    } catch (e) {
      res.status(400).send({
        error: 'The specified feed could not be fetched.'
      })
    }
  } else {
    res.status(400).send({
      error: 'No query parameter `url` provided'
    })
  }
})

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
