# [![FeedAPI](/assets/header.svg)](https://www.github.com/krismuniz/feed-api)

[![Code-Style:Standard](https://img.shields.io/badge/code%20style-standard-green.svg?style=flat-square)](http://standardjs.com/) [![License:MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](http://opensource.org/licenses/MIT)

**FeedAPI** (i.e. `feed-api`) is a simple, ready-to-use microservice for parsing RSS feeds, optimizing each item using metadata and converting them to JSONFeed format.

#### How it works

[![Infographic: How FeedAPI works](/assets/how-it-works.svg)](https://www.github.com/krismuniz/feed-api)

FeedAPI takes an RSS Feed link, parses it, scrapes and collects [OpenGraph](http://ogp.me/) and [`<meta/>` tags](https://developer.mozilla.org/en/docs/Web/HTML/Element/meta) data from each item to ensure all items have all the data necessary in the proper format, and finally it presents the results in a minimal, developer-friendly format, [JSONFeed](https://jsonfeed.org).

#### Usage

To get a specific feed, simply add that URL to the `url` query parameter. Remember to safely escape it (e.g. use `encodeURIComponent` or something). Optionally, you may pass a `limit` query parameter to limit the number of items returned.

##### Example

To get [The Economist's Science and Technology RSS Feed](http://www.economist.com/sections/science-technology/rss.xml), just pass the escaped url to the root (`/`) endpoint.

```bash
curl https://your-url.now.sh/?url=http%3A%2F%2Fwww.economist.com%2Fsections%2Fscience-technology%2Frss.xml
```

A successfully-parsed rss feed will result in a `feed` object with the following shape:

```json
{
  "version": "https://jsonfeed.org/version/1",
  "title": "String (free-text)",
  "homepage_url": "String (url)",
  "feed_url": "String (url)",
  "description": "String (free-text)",
  "author": {
    "name": "String (free-text)",
    "url": "String (url)"
  },
  "items": [
    {
      "url": "String (url)",
      "title": "String (free-text)",
      "content_text": "String (free-text)",
      "image": "String (url)",
      "date_published": "String (date-format:rfc3339)",
      "author":{  
        "name": "String (free-text)",
        "url": "String (url)"
      }
    }
  ]
}
```

Not all fields will always be listed, it varies depending on the feed supplied. For more information, read the [JSONFeed v1 Spec](https://jsonfeed.org/version/1)

## One-click Cloud Deploys

You can deploy a FeedAPI server to any of these services with just one click!

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/krismuniz/feed-api.git)

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/krismuniz/feed-api)

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/krismuniz/feed-api)

## Deploy Locally

#### Clone the Repo

```bash
$ git clone git@github.com:krismuniz/feed-api.git feed-api
```

#### Install dependencies

```bash
$ npm install
```

#### Start the server with a `PORT` environment variable (default port is `3000`)

```bash
$ PORT=3000 npm start
```

## License

[MIT](https://github.com/krismuniz/feed-api/blob/master/LICENSE.md) © [Kristian Muñiz](https://www.krismuniz.com)
