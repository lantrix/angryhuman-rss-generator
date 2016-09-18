var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;

require("../handler.js");

// var AWS = require("aws-sdk");

// exports.handler = function(event, context) {
//   var sns      = AWS.SNS();
//   var dynamoDb = AWS.DynamoDB();
//   // do something with the services e.g. sns.publish
// }

var foo = "bar";
var tea = [];
tea.flavors = "yyy";

describe("testStuff", function() {

	it("expect values", function(done) {
		expect(foo).to.be.a("string");
		expect(foo).to.equal("bar");
		expect(foo).to.have.length(3);
		expect(tea).to.have.property("flavors")
		.with.length(3);
		done();
	});

	it("should have expected values", function(done) {
		chai.should();

		foo.should.be.a('string');
		foo.should.equal('bar');
		foo.should.have.length(3);
		tea.should.have.property('flavors')
		.with.length(3);

		done();
	});

	it("assert expected values", function(done) {
		assert.typeOf(foo, 'string');
		assert.equal(foo, 'bar');
		assert.lengthOf(foo, 3)
		assert.property(tea, 'flavors');
		assert.lengthOf(tea.flavors, 3);

		done();
	});

});
