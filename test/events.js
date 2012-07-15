var should = require('should'),
  bulldog = require('../lib/bulldog.js');

describe('Events', function(){
  var dog,
    bodyResponses = {
      base: '<html><body><span id="cats">catssss</span><span id="unicorns">unicornssss</span></body></html>',
      catification: '<html><body><span id="cats">cat cat cat cat</span><span id="unicorns">unicornssss</span></body></html>',
      unicornication: '<html><body><span id="cats">catssss</span><span id="unicorns">unicorns. just unicorns.</span></body></html>'
    },
    currentResponse = bodyResponses.base,
    testServer = require('http').createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(currentResponse);
    });
  
  beforeEach(function(done){
    testServer.listen(3001, '127.0.0.1');
    bulldog.watch('http://localhost:3001/', 1000, function(error, theDog){
      dog = theDog;
      done();
    });
  });
  
  afterEach(function(){
    testServer.close();
  });

  describe('#on()', function(){
    it('should allow us to subscribe to "change", "look", and "error"');
    it('should throw an error if the event does not exist');
  });

  describe('#off()', function(){
    it('can be called even if no handlers are attached');
    it('should unsuscribe to a given event');
  });

  describe('change', function(){
    it('should pass something to the callback (cannot be null)', function(done){
      setTimeout(function(){ currentResponse = bodyResponses.catification; }, 150);
      dog.on('change', function(obj){
        should.exist(obj);
        dog.off('change');
        currentResponse = bodyResponses.base;
        done();
      });
    });
    //this test is sync because we don't intend to test functionality here
    it('should allow to be called with "change", callback', function(){
      dog.on('change', function(obj){});
      dog.off('change');
    });
    //this test is sync because we don't intend to test functionality here
    it('should allow to be called with "change", "selector", callback', function(){
      dog.on('change', 'div.info', function(obj){});
      dog.off('change', 'div.info');
    });
    it('should allow to add and remove the handler', function(done){
      var callsCount = 0;

      bulldog.watch('http://localhost:3001/', 100, function(error, puppy){
        setTimeout(function(){ currentResponse = bodyResponses.catification; }, 150);
        setTimeout(function(){
          callsCount.should.equal(1);
          done();
        }, 350);

        puppy.on('change', function(){
          callsCount++;
          puppy.off('change');
          currentResponse = bodyResponses.base;
        });

      });
    });
    it('should allow to add and remove the handler for calls providing selectors', function(done){
      var callsCount = 0;
      bulldog.watch('http://localhost:3001/', 100, function(error, puppy){
        setTimeout(function(){ currentResponse = bodyResponses.unicornication; }, 150);
        setTimeout(function(){
          callsCount.should.equal(0);
          done();
        }, 350);
        
        puppy.on('change', '#unicorns', function(){
          callsCount++;
          puppy.off('change', '#unicorns');
          currentResponse = bodyResponses.base;
        });
      });
    });
    it('should handle each change event for each selector independently', function(done){
      var catsCallsCount = 0,
        unicornsCallsCount = 0,
        generalCallsCount = 0;
      
      bulldog.watch('http://localhost:3001/', 100, function(error, puppy){

        setTimeout(function(){ 
          currentResponse = bodyResponses.catification; 
          setTimeout(function(){ 
            currentResponse = bodyResponses.unicornication; 
          }, 80);
        }, 80);

        puppy.on('change', '#cats', function(){
          catsCallsCount++;
          puppy.off('change', '#content');
        });

        puppy.on('change', '#unicorns', function(){
          unicornsCallsCount++;
          puppy.off('change', '#content');
        });

        puppy.on('change', function(){
          unicornsCallsCount++;
          puppy.off('change', '#content');
        });

        setTimeout(function(){
          catsCallsCount.should.equal(1);
          unicornsCallsCount.should.equal(1);
          generalCallsCount.should.equal(2);
          currentResponse = bodyResponses.base; 
          done();
        }, 350);
        
      });
    });
    it('should be called if something changed');
    it('should NOT be called if things remain the same');
    it('should be called if something changed for matched selector');
    it('should NOT be called if things remain the same for matched selector');
  });
  
  describe('look', function(){
    it('should pass something to the callback (cannot be null)', function(done){
      dog.on('look', function(obj){
        should.exist(obj);
        dog.off('look');
        done();
      }); 
    });
  });

  describe('error', function(){
    it('should ONLY be called in case of HTTP error responses');
  });

});