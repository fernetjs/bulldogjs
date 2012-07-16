
var request = require('request'),
  jsdom = require('jsdom'),
  events = require('events');

function Dog(options){
  this.url = options.url;
  this.interval = options.interval;
  this.lastHtml = options.html;

  this.eventEmitter = new events.EventEmitter();
  this.selectors = [];

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

    if (name === 'change' && typeof selector == 'string') {
      name += '|' + selector;
      this.selectors.push({
        selector: selector,
        lastResult: this.setCurrentState(selector)
      });
    } 
    else if (name !== 'change' && name !== 'look' && name !== 'error'){
      callback(new Error('Event not supported'));
      return;
    }

    if (!callback)
      callback = selector;

    this.eventEmitter.addListener(name, callback);
    
    return this;
  },
  off: function(name, selector){

    if (name === 'change' && typeof selector == 'string') {
      name += '|' + selector;
      for (var i=0; i<this.selectors.length; i++){
        if (this.selectors[i].selector === selector){
          this.selectors.splice(i, 1);
          break;
        }
      }
    }
    else if (name !== 'change' && name !== 'look' && name !== 'error'){
      callback(new Error('Event not supported'));
      return;
    }

    this.eventEmitter.removeAllListeners(name);

    return this;
  },
  makeRequest: function(){
    var self = this;

    request(self.url, function (error, response, body) {

      self.eventEmitter.emit('look', body);

      if (!error && response.statusCode == 200) {
        self.updateChangeEvents(body);
        self.lastHtml = body;
      }
      else {
        self.eventEmitter.emit('error', error);
      }

    });
  },
  updateChangeEvents: function(html){
    if (html != this.lastHtml) {
      
      this.eventEmitter.emit('change', html, this.lastHtml);

      var window = this.initBrowserWindow(html);

      var selectorsUpdated = [];
      var selectors = this.selectors;
      for(var i=0; i < selectors.length; i++) {
        
        var result = window.document.querySelector(selectors[i].selector);
        var lastResult = selectors[i].lastResult;

        if (result) 
          result = result.outerHTML;

        if (result != lastResult){
          selectors[i].result = result;
          selectors[i].lastResult = lastResult;
          selectorsUpdated.push(selectors[i]);
        }
      }

      for (var i=0; i<selectorsUpdated.length; i++) {
        var obj = selectorsUpdated[i];
        this.eventEmitter.emit('change|' + obj.selector, obj.result, obj.lastResult);
      }
      
      window.close();
    }
  },
  initBrowserWindow: function(html){
    var document = jsdom.jsdom(html, null, { features: { QuerySelector : true }}); 
    return document.createWindow();
  },
  setCurrentState: function(selector){
    var window = this.initBrowserWindow(this.lastHtml);

    var result = window.document.querySelector(selector);
    if (result) 
      result = result.outerHTML;
    return result;
  }
};
