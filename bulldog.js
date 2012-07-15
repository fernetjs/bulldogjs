
var request = require('request'),
	jsdom = require('jsdom');

function Bulldog(url, interval, opt){
	this.url = url;
	this.interval = interval;
	this.options = opt;
	this.events = {};
	this.lastBody = "";

	var self = this;
	this.timer = setInterval(function(){
		self.makeRequest();
	}, interval);
};

module.exports = Bulldog;

Bulldog.watch = function(url, interval, opt){
	return new Bulldog(url, interval, opt);
};

Bulldog.stopWatch = function(){
	clearInterval(this.timer);
	//TODO: destroy or has a startWatch to resume?
	return this;
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
		if (changeEvents && changeEvents.length > 0 && html != this.lastBody) {
	
			var window = this.initBrowserWindow(html);

			for(var i=0; i<changeEvents.length; i++) {
				
				if (!changeEvents[i].selector) {
					changeEvents[i].callback(html, this.lastBody);
					this.lastBody = html;
				}
				else {
					var result = window.document.querySelectorAll(changeEvents[i].selector);
					var lastResult = changeEvents[i].lastResult;
					
					if (result != lastResult){
						changeEvents[i].callback(result, lastResult);
						if (changeEvents[i])
							changeEvents[i].lastResult = result;
					}
				}
			}

			window.close();
		}
	},
	initBrowserWindow: function(html){
    var document = jsdom.jsdom(html, null, { features: { QuerySelector : true	}}); 
    return document.createWindow();
	}
};


