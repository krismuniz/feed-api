const url = require('url')
const isAbsoluteUrl = require('is-absolute-url')
const htmlToText = require('html-to-text')
const formatDate = require('date-fns/format')

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

const { scrapeUrl } = require('metascraper')

/*
  crawls each url for better metadata if available
*/
module.exports = (feed, limit = 10) => {
  try {
    return Promise.all(
      feed.items.slice(0, limit).map((item) => {
        if (item.link) {
          return scrapeUrl(item.link).then(
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
                  id: item.guid || typeof item.id === 'string' ? item.id : item.link,
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
            },
            function failure (error) {
              console.log('Error with parsing OpenGraph data: ', error)
              return false
            }
          )
        } else {
          return false
        }
      })
    )
  } catch (e) {
    console.error('Error while trying to transform feed: ', e)
    return undefined
  }
}
