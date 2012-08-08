ORDERED_TESTS = test/core.js test/events.js test/look.events.js test/change.events.js test/error.events.js

test:	
	./node_modules/.bin/mocha $(ORDERED_TESTS) --reporter spec

.PHONY: test