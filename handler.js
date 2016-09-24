/*eslint-env node*/
/*jshint esversion: 6 */
/*jshint node: true */

const aws = require("aws-sdk");
const bbpromise = require("bluebird");
const parser = bbpromise.promisify(require("rss-parser").parseURL);
const jsonfile = bbpromise.promisifyAll(require("jsonfile"));
const rss = require("rss"); // used by functions in lib
const fs = require("fs");
const AWS = require("aws-sdk");

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

const sourceRssUri = "http://www.mediafire.com/rss.php?key=jyk6j7ogc076r";
const dataFile = "data/rssdata.json";
const dataOutFile = "data/rssdata-out.json";
//const rssFeedFile = "/var/www/angryhuman/angryhuman.xml";
const rssFeedFile = "data/angryhuman.xml";

// Entrypoint for AWS Lambda
module.exports.generaterss = function() {
	"use strict";
	// Retrieve Local RSS Data
	// TODO: create file if not exists
	var rssData = jsonfile.readFileAsync(dataFile);

	// Create new RSS feed everytime
	var feed = lib.instantiateFeedObject();

	// Retrieve Source RSS
	var sourceRss = parser(sourceRssUri);

	bbpromise.all([sourceRss, rssData]).then(function(result) {
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
			let skip = false
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

		// Iterate over Source items and add to RSS Data
		itemsToAdd.forEach(function(entryToAdd) {
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
	}).then(
		// Save out Local RSS Data
		jsonfile.writeFileAsync(dataOutFile, feed.entries).then(function(result){
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
		})
		.catch(SyntaxError, function(e) {
			console.log("Error: ", e);
		})
		.catch(function(e) {
			//Catch any other error
			console.log("Catch: ", e);
		})
	)
	.catch(SyntaxError, function(e) {
		console.log("Error: ", e);
	//Catch any other error
	}).catch(function(e) {
		console.log("Catch: ", e);
	});
};