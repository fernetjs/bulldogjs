var request = require('request');

function Bulldog(url, interval, opt){
	this.url = url;
	this.interval = interval;
	this.options = opt;
	this.events = {};
	this.lastBody = "";

	function makeRequest(){

		request(url, function (error, response, body) {
			if (this.events["look"]){
				this.events["look"]();
			}

		  if (!error && response.statusCode == 200) {
		  	if (body != lastBody){
			    if (this.events["change"]){
						this.events["change"](body);
					}
				}
		  }
		  else {
		  	if (this.events["error"]){
					this.events["error"](error, response.statusCode);
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
