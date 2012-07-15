var should = require('should'),
  bulldog = require('../bulldog.js'),
  Dog = require('../dog.js');

describe('Bulldog', function(){
  
  describe('#watch()', function(){

    it('should return a dog', function(done){
      bulldog.watch('http://fernetjs.com', 10000, function(error, dog){
        should.not.exist(error);
        dog.should.be.an.instanceof(Dog);
        done();
      });
    });

    it('should return an error when URL is wrong', function(done){
      bulldog.watch('thisIsNotAnURL', 10000, function(error, dog){
        should.exist(error);
        should.not.exist(dog);
        done();
      });
    });

    it('should return an error when interval is not a number', function(done){
      bulldog.watch('http://fernetjs.com', '10000', function(error, dog){
        should.exist(error);
        should.not.exist(dog);
        done();
      });
    });

    it('should receive an url and an interval in ms', function(done){
    	bulldog.watch('http://fernetjs.com', 10000, function(error, dog){
        should.not.exist(error);
      	dog.url.should.be.a('string');
      	dog.url.should.equal('http://fernetjs.com');
      	dog.interval.should.be.a('number');
      	dog.interval.should.equal(10000);
        done();
      });
    });
    
    it('should allow an optional 3rd parameter for http request options'); /*, function(){
			var dog = Bulldog.watch('http://fernetjs.com', 10000, {
				method: 'POST',
				timeout: 10000    			
 			});
 			dog.options.should.be.a('object');
    });*/
    
    it('should make GET requests when no options is provided');
  });

  describe('#stopWatching()', function(){
    it('should stop making requests');
  });

});