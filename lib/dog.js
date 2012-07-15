
var request = require('request'),
  jsdom = require('jsdom');

function Dog(options){
  this.url = options.url;
  this.interval = options.interval;
  
  this.events = {};
  this.lastHtml = options.html;

  this.start();
};

module.exports = Dog;

Dog.prototype = {
  start: function(){
    var self = this;
    this.timer = setInterval(function(){
      self.makeRequest();
    }, this.interval);
  },
  wait: function(){
    clearInterval(this.timer);
  },
  on: function(name, selector, callback){
    
    if (name === 'change'){
      this.events[name] = this.events[name] || [];
      var cb = callback;

      var newEv = {};

      if (typeof selector == "string") {
        newEv.selector = selector;
      }
      else cb = selector;

      newEv.callback = cb;
      var self = this;

      if (newEv.selector)
        this.setCurrentState(newEv);
      
      self.events[name].push(newEv);
    }
    else {
      this.events[name] = selector; 
    }

    return this;
  },
  off: function(name, selector){
    if (this.events[name]) {
      
      if (name === 'change') {
        var changeEvents = this.events[name];

        for (var i=0; i< changeEvents.length; i++){
          if (changeEvents[i].selector === selector) {
            this.events[name].splice(i, 1);
            break;
          }
        }
      }
      else 
        delete this.events[name];
    } 

    return this;
  },
  makeRequest: function(){
    var self = this;

    request(self.url, function (error, response, body) {
      if (self.events["look"]){
        self.events["look"](body);
      }

      if (!error && response.statusCode == 200) {
        self.updateChangeEvents(body);
        self.lastHtml = body;
      }
      else {
        if (self.events["error"]){
          self.events["error"](error, response.statusCode);
        }
      }
    });
  },
  updateChangeEvents: function(html){
    var changeEvents = this.events['change'];
    if (changeEvents && changeEvents.length > 0 && html != this.lastHtml) {
  
      var window = this.initBrowserWindow(html);

      function getCall(cb, before, after){
        var func = (function(f, params) {
          return { 
            do: function() {
              f.call(null, params);
            }
          };
        })(cb, [before, after]);

        return func;
      }

      var calls = [];
      for(var i=0; i<changeEvents.length; i++) {
      
        if (!changeEvents[i].selector) {          
          calls.push(getCall(changeEvents[i].callback, html, this.lastHtml));
        }
        else {
          var result = window.document.querySelector(changeEvents[i].selector);
          var lastResult = changeEvents[i].lastResult;

          if (result) 
            result = result.outerHTML;

          if (result != lastResult){
            changeEvents[i].lastResult = result;
            calls.push(getCall(changeEvents[i].callback, result, lastResult));   
          }
        }
      }

      for (var i=0; i<calls.length; i++) 
        calls[i].do();
      
      window.close();
    }
  },
  initBrowserWindow: function(html){
    var document = jsdom.jsdom(html, null, { features: { QuerySelector : true }}); 
    return document.createWindow();
  },
  setCurrentState: function(changeEvt){
    var window = this.initBrowserWindow(this.lastHtml);

    var result = window.document.querySelector(changeEvt.selector);
    if (result) 
      result = result.outerHTML;

    changeEvt.lastResult = result;
  }
};


