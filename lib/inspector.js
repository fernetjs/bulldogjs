
var cheerio = require('cheerio');

module.exports = {
  getContent: function(html, selector){
    var elements = [],
      $ = cheerio.load(html);

    var match = $(selector);
    
    for(var i=0; i< match.length; i++) {
      elements.push(match.eq(i).html());
    }

    return elements;
  }
};

