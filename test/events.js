var should = require('should'),
  bulldog = require('../lib/bulldog.js')
  testServer = require('./test-util/testserver.js'),
  SERVER_PORT = 3001;

describe('Events', function(){
  var baseResponse = '<html><body><span id="cats">catssss</span><span id="unicorns">unicornssss</span><ul id="animals"><li>cat</li><li>unicorn</li><li>dog</li></ul></body></html>';
  
  beforeEach(function(){
    testServer.currentResponse = baseResponse;
    testServer.listen(SERVER_PORT, '127.0.0.1');
  });
  
  afterEach(function(){
    try {
      testServer.close();
    }catch(e){}
  });

  describe('#on()', function(){
    it('should allow us to subscribe to "look", "change" and "error"', function(done){
      bulldog.watch('http://localhost:' + SERVER_PORT, 1000, function(error, dog){
        dog.on('look', function(){
          dog.off('look');
        });
        dog.on('change', function(){
          dog.off('change');
        });
        dog.on('error', function(){
          dog.off('error');
        });
        done();
      });
    });
    it('should allow us to subscribe to "sniff", "bark" and "poop"', function(done){
      bulldog.watch('http://localhost:' + SERVER_PORT, 1000, function(error, dog){
        dog.on('sniff', function(){
          dog.off('sniff');
        });
        dog.on('bark', function(){
          dog.off('bark');
        });
        dog.on('poop', function(){
          dog.off('poop');
        });
        done();
      });
    });
    it('should throw an error if the event name does not exist', function(done){
      bulldog.watch('http://localhost:' + SERVER_PORT, 1000, function(error, dog){
        
        (function(){
          dog.on('dontExist', function(){ });
        }).should.throw("Event name 'dontExist' not supported");

        (function(){
          dog.on('thisNeither', function(){ });
        }).should.throw("Event name 'thisNeither' not supported");
        
        done();
      });
    });
  });

  describe('#off()', function(){
    it('can be called even if no handlers are attached', function(done){
      bulldog.watch('http://localhost:' + SERVER_PORT, 1000, function(error, dog){

        (function(){
          dog.off('look');
        }).should.not.throw();

        done();
      });
    });
    it('should unsuscribe to a given event', function(done){
      var wasCalled = false;
      bulldog.watch('http://localhost:' + SERVER_PORT, 50, function(error, dog){

        dog.on('look', function(){
          wasCalled = true;
        });
        dog.off('look');

        setTimeout(function(){
          wasCalled.should.be.false;
          done();
        }, 100);
      });
    });
  });

});