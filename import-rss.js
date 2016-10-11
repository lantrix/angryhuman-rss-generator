/*eslint-env node*/
"use strict";

const parser = require("rss-parser");
const aws = require("aws-sdk");
const s3 = new aws.S3();

const s3BucketName = "angryhumanrss";
const region = "us-east-1";
const dataFile = "data/rssdata";
var sourceRss = "data/angryhuman-archive.xml";

parser.parseFile(sourceRss, function(err, parsed) {
	console.log("Feed Title " + parsed.feed.title);
	parsed.feed.entries.forEach(function(entry) {
		console.log(entry.title + ":" + entry.link);
	});
	aws.config.region = region;
	var params = {
		Bucket: s3BucketName,
		Key: dataFile,
		Body: JSON.stringify(parsed.feed.entries),
		ContentType: "application/json"
	};
	s3.putObject(params, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else     console.log(data);           // successful response
	});
});
