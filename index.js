/*eslint-env node*/
"use strict";

var parser = require("rss-parser");
var jsonfile = require("jsonfile");
var rss = require("rss");
var fs = require("fs");

var sourceRss = "http://www.mediafire.com/rss.php?key=jyk6j7ogc076r";

let dataFile = "data/rssdata.json";

let rssFeedFile = "/var/www/angryhuman/angryhuman.xml";

// Load existing RSS Data
fs.exists(dataFile, function(exists) {
    if (exists) {
    	var rssData = jsonfile.readFileSync(dataFile);
    } else {
		// TODO: create file if not exists.
		// jsonfile.writeFile(dataFile, "[{}]", function (err) {
		// 	console.error(err);
		// });
	}
});

// Retrieve Source RSS
let sourceRssData = [];
parser.parseURL(sourceRss, function(err, parsed) {
	sourceRssData = parsed.feed;
});

// Create RSS feed Object
let feed = new rss({
	title: "Angry Human",
	description: "David Biedny is just a human being who realizes that we're in a dangerous epoch, and he's concerned about the denial which is rampant in our society. Complacency is a disease of the soul, and Angry Human is the cure.",
	feed_url: "http://microflapi.com/angryhuman/angryhuman.xml",
	site_url: "http://www.rocklandworldradio.com/program/angryhuman",
	image_url: "http://example.com/icon.png",
	docs: "http://blogs.law.harvard.edu/tech/rss",
	managingEditor: "angryhuman@gmail.com (David Biedny)",
	webMaster: "lantrix@pobox.com (Lantrix)",
	copyright: "Copyright 2016 - Rockland World Radio",
	language: "en",
	categories: ["Society &amp; Culture"],
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
		{"itunes:category": [{_attr: {text: "Society &amp; Culture"}}]}
	]
});

// TODO: Iterate over Source items and add to RSS Data
feed.item({
	title:  "item title",
	description: "use this for the content. It can include html.",
	guid: "1123", // optional - defaults to url
	date: "May 27, 2012", // any format that js Date can parse.
	enclosure: {
            "size": "71548865",
            "type": "application/octet-stream",
            "url": "http://www.mediafire.com/download/wm3wzzw10243aas/ar_ah_07-29-15.mp3"
        }, // optional enclosure
	custom_elements: [
		{"itunes:explicit": "Yes"},
		{"itunes:duration": "1:00"}
	]
});

// Write XML out to disk for feedburner to pick up
let xml = feed.xml({indent: true});
let buffer = new Buffer(feed.xml());
fs.open(rssFeedFile, 'w', function(err, fd) {
    if (err) {
        throw 'error opening file: ' + err;
    }
    fs.write(fd, buffer, 0, buffer.length, null, function(err) {
        if (err) throw 'error writing file: ' + err;
        fs.close(fd, function() {
            console.log('file written');
        })
    });
});
fs.writeFile(rssFeedFile, xml, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
