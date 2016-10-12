/*eslint-env node*/
/*jshint esversion: 6 */
/*jshint node: true */

const bbpromise = require("bluebird");
const parser = bbpromise.promisify(require("rss-parser").parseURL);
const aws = require("aws-sdk");
const yaml_config = require("node-yaml-config");


// Require Logic
var lib = require("./lib/rss.js");

//Prototype constructors for custom methods for formatting GUID timestrings for RSS feed
Date.prototype.getMonthFormatted = function() {
	var month = this.getMonth() + 1;
	return month < 10 ? "0" + month : "" + month; // ("" + month) for string result
};
Date.prototype.getDayFormatted = function() {
	var day = this.getDate();
	return day < 10 ? "0" + day : "" + day; // ("" + day) for string result
};
Date.prototype.getUTCHoursFormatted = function() {
	var hours = this.getUTCHours();
	return hours < 10 ? "0" + hours : "" + hours; // ("" + hours) for string result
};
Date.prototype.getMinutesFormatted = function() {
	var minutes = this.getMinutes();
	return minutes < 10 ? "0" + minutes : "" + minutes; // ("" + minutes) for string result
};
Date.prototype.getSecondsFormatted = function() {
	var seconds = this.getSeconds();
	return seconds < 10 ? "0" + seconds : "" + seconds; // ("" + seconds) for string result
};

// Load app config
var config = yaml_config.load(__dirname + "/config.yml");

// Entrypoint for AWS Lambda
module.exports.generaterss = function() {
	"use strict";
	// AWS Setup
	const s3 = bbpromise.promisifyAll(new aws.S3());
	aws.config.region = config.region;

	// Retrieve Source RSS promise
	var sourceRss = parser(config.sourceRssUri).catch(SyntaxError, function(e) {
		console.log("Error: ", e);
	})
	.catch(function(e) {
		console.log("Catch: ", e);
	});

	// Retrieve RSS data from S3 promise
	var params = { Bucket: config.bucket };
	var s3Data = s3.headBucketAsync(params).then(function() {
		var params = { Bucket: config.bucket, Key: config.dataKey };
		return s3.getObjectAsync(params);
	}).then(function(data) {
		return JSON.parse(new Buffer(data.Body).toString("utf8"));
	}).catch(SyntaxError, function(e) {
		console.log("Error: ", e);
	})
	.catch(function(e) {
		console.log("Catch: ", e);
	});

	// Chained retrieval promises - wait for them both
	bbpromise.all([sourceRss, s3Data]).then(function(result) {
		let itemsToAdd = [];
		//result is an array contains the objects of the fulfilled promises.
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
					+ "-" + date.getUTCHoursFormatted()
					+ "-" + date.getMinutesFormatted()
					+ "-" + date.getSecondsFormatted();
				// console.log(newRssItem.pubDate);
				// console.log(newRssItem.guid);
			}
			let skip = false;
			rssData.forEach(function(existingRssItem) {
				// Iterate through all the existing RSS entries from our source data
				if (existingRssItem.guid == newRssItem.guid) {
					// See if entry from sourceRss already exists in rssData if so skip
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
			Bucket: config.bucket,
			Key: config.dataOutKey,
			Body: JSON.stringify(feed.entries),
			ContentType: "application/json"
		};
		s3.putObjectAsync(params);
		return feed;
	}).then(function(feed) {
		let xml = feed.xml({indent: true});
		var params = { 
			Bucket: config.bucket,
			Key: config.rssKey,
			Body: new Buffer(xml),
			ContentType: "application/xml"
		};
		return s3.putObjectAsync(params);
	})
	.catch(SyntaxError, function(e) {
		console.log("Error: ", e);
	})
	.catch(function(e) {
		console.log("Catch: ", e);
	});
};
