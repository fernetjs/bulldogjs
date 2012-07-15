
var request = require('request'),
	Dog = require('./dog.js');

var dogs = [];

module.exports = {
	watch: function(url, interval, callback){
		
		if (typeof interval !== 'number'){
			callback(new Error('Interval parameter must be a Number'));
			return;
		}

		request(url, function (error, response, body) {
			if (!error) {
				var dog = new Dog({
					url: url,
					interval: interval,
					html: body
				});

	  		dogs.push(dog);

	  		callback(null, dog);
		  }
		  else {
		  	callback(error);
		  }
		});

		return this;
	},
	stopWatch: function(){
		//clearInterval for each Dog
		return this;
	}
};

