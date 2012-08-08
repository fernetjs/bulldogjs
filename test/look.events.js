var should = require('should'),
  bulldog = require('../lib/bulldog.js')
  testServer = require('./test-util/testserver.js'),
  SERVER_PORT = 3001;

describe('look', function(){
  var baseResponse = '<html><body><span id="cats">catssss</span><span id="unicorns">unicornssss</span><ul id="animals"><li>cat</li><li>unicorn</li><li>dog</li></ul></body></html>';
  
  beforeEach(function(){
    testServer.currentResponse = baseResponse;
  });
  
  it('should pass something to the callback (cannot be null)', function(done){
    bulldog.watch('http://localhost:' + SERVER_PORT, 100, function(error, dog){
      dog.on('look', function(obj){
        should.exist(obj);
        dog.off('look');
        done();
      }); 
    });
  });
  it('should allow to suscribe as sniff too', function(done){
    bulldog.watch('http://localhost:' + SERVER_PORT, 100, function(error, dog){
      dog.on('sniff', function(obj){
        should.exist(obj);
        dog.off('sniff');
        done();
      });
    }); 
  });
  it('should pass the content of the site to the callback', function(done){
    bulldog.watch('http://localhost:' + SERVER_PORT, 100, function(error, puppy){
      puppy.on('look', function(result){
        should.exist(result);
        result.should.equal(baseResponse);
        puppy.off('look');
        done();
      });
    });
  });
});