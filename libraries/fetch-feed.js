const transformFeed = require('./transform-feed')
const rssToJSON = require('./rss-to-json')
const parseRSS = (url, options) => rssToJSON(url, options)

/*
  given a url, returns a feed
*/
module.exports = async (url, options = { limit: 10 }) => {
  try {
    const feed = await parseRSS(url, {
      api_key: process.env.RSS_TO_JSON_API_KEY,
      order_by: 'pubDate',
      order_dir: 'desc',
      count: options.limit
    })

    if (feed && feed.feed) {
      return {
        version: 'https://jsonfeed.org/version/1',
        title: feed.feed.title,
        feed_url: feed.feed.feedUrl || url,
        description: feed.feed.description,
        author: {
          name: feed.feed.author || feed.feed.creator || undefined,
          url: feed.feed.link || feed.feed.feedUrl || feed.feed.url || url
        },
        items: (await transformFeed(feed, options.limit)).filter(Boolean)
      }
    } else {
      console.error('No feed detected: ', feed)
      return {}
    }
  } catch (e) {
    console.error('Error trying to fetch a feed: ', e)
    return {}
  }
}
