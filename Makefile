REPORTER = spec

all: jshint test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --growl --recursive --reporter $(REPORTER) --timeout 3000 -u bdd

jshint:
	jshint lib examples test handler.js

tests: test

tap:
	@NODE_ENV=test ./node_modules/.bin/mocha -R tap > results.tap

unit:
	@NODE_ENV=test ./node_modules/.bin/mocha --recursive -R xunit > results.xml --timeout 3000

skel:
	mkdir examples lib test
	touch handler.js
	npm install mocha chai --save-dev

.PHONY: test tap unit jshint skel
