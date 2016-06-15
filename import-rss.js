/*eslint no-undef: "error"*/
/*eslint-env node*/

var Feed = require("rss-to-json");
var fs = require("fs");

Feed.load("http://microflapi.com/angryhuman/angryhuman.xml", function(err, rss){
	fs.writeFile("data/rssdata.json", rss, function(err) {
		if(err) {
			return console.log(err);
		}
	});
});