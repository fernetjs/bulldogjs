
var jsdom = require('jsdom');

module.exports = {
  getContent: function(html, selector){

    var document = jsdom.jsdom(html, null, { 
      features: { QuerySelector : true }
    });
     
    var window = document.createWindow();

    var result = window.document.querySelector(selector);
    if (result) {
      result = result.outerHTML;
      
      if (result.charAt(result.length-1) === '\n')
        result = result.substr(0, result.length-1);
    }

    window.close();

    return result;
  }
};
