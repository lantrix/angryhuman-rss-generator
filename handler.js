/*eslint-env node*/
/*jshint esversion: 6 */
/*jshint node: true */

const bbpromise = require("bluebird");
const parser = bbpromise.promisify(require("rss-parser").parseURL);
const aws = require("aws-sdk");
const s3 = bbpromise.promisifyAll(new aws.S3());
const rss = require("rss"); // used by functions in lib
const fs = require("fs");

// Require Logic
var lib = require("./lib/rss.js");
Date.prototype.getMonthFormatted = function() {
	var month = this.getMonth() + 1;
	return month < 10 ? "0" + month : "" + month; // ("" + month) for string result
};
Date.prototype.getDayFormatted = function() {
	var day = this.getDate();
	return day < 10 ? "0" + day : "" + day; // ("" + day) for string result
};

// App setup
const sourceRssUri = "http://www.mediafire.com/rss.php?key=jyk6j7ogc076r";
const s3BucketName = "angryhumanrss";
const region = "us-east-1";
const dataFile = "data/rssdata";
const dataOutFile = "data/rssdata-out";
const rssFeed = "angryhuman.xml";

// Entrypoint for AWS Lambda
module.exports.generaterss = function() {
	"use strict";
	// AWS Setup
	aws.config.region = region;

	// Retrieve Source RSS promise
	var sourceRss = parser(sourceRssUri);

	var params = { Bucket: s3BucketName };
	var s3Data = s3.headBucketAsync(params).then(function() {
		var params = { Bucket: s3BucketName, Key: dataFile };
		return s3.getObjectAsync(params);
	}).then(function(data) {
		return JSON.parse(new Buffer(data.Body).toString("utf8"));
	}).catch(SyntaxError, function(e) {
		console.log("Error: ", e);
	})
	.catch(function(e) {
		//Catch any other error
		console.log("Catch: ", e);
	});

	// Chained retrieval promises - wait for them both
	bbpromise.all([sourceRss, s3Data]).then(function(result) {
		//result is an array contains the objects of the fulfilled promises.
		let itemsToAdd = [];
		const sourceRss = result[0];
		const rssData = result[1];

		sourceRss.feed.entries.forEach(function(newRssItem) {
			// Iterate through all the new RSS entries
			if ( newRssItem.guid !== null ) {
				// console.log("Create New Guid");
				var date = new Date(newRssItem.pubDate);
				//example: "AngryHuman-2012-06-19-22-00-00"
				newRssItem.guid = "AngryHuman-" + date.getFullYear()
						+ "-" + date.getMonthFormatted()
						+ "-" + date.getDayFormatted()
						+ "-" + date.getUTCHours()
						+ "-" + date.getMinutes()
						+ "-" + date.getSeconds();
				// console.log(newRssItem.pubDate);
				// console.log(newRssItem.guid);
			}
			let skip = false;
			rssData.forEach(function(existingRssItem) {
				// Iterate through all the existing RSS entries from our source data
				if (existingRssItem.guid == newRssItem.guid) {
					// See if entry afrom sourceRss lready exists in rssData if so skip
					skip = true;
				}
			});
			if (!skip) {
				// No match for this newRssItem in the existing entry - Add to list to publish
				itemsToAdd.push(newRssItem);
			}
		});
		return itemsToAdd;
	}).then(function(items) {
		// Create new RSS feed everytime
		var feed = lib.instantiateFeedObject();

		// Iterate over Source items and add to RSS Data
		items.forEach(function(entryToAdd) {
			feed.item({
				title:  entryToAdd.contentSnippet,
				description: entryToAdd.description,
				guid: entryToAdd.guid,
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
		return feed;
	}).then(function(feed) {
		// Save out RSS Data - testing to alt file
		var params = {
			Bucket: s3BucketName,
			Key: dataOutFile,
			Body: JSON.stringify(feed.entries),
			ContentType: "application/json"
		};
		s3.putObjectAsync(params);
		return feed;
	}).then(function(feed) {
		let xml = feed.xml({indent: true});
		var params = { 
			Bucket: s3BucketName,
			Key: rssFeed,
			Body: new Buffer(xml),
			ContentType: "application/xml"
		};
		return s3.putObjectAsync(params);
	})
	.catch(SyntaxError, function(e) {
		console.log("Error: ", e);
	})
	.catch(function(e) {
		//Catch any other error
		console.log("Catch: ", e);
	});
};
