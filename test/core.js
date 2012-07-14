var should = require('should');
var Bulldog = require('../bulldog.js');

describe('Bulldog', function(){
  describe('#watch()', function(){
    it('should return an instance of a bulldog', function(){
   		var dog = Bulldog.watch('http://fernetjs.com', 10000);
   		dog.should.be.an.instanceof(Bulldog);
    });
    it('should receive an url and an interval in ms', function(){
    	var dog = Bulldog.watch('http://fernetjs.com', 10000);
    	dog.url.should.be.a('string');
    	dog.url.should.equal('http://fernetjs.com');
    	dog.interval.should.be.a('number');
    	dog.interval.should.equal(10000);
    });
    it('should allow an optional 3rd parameter for http request options', function(){
			var dog = Bulldog.watch('http://fernetjs.com', 10000, {
				method: 'POST',
				timeout: 10000    			
 			});
 			dog.options.should.be.a('object');
    });
    it('should make GET requests when no options is provided');
  });
  
  describe('#on()', function(){
  	var dog, 
  		testServer = require('http').createServer(function (req, res) {
	  		res.writeHead(200, {'Content-Type': 'text/plain'});
	  		res.end('TEST :D\n');
			});

  	before(function(){
  		testServer.listen(3001, '127.0.0.1');
  		dog = Bulldog.watch('http://localhost:3001/', 1000);
  	});
  	
  	after(function(){
  		testServer.close();
  	});

  	it('should allow event subscriptions');
  	it('should allow us to subscribe to "change", "look", and "error"');

  	describe('#on change', function(done){
  		it('should pass something to the callback (cannot be null)', function(){
	  		dog.on('change', function(obj){
	  			obj.should.not.be.empty;
					done();  			
	  		});	
  		});  		
  	});
  	describe('#on look', function(done){
  		it('should pass something to the callback (cannot be null)', function(){
	  		dog.on('look', function(obj){
	  			obj.should.not.be.empty;
					done();  			
	  		});	
  		});
  		it('');
  	});
  	describe('#on error', function(){


  	});
  });

});