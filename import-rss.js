/*eslint no-undef: "error"*/
/*eslint-env node*/

var parser = require("rss-parser");
var jsonfile = require("jsonfile");

var dataFile = "data/rssdata.json";
var sourceRss = "http://microflapi.com/angryhuman/angryhuman-archive.xml";

parser.parseURL(sourceRss, function(err, parsed) {
	console.log(parsed.feed.title);
	parsed.feed.entries.forEach(function(entry) {
		console.log(entry);
	});
});
