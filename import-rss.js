/*eslint-env node*/
"use strict";

var parser = require("rss-parser");
var jsonfile = require("jsonfile");

var dataFile = "data/rssdata.json";
var sourceRss = "http://microflapi.com/angryhuman/angryhuman-archive.xml";

parser.parseURL(sourceRss, function(err, parsed) {
	console.log("Feed Title " + parsed.feed.title);
	parsed.feed.entries.forEach(function(entry) {
		console.log(entry.title + ":" + entry.link);
	});
	jsonfile.writeFile(dataFile, parsed.feed.entries, function (err) {
		console.error(err);
	});
});
