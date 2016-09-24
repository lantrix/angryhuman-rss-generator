// Testing requirements
var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;

// Code requirements
// var lambda = require("../handler.js");

// Invoke lambda function locally
// lambda.generaterss();

// var foo = "bar";
// var tea = [];
// tea.flavors = "yyy";

var lib = require("../lib/rss.js");
var feed = lib.instantiateFeedObject();

describe("RSS Feed generation", function() {
	it("feed be an object of type RSS", function(done) {
		expect(feed).to.be.a("object");
		expect(feed).to.have.property("title");
		done();
	});

	it("feed have expected property values", function(done) {
		chai.should();
		feed.should.have.property("title")
		.with.value("Angry Human");
		done();
	});

	// it("assert expected values", function(done) {
	// 	assert.typeOf(foo, 'string');
	// 	assert.equal(foo, 'bar');
	// 	assert.lengthOf(foo, 3)
	// 	assert.property(tea, 'flavors');
	// 	assert.lengthOf(tea.flavors, 3);

	// 	done();
	// });

});
