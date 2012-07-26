var cheerio = require('cheerio');

module.exports = {
  getContent: function(html, selector){
    var $ = cheerio.load(html);
    return $(selector).html();
  }
};