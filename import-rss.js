/*eslint-env node*/
"use strict";

const parser = require("rss-parser");
const aws = require("aws-sdk");
const s3 = new aws.S3();
const yaml_config = require("node-yaml-config");

var config = yaml_config.load(__dirname + "/config.yml");
var sourceRss = "data/angryhuman-archive.xml"; // Baseline XML of live podcasts - used to populate S3 data of RSS items

parser.parseFile(sourceRss, function(err, parsed) {
	console.log("Feed Title " + parsed.feed.title);
	parsed.feed.entries.forEach(function(entry) {
		console.log(entry.title + ":" + entry.link);
	});
	aws.config.region = config.region;
	var params = {
		Bucket: config.bucket,
		Key: config.dataKey,
		Body: JSON.stringify(parsed.feed.entries),
		ContentType: "application/json"
	};
	s3.putObject(params, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else     console.log(data);           // successful response
	});
});
