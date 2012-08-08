#bulldogjs testserver

##set up
    var testServer = require('./test-util/testserver.js');
    testServer.listen(3001, '127.0.0.1');

##changing content
You can simply hardcode content to be included in the response just by setting:

    testServer.currentResponse = '<div class="cat">crazy kitten</div>'

Alternatively, you can simply specify a selector to generate the html:

    testServer.change('div.cat', 'crazy kitten');

If already there is some content that matches your selector, no new element will be created, and the text will be replaced instead:

    testServer.change('div.cat', 'nihilist cat');
    // the server will respond with <div class="cat">nihilist cat</div>

When no text content is specified, random content will be generated for you:

    testServer.change('div.cat');
    //the server will now respond with some random stuff inside that div
    testServer.change('div.cat');
    //the server will respond with some different random stuff inside the div

##changing response codes
You can also just hardcode the response code:

    testServer.responseCode = 401;

Or you can use the accessors to switch to some states:

    testServer.status.fail();
    testServer.status.notFound();
    testServer.status.ok();

##accessing the last request the server responded to
You can get the request object belonging to the latest request the server responded to. This might be useful for some assertions (?)

    testServer.lastRequest