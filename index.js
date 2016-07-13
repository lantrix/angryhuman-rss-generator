/*eslint-env node*/
"use strict";

let Promise = require("bluebird");
let parser = Promise.promisify(require("rss-parser").parseURL);;
let jsonfile = require("jsonfile");
let rss = require("rss");
let fs = require("fs");

var sourceRss = "http://www.mediafire.com/rss.php?key=jyk6j7ogc076r";

let dataFile = "data/rssdata.json";

let rssFeedFile = "/var/www/angryhuman/angryhuman.xml";

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

// Retrieve Source RSS
parser(sourceRss).then(function(contents) {
    return eval(contents);
}).then(function(result) {
	// TODO: create file if not exists.
	var rssData = jsonfile.readFileSync(dataFile);
	let itemsToAdd = [];
	// TODO: see if entry already exists in rssData if so skip
	result.feed.entries.forEach(function(newRssItem) {
		if ( newRssItem.guid !== null ) {
			console.log("TODO: Create New Guid from timestamp to compare to existing (see if to add)");
		} else {
			console.log("New Item Guid: " + newRssItem.guid);
		}
		rssData.forEach(function(existingRssItem) {
			console.log(existingRssItem.guid);
		});
	});	
	// Iterate over Source items and add to RSS Data
	result.feed.entries.forEach(function(entry) {
		feed.item({
			title:  entry.contentSnippet,
			description: entry.description,
			//guid: "", TODO: Generate GUID
			date: entry.pubDate,
			enclosure: {
				// "size": "71548865" - TODO: get header length of file
				"type": "application/octet-stream",
				"url": entry.link
			},
			custom_elements: [
				{"itunes:explicit": "Yes"},
				{"itunes:duration": "1:00"}
			]
		});
	});
	// Write XML out to disk for feedburner to pick up
	let xml = feed.xml({indent: true});
	let buffer = new Buffer(xml);
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
}).catch(SyntaxError, function(e) {
    console.log("Error: ", e);
//Catch any other error
}).catch(function(e) {
    console.log("Catch: ", e);
});

