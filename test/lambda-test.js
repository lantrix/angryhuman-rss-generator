// Testing requirements
const jsonfile = require("jsonfile");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const AWS = require("aws-sdk-mock");


//App requirements
var lib = require("../lib/rss.js");
var app = require("../handler.js");

chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();

describe("Generate RSS in S3", function () {

	before(function () {
		AWS.mock("S3", "getObject", function (params, callback) {
			callback(null, "dummy-data");
		});
	});

	it("Lambda handler runs", function() {
		app.generaterss().should.eventually.equal("dummy-data");
	});

	after(function () {
		AWS.restore("S3", "getObject");
	});
});