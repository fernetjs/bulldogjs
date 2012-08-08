var put = require('put-selector'),
  cheerio = require('cheerio'),
  testServer;

module.exports = testServer = require('http').createServer(function (req, res) {
      res.writeHead(testServer.responseCode, {'Content-Type': 'text/html'});
      res.end(testServer.currentResponse);
      testServer.lastRequest = req;
    });

testServer.currentResponse = '';
testServer.responseCode = 200;
testServer.lastRequest = null;

testServer.change = function change(cssSelector, content){
  var contentToSet = content || generateRandomContent(),
    $ = cheerio.load(testServer.currentResponse),
    sel = $(cssSelector),
    putSel;

  if(sel.length){
    sel.text(contentToSet);
  }
  else {
    putSel = put(cssSelector, contentToSet);
    $.root().append(putSel.toString());
  }
  testServer.currentResponse = $.html();
};

testServer.status = {
  fail : function(){
    testServer.responseCode = 500;
  },
  notFound : function(){
    testServer.responseCode = 404;
  },
  ok : function(){
    testServer.responseCode = 200;
  }
};

function generateRandomContent(){
  var result = '';
  for(var i = 0; i < 100; i++){
    result+= String.fromCharCode(Math.floor(Math.random()*10000));
  }
  return result;
}
