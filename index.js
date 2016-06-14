var RSS = require("rss");

// Create Angry Human RSS feed
var feed = new RSS({
    title: "Angry Human",
    description: "David Biedny is just a human being who realizes that we're in a dangerous epoch, and he's concerned about the denial which is rampant in our society. Complacency is a disease of the soul, and Angry Human is the cure.",
    feed_url: "http://microflapi.com/angryhuman/angryhuman.xml",
    site_url: "http://www.rocklandworldradio.com/program/angryhuman",
    image_url: "http://example.com/icon.png",
    docs: "http://blogs.law.harvard.edu/tech/rss",
    managingEditor: "angryhuman@gmail.com",
    webMaster: "lantrix@pobox.com",
    copyright: "Copyright 2016 - Rockland World Radio",
    language: "en",
    categories: ["Society &amp; Culture"],
    pubDate: now(),
    ttl: "60",
    custom_namespaces: {
      "itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd"
    },
    custom_elements: [
    	{"itunes:explicit": "Yes"},
      {"itunes:owner": [{"itunes:name": "Lantrix"}, {"itunes:email": "lantrix@pobox.com"}]},
      {"itunes:author": "David Biedny"},
      {"itunes:image": {_attr: {href: "http://www.rocklandworldradio.com/imgs/programs/hosts/angry_human2.gif"}}},
      {"itunes:subtitle": "I'm mad as hell, and I'm not gonna take it anymore!"},
      {"itunes:summary": "David Biedny is just a human being who realizes that we're in a dangerous epoch, and he's concerned about the denial which is rampant in our society. Complacency is a disease of the soul, and Angry Human is the cure. Host: David Biedny"},
      {"itunes:category": [{_attr: {text: "Society &amp; Culture"}}]}
    ]
});

// TODO: Retrieve Source RSS

// loop over Source RSS data add to feed
feed.item({
    title:  "item title",
    description: "use this for the content. It can include html.",
    url: "http://example.com/article4?this&that", // link to the item
    guid: "1123", // optional - defaults to url
    categories: ["Category 1","Category 2","Category 3","Category 4"], // optional - array of item categories
    author: "Guest Author", // optional - defaults to feed author property
    date: "May 27, 2012", // any format that js Date can parse.
    lat: 33.417974, //optional latitude field for GeoRSS
    long: -111.933231, //optional longitude field for GeoRSS
    enclosure: {url:"...", file:"path-to-file"}, // optional enclosure
    custom_elements: [
      {"itunes:author": "John Doe"},
      {"itunes:subtitle": "A short primer on table spices"},
      {"itunes:image": {
        _attr: {
          href: "http://example.com/podcasts/everything/AllAboutEverything/Episode1.jpg"
        }
      }},
      {"itunes:duration": "7:04"}
    ]
});

// Write XML out to disk for feedburner to pick up
var xml = feed.xml();
