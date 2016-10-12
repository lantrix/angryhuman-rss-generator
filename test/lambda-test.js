// Testing requirements
var chai = require("chai");
var jsonfile = require("jsonfile");
var expect = chai.expect;
var assert = chai.assert;

// Code requirements


// in your testfile
var lib = require("../lib/rss.js");
var lambda = require("../handler.js");
// var sinon = require("sinon");

describe("Lambda Test", function() {
	it("lambda handler runs", function(done) {
		// sinon.stub(lambda, 'instantiateFeedObject', function() {
		//   // whatever you would like innerLib.toCrazyCrap to do under test
		// });

		let event = jsonfile.readFile("../event.json");
		let a = lambda.generaterss(event);
		expect(a).to.be.a("string");
		expect(a).to.equal("Published XML");
		done();
		// sinon.assert.calledOnce(lib.instantiateFeedObject); // sinon assertion

		// lib.instantiateFeedObject.restore(); // restore original functionality
	});
});
