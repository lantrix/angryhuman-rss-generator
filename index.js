/*eslint-env node*/
"use strict";

let Promise = require("bluebird");
let parser = Promise.promisify(require("rss-parser").parseURL);
let jsonfile = Promise.promisifyAll(require("jsonfile"));
let rss = require("rss");
let fs = require("fs");

var sourceRssUri = "http://www.mediafire.com/rss.php?key=jyk6j7ogc076r";

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

// Retrieve Local RSS Data
// TODO: create file if not exists
let rssData = jsonfile.readFileAsync(dataFile);

// Retrieve Source RSS
let sourceRss = parser(sourceRssUri);

Promise.all([sourceRss, rssData]).then(function(result) {
    //result is an array contains the objects of the fulfilled promises.
	let itemsToAdd = [];
	let sourceRss = result[0];
	let rssData = result[1];

	// TODO: see if entry already exists in rssData if so skip
	sourceRss.feed.entries.forEach(function(newRssItem) {
		let guidToCompare = "";
		if ( newRssItem.guid !== null ) {
			console.log("Create New Guid");
			// guidToCompare = ??
		} else {
			guidToCompare = newRssItem.guid;
		}
		rssData.forEach(function(existingRssItem) {
			if (existingRssItem.guid == guidToCompare) {
				itemsToAdd.push(existingRssItem);
			}
		});
	});	

	// Iterate over Source items and add to RSS Data
	itemsToAdd.entries.forEach(function(entryToAdd) {
		feed.item({
			title:  entryToAdd.contentSnippet,
			description: entryToAdd.description,
			//guid: "", TODO: Generate GUID
			date: entryToAdd.pubDate,
			enclosure: {
				// "size": "71548865" - TODO: get header length of file
				"type": "application/octet-stream",
				"url": entryToAdd.link
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
