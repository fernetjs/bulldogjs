
var jsdom = require('jsdom');

module.exports = {
  getContent: function(html, selector){

    var document = jsdom.jsdom(html, null, { features: { QuerySelector : true }}); 
    var window = document.createWindow();

    var result = window.document.querySelector(selector);
    if (result) 
      result = result.outerHTML;

    window.close();

    return result;
  }
};
