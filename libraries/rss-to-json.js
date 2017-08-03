const { promisify } = require('util')
const parse = promisify(require('rss-parser').parseURL)

/*
  takes a url as a parameter and parses it to JSON
*/
module.exports = (rssUrl, options) => parse(rssUrl)
  .then((result) => {
    return {
      feed: Object.assign({}, result.feed, { entries: undefined }),
      items: result.feed.entries
    }
  })
  .catch((e) => {
    console.error('Error trying to parse RSS feed: ', e)
    return {}
  })
