// Testing requirements
var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;

// Code requirements


// in your testfile
var lib = require("../lib/rss.js");
var lambda = require("../handler.js");
var sinon = require("sinon");

describe("Lambda Test", function() {
  it("lambda handler runs", function(done) {
    // sinon.stub(lambda, 'instantiateFeedObject', function() {
    //   // whatever you would like innerLib.toCrazyCrap to do under test
    // });

    let a = lambda.generaterss();
	expect(a).to.be.an("object");
	expect(a).to.have.property("z");
	done();
    sinon.assert.calledOnce(lib.instantiateFeedObject); // sinon assertion

    lib.instantiateFeedObject.restore(); // restore original functionality
  });
});
