
var request = require('request'),
	jsdom = require('jsdom');

function Bulldog(url, interval, opt){
	this.url = url;
	this.interval = interval;
	this.options = opt;
	this.events = {};
	this.lastBody = "";

	var self = this;
	function makeRequest(){

		request(url, function (error, response, body) {
			if (self.events["look"]){
				self.events["look"](body);
			}

		  if (!error && response.statusCode == 200) {
		  	if (body != self.lastBody && self.events['change']) {

		  		var changeEvents = self.events['change'];
		  		for(var i=0; i<changeEvents.length; i++) {
		  			if (!changeEvents[i].selector) {
		  				changeEvents[i].callback(body, self.lastBody);
		  				break;
		  			}
		  		}
		  		self.lastBody = body;

		  		if (self.events['change'] && self.events['change'].length > 0) {

		  			var jsdom    = require("jsdom").jsdom,
						    document = jsdom(body, null, { features: { QuerySelector : true	}}), 
						    window   = document.createWindow();

		  			for(var i=0; i<changeEvents.length; i++) {
		  				
		  				var result = window.document.querySelectorAll(changeEvents[i].selector);
		  				var lastResult = changeEvents[i].lastResult;
		  				
		  				if (result != lastResult){
		  					changeEvents[i].callback(result, lastResult);
		  					if (changeEvents[i])
		  						changeEvents[i].lastResult = result;
		  				}
		  			}

		  			window.close();
					}
				}
		  }
		  else {
		  	if (self.events["error"]){
					self.events["error"](error, response.statusCode);
				}
		  }
		});
	}

	this.timer = setInterval(makeRequest, interval);
};

module.exports = Bulldog;

Bulldog.watch = function(url, interval, opt){
	return new Bulldog(url, interval, opt);
};

Bulldog.prototype = {
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
			this.events[name].push(newEv);
		}
		else {
			this.events[name] = selector;	
		}

		return this;
	},
	off: function(name, selector){
		if (this.events[name]) {
			
			if (name === 'change' && typeof selector == "string") {
				var changeEvents = this.events[name];
				for (var i=0; i< changeEvents.length; i++){
					if (changeEvents[i].selector === selector){
						this.events[name].splice(i, 1);
						break;
					}
				}
			}
			else 
				delete this.events[name];
		}	

		return this;
	}
};
