var rss = require("rss"); // used by functions in lib
module.exports.instantiateFeedObject = function() {
	"use strict";
	// Create RSS feed Object
	var feed = new rss({
		title: "Angry Human",
		description: "David Biedny is just a human being who realizes that we're in a dangerous epoch, and he's concerned about the denial which is rampant in our society. Complacency is a disease of the soul, and Angry Human is the cure.",
		feed_url: "http://angryhumanrss.s3-website-us-east-1.amazonaws.com/angryhuman.xml",
		site_url: "http://www.rocklandworldradio.com/program/angryhuman",
		image_url: "http://example.com/icon.png",
		docs: "http://blogs.law.harvard.edu/tech/rss",
		managingEditor: "angryhuman@gmail.com (David Biedny)",
		webMaster: "lantrix@pobox.com (Lantrix)",
		copyright: "Copyright 2016 - Rockland World Radio",
		language: "en",
		categories: ["Society & Culture"],
		pubDate: Date.now(),
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
			{"itunes:category": [{_attr: {text: "Society & Culture"}}]}
		]
	});
	return feed;
};
