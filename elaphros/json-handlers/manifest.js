let newrelic
if (process.env.NEW_RELIC_LICENSE_KEY) {
  newrelic = require('newrelic')
}

module.exports = function manifest(req, reply) {
  if (newrelic) {
    newrelic.setTransactionName('json-manifest')
  }

  reply.send({
    "short_name": "Bible.com",
    "name": "Bible.com",
    "icons": [
      {
        "src":"/static-assets/icons/bible/200/en.png",
        "sizes": "200x200",
        "type": "image/png"
      },
      {
        "src":"/static-assets/icons/bible/512/en.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ],
    "start_url": "/bible/111/JHN.3",
    "background_color": "#FFF",
    "theme_color": "#555",
    "display": "fullscreen",
    "prefer_related_applications": true,
    "related_applications": [
      {
        "platform": "play",
        "id": "com.sirma.mobile.bible.android"
      }
    ]
  })
}
