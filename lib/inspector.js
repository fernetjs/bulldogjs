
var jsdom = require('jsdom');

module.exports = {
  getContent: function(html, selector){

    var document = jsdom.jsdom(html, null, { 
      features: { QuerySelector : true }
    });
     
    var result = document.querySelector(selector);
    if (result) {
      result = result.outerHTML;
      
      if (result.charAt(result.length-1) === '\n')
        result = result.substr(0, result.length-1);
    }

    return result;
  }
};
