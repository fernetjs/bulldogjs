var request = require('request');

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
		  	if (body != self.lastBody){
			    if (self.events["change"]){
						self.events["change"](body);
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
	on: function(name, cb){
		this.events[name] = cb;
		return this;
	}
};
