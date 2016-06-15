/*eslint no-undef: "error"*/
/*eslint-env node*/

var Feed = require("rss-to-json");
var jsonfile = require("jsonfile");

var file = "data/rssdata.json";
 
Feed.load("http://microflapi.com/angryhuman/angryhuman.xml", function(err, rss){
	jsonfile.writeFile(file, rss, function (jsonerr) {
		console.error(jsonerr);
	});
});