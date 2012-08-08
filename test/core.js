var should = require('should'),
  bulldog = require('../lib/bulldog.js'),
  Dog = require('../lib/dog.js'),
  testServer = require('./test-util/testserver.js'),
  SERVER_PORT = 3001;

describe('Bulldog', function(){

  before(function(){
    try {
      testServer.close();
    }catch(e){}

    testServer.listen(SERVER_PORT, '127.0.0.1');
  });

  describe('#watch()', function(){

    it('should return a dog', function(done){
      bulldog.watch('http://localhost:' + SERVER_PORT, 100, function(error, dog){
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
      bulldog.watch('http://localhost:' + SERVER_PORT, 'hotdog', function(error, dog){
        should.exist(error);
        should.not.exist(dog);
        done();
      });
    });

    it('should receive an url and an interval in ms', function(done){
      bulldog.watch('http://localhost:' + SERVER_PORT, 100, function(error, dog){
        should.not.exist(error);
        dog.url.should.be.a('string');
        dog.url.should.equal('http://localhost:' + SERVER_PORT);
        dog.interval.should.be.a('number');
        dog.interval.should.equal(100);
        done();
      });
    });
    
    it('should allow first parameter to be an object for http request options', function(done){
      bulldog.watch({
        url: 'http://localhost:' + SERVER_PORT,
        method: 'POST'
      }, 100, function(error, dog){
        should.not.exist(error);
        
        dog.on('look', function(data){
          testServer.lastRequest.method.toUpperCase().should.equal('POST')
          dog.off('look');
          done();
        });
      });
    });

    it('should make GET requests when no options is provided', function(done){
      bulldog.watch('http://localhost:' + SERVER_PORT, 100, function(error, dog){
        should.not.exist(error);
        
        dog.on('look', function(data){
          testServer.lastRequest.method.toUpperCase().should.equal('GET')
          dog.off('look');
          done();
        });
      });
    });

  });

  describe('#stopWatching()', function(){
    it('should stop making requests', function (done){
      var timesCalled = 0,
        step = 200,
        halfStep = step / 2,
        twoTimes = 2;
        
      bulldog.watch('http://localhost:' + SERVER_PORT + '/try1', step, function(error, dog){
        should.not.exist(error);
        should.exist(dog);

        dog.on('look', function(){
          timesCalled++;
        });

      });

      bulldog.watch('http://localhost:' + SERVER_PORT + '/try2', step, function(error, dog){
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
        step = 200,
        twoSteps = step * 2,
        halfStep = step / 2,
        twoTimes = 2;
      
      bulldog.watch('http://localhost:' + SERVER_PORT + '/try1', step, function(error, dog){
        should.not.exist(error);
        should.exist(dog);

        dog.on('look', function(){
          timesCalled++;
        });

      });

      bulldog.watch('http://localhost:' + SERVER_PORT + '/try2', step, function(error, dog){
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