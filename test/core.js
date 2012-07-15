var should = require('should'),
  bulldog = require('../lib/bulldog.js'),
  Dog = require('../lib/dog.js');

describe('Bulldog', function(){
  var testServer;

  before(function(){
    testServer = require('http').createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end('<html><body></body></html>');
    });
    testServer.listen(3002, '127.0.0.1');
  });
  
  after(function(){
    testServer.close();
  });

  describe('#watch()', function(){

    it('should return a dog', function(done){
      bulldog.watch('http://localhost:3002', 10000, function(error, dog){
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
      bulldog.watch('http://localhost:3002', '10000', function(error, dog){
        should.exist(error);
        should.not.exist(dog);
        done();
      });
    });

    it('should receive an url and an interval in ms', function(done){
    	bulldog.watch('http://localhost:3002', 10000, function(error, dog){
        should.not.exist(error);
      	dog.url.should.be.a('string');
      	dog.url.should.equal('http://localhost:3002');
      	dog.interval.should.be.a('number');
      	dog.interval.should.equal(10000);
        done();
      });
    });
    
    it('should allow an optional 3rd parameter for http request options'); 
    it('should make GET requests when no options is provided');
  });

  describe('#stopWatching()', function(){
    it('should stop making requests', function (done){
      var timesCalled = 0;
      
      bulldog.watch('http://localhost:3002/try1', 500, function(error, dog){
        should.not.exist(error);
        should.exist(dog);

        dog.on('look', function(){
          timesCalled++;
        });

      });

      bulldog.watch('http://localhost:3002/try2', 500, function(error, dog){
        should.not.exist(error);
        should.exist(dog);

        dog.on('look', function(){
          timesCalled++;
        });

      });

      setTimeout(function(){
        bulldog.stopWatching();

        setTimeout(function(){
          timesCalled.should.be.equal(2);
          done();
        }, 1000);

      }, 600);
      
    });
  });

  describe('#resumeWatching()', function(){
    it('should resume making requests', function (done){
      var timesCalled = 0;
      
      bulldog.watch('http://localhost:3002/try1', 50, function(error, dog){
        should.not.exist(error);
        should.exist(dog);

        dog.on('look', function(){
          timesCalled++;
        });

      });

      bulldog.watch('http://localhost:3002/try2', 50, function(error, dog){
        should.not.exist(error);
        should.exist(dog);

        dog.on('look', function(){
          timesCalled++;
        });

      });

      setTimeout(function(){
        bulldog.stopWatching();

        setTimeout(function(){
          timesCalled.should.be.equal(4);

          bulldog.resumeWatching();          

          setTimeout(function(){
            timesCalled.should.be.equal(8);
            done();
          }, 90);

        }, 30);

      }, 120);
      
    });
  });

});