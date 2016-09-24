// Testing requirements
var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;

var lib = require("../lib/rss.js");

describe("RSS Feed generation", function() {

    var feed = lib.instantiateFeedObject();
	
	it("feed be an object of type RSS", function(done) {
		expect(feed).to.be.a("object");
		done();
	});

	it("feed have expected property values", function(done) {
		expect(feed).to.have.deep.property("title").to.equal("Angry Human");
		expect(feed).to.have.deep.property("feed_url").to.equal("http://angryhumanrss.s3-website-us-east-1.amazonaws.com/angryhuman.xml");
		done();
	});
});
