const url = require('url')
const isAbsoluteUrl = require('is-absolute-url')
const htmlToText = require('html-to-text')
const formatDate = require('date-fns/format')
const request = require('request-promise-native')

const stripHTML = (string) => htmlToText.fromString(string, { ignoreImage: true }).trim()

const getAbsoluteUrl = (input, base) => {
  if (isAbsoluteUrl(input)) {
    return input
  } else {
    const absUrl = new url.URL(input, base)
    return absUrl.toString()
  }
}

const getBase = (s) => {
  const { protocol, host } = url.parse(s)
  return (protocol && host) ? protocol + '//' + host : undefined
}

const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-clearbit-logo')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')()
])

/*
  crawls each url for better metadata if available
*/
module.exports = (feed, limit = 10) => {
  try {
    return Promise.all(
      feed.items.slice(0, limit).map(async (item) => {
        if (!item.link) return false

        try {
          const html = await request(item.link)

          return metascraper({ html, url: item.link }).then(
            function success (result) {
              if (item && result) {
                const ogImage = result.image
                const ogDescription = result.description

                const image = ogImage
                  ? isAbsoluteUrl(ogImage)
                    ? ogImage
                    : getBase(item.link)
                      ? getAbsoluteUrl(ogImage, getBase(item.link))
                      : undefined
                  : undefined
                const contentText = ogDescription || item.description

                return {
                  id: item.id || item.guid || item.link,
                  url: item.link,
                  title: item.title,
                  content_text: stripHTML(contentText),
                  image: image,
                  date_published: result.date || formatDate(item.pubDate),
                  author: {
                    name: item.creator || item.author || result.author || result.publisher || undefined,
                    url: item.link ? getBase(item.link) : undefined
                  }
                }
              } else {
                return false
              }
            }
          )
        } catch (e) {
          console.log('Error with parsing OpenGraph data: ', e)
          return false
        }
      })
    )
  } catch (e) {
    console.error('Error while trying to transform feed: ', e)
    return undefined
  }
}
