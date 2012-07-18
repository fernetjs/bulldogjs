var should = require('should'),
  bulldog = require('../lib/bulldog.js'),
  Dog = require('../lib/dog.js');

describe('Bulldog', function(){
  var serverPort = 3001,
    testServer = require('http').createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end('<html><body></body></html>');
    });

  before(function(){
    testServer.listen(serverPort, '127.0.0.1');
  });
  
  after(function(){
    try {
      testServer.close();
    }catch(e){}
  });

  describe('#watch()', function(){

    it('should return a dog', function(done){
      bulldog.watch('http://localhost:' + serverPort, 100, function(error, dog){
        should.not.exist(error);
        dog.should.be.an.instanceof(Dog);
        done();
      });
    });

    it('should return an error when URL is wrong', function(done){
      bulldog.watch('thisIsNotAnURL', 100, function(error, dog){
        should.exist(error);
        should.not.exist(dog);
        done();
      });
    });

    it('should return an error when interval is not a number', function(done){
      bulldog.watch('http://localhost:' + serverPort, '10000', function(error, dog){
        should.exist(error);
        should.not.exist(dog);
        done();
      });
    });

    it('should receive an url and an interval in ms', function(done){
      bulldog.watch('http://localhost:' + serverPort, 100, function(error, dog){
        should.not.exist(error);
        dog.url.should.be.a('string');
        dog.url.should.equal('http://localhost:' + serverPort);
        dog.interval.should.be.a('number');
        dog.interval.should.equal(100);
        done();
      });
    });
    
    it('should allow an optional 3rd parameter for http request options'); 
    it('should make GET requests when no options is provided');
  });

  describe('#stopWatching()', function(){
    it('should stop making requests', function (done){
      var timesCalled = 0,
        step = 500,
        halfStep = step / 2,
        twoTimes = 2;
        
      bulldog.watch('http://localhost:' + serverPort + '/try1', step, function(error, dog){
        should.not.exist(error);
        should.exist(dog);

        dog.on('look', function(){
          timesCalled++;
        });

      });

      bulldog.watch('http://localhost:' + serverPort + '/try2', step, function(error, dog){
        should.not.exist(error);
        should.exist(dog);

        dog.on('look', function(){
          timesCalled++;
        });

      });

      setTimeout(function(){
        bulldog.stopWatching();

        setTimeout(function(){
          timesCalled.should.be.equal(twoTimes);
          bulldog.stopWatching();
          done();
        }, (step*twoTimes));

      }, step + halfStep);
      
    });
  });

  describe('#resumeWatching()', function(){
    it('should resume making requests', function (done){
      var timesCalled = 0,
        step = 50,
        twoSteps = step * 2,
        halfStep = step / 2,
        twoTimes = 2;
      
      bulldog.watch('http://localhost:' + serverPort + '/try1', step, function(error, dog){
        should.not.exist(error);
        should.exist(dog);

        dog.on('look', function(){
          timesCalled++;
        });

      });

      bulldog.watch('http://localhost:' + serverPort + '/try2', step, function(error, dog){
        should.not.exist(error);
        should.exist(dog);

        dog.on('look', function(){
          timesCalled++;
        });

      });

      setTimeout(function(){
        bulldog.stopWatching();

        setTimeout(function(){
          timesCalled.should.be.equal(twoTimes*2);

          bulldog.resumeWatching();          

          setTimeout(function(){
            timesCalled.should.be.equal(twoTimes*2 + twoTimes);
            bulldog.stopWatching();
            done();
          }, step + halfStep);

        }, halfStep);

      }, (twoSteps + halfStep));
      
    });
  });

});