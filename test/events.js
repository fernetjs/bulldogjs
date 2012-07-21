var should = require('should'),
  bulldog = require('../lib/bulldog.js');

describe('Events', function(){
  var dog,
    serverPort = 3001,
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
  
  before(function(){
    testServer.listen(serverPort, '127.0.0.1');
  });

  beforeEach(function(done){
    bulldog.watch('http://localhost:' + serverPort, 1000, function(error, theDog){
      dog = theDog;
      done();
    });
  });
  
  after(function(){
    try {
      testServer.close();
    }catch(e){}
  });

  describe('#on()', function(){
    it('should allow us to subscribe to "look", "change" and "error"', function(done){
      bulldog.watch('http://localhost:' + serverPort, 1000, function(error, dog){
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
      bulldog.watch('http://localhost:' + serverPort, 1000, function(error, dog){
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
      bulldog.watch('http://localhost:' + serverPort, 1000, function(error, dog){
        
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
      bulldog.watch('http://localhost:' + serverPort, 1000, function(error, dog){

        (function(){
          dog.off('look');
        }).should.not.throw();

        done();
      });
    });

    it('should unsuscribe to a given event', function(done){
      var wasCalled = false;

      bulldog.watch('http://localhost:' + serverPort, 500, function(error, dog){
        setTimeout(function(){ currentResponse = bodyResponses.catification; }, 250);

        dog.on('look', function(){
          wasCalled = true;
        });

        dog.off('look');

        setTimeout(function(){
          wasCalled.should.not.equal(true);
          currentResponse = bodyResponses.base;
          done();
        }, 600);
      });
    });

    it('should throw an error if the event name does not exist', function(done){
      bulldog.watch('http://localhost:' + serverPort, 1000, function(error, dog){
        
        (function(){
          dog.off('dontExist');
        }).should.throw("Event name 'dontExist' not supported");

        (function(){
          dog.off('thisNeither');
        }).should.throw("Event name 'thisNeither' not supported");
        
        done();
      });
    });
  });

  describe('change', function(){
     var timesCalled = 0,
        step = 100,
        twoSteps = step * 2,
        halfStep = step / 2,
        oneTime = 1,
        twoTimes = oneTime * 2;

    it('should pass something to the callback (cannot be null)', function(done){
      setTimeout(function(){ currentResponse = bodyResponses.catification; }, 150);
      dog.on('change', function(obj){
        should.exist(obj);
        dog.off('change');
        currentResponse = bodyResponses.base;
        done();
      });
    });
    it('should allow to suscribe as bark too', function(done){
      setTimeout(function(){ currentResponse = bodyResponses.catification; }, 150);
      dog.on('bark', function(obj){
        should.exist(obj);
        dog.off('bark');
        currentResponse = bodyResponses.base;
        done();
      });
    });
    
    it('should allow to be called with "change", callback', function(){
      dog.on('change', function(obj){});
      dog.off('change');
    });
    it('should allow to be called with "bark", callback', function(){
      dog.on('bark', function(obj){});
      dog.off('bark');
    });
    
    it('should allow to be called with "change", "selector", callback', function(){
      dog.on('change', 'div.info', function(obj){});
      dog.off('change', 'div.info');
    });
    it('should allow to be called with "bark", "selector", callback', function(){
      dog.on('bark', 'div.info', function(obj){});
      dog.off('bark', 'div.info');
    });
    it('should allow to add and remove the handler', function(done){
      timesCalled = 0;

      bulldog.watch('http://localhost:' + serverPort, step, function(error, puppy){
        setTimeout(function(){ currentResponse = bodyResponses.catification; }, step + halfStep);
        
        setTimeout(function(){
          timesCalled.should.equal(oneTime);
          done();
        }, twoSteps + halfStep);

        puppy.on('change', function(){
          timesCalled++;
          puppy.off('change');
          currentResponse = bodyResponses.base;
        });

      });
    });
    it('should allow to add and remove the handler for calls providing selectors', function(done){
      timesCalled = 0;

      bulldog.watch('http://localhost:' + serverPort, step, function(error, puppy){
        setTimeout(function(){ 
          currentResponse = bodyResponses.unicornication; 
        }, step + halfStep);

        setTimeout(function(){
          timesCalled.should.equal(oneTime);
          done();
        }, twoSteps + halfStep);
        
        puppy.on('change', '#unicorns', function(){
          timesCalled++;
          puppy.off('change', '#unicorns');
          currentResponse = bodyResponses.base;
        });
      });
    });
    it('should handle each change event for each selector independently', function(done){
      var catsCallsCount = 0,
        unicornsCallsCount = 0,
        generalCallsCount = 0;
      
      bulldog.watch('http://localhost:' + serverPort, step, function(error, puppy){

        setTimeout(function(){ 
          currentResponse = bodyResponses.catification; 
          setTimeout(function(){ 
            currentResponse = bodyResponses.unicornication; 
          }, step);
        }, halfStep);

        puppy.on('change', '#cats', function(){
          catsCallsCount++;
          puppy.off('change', '#cats');
        });

        puppy.on('change', '#unicorns', function(){
          unicornsCallsCount++;
          puppy.off('change', '#unicorns');
        });

        puppy.on('change', function(){
          generalCallsCount++;
        });

        setTimeout(function(){
          catsCallsCount.should.equal(oneTime);
          unicornsCallsCount.should.equal(oneTime);
          generalCallsCount.should.equal(twoTimes);
          puppy.off('change');
          currentResponse = bodyResponses.base; 
          done();
        }, twoSteps + halfStep);
        
      });
    });
    it('should be called if something changed with before and after states', function(done){
      bulldog.watch('http://localhost:' + serverPort, step, function(error, puppy){

        setTimeout(function(){ 
          currentResponse = bodyResponses.catification; 
        }, halfStep);

        puppy.on('change', function(result){
          should.exist(result.before);
          should.exist(result.after);

          result.before.should.equal(bodyResponses.base);
          result.after.should.equal(bodyResponses.catification);

          currentResponse = bodyResponses.base;
          puppy.off('change');
          done();
        });

      });
    });
    it('should NOT be called if things remain the same',function(done){
      var wasCalled = false;
      bulldog.watch('http://localhost:' + serverPort, step, function(error, puppy){

        setTimeout(function(){
          wasCalled.should.equal(false);
          puppy.off('look').off('change');
          done();
        }, twoSteps + halfStep);

        puppy.on('look', function(result){
          should.exist(result);
          result.should.equal(bodyResponses.base);
        });

        puppy.on('change', function(result){
          wasCalled = true;
        });

      });
    });
    it('should be called if something changed for matched selector with before and after states', function(done){
      var catsBefore = '<span id="cats">catssss</span>';
      var catsAfter = '<span id="cats">cat cat cat cat</span>';

      bulldog.watch('http://localhost:' + serverPort, step, function(error, puppy){

        setTimeout(function(){ 
          currentResponse = bodyResponses.catification; 
        }, halfStep);

        puppy.on('change', '#cats', function(result){
          should.exist(result.before);
          should.exist(result.after);

          result.before.should.equal(catsBefore);
          result.after.should.equal(catsAfter);

          currentResponse = bodyResponses.base;
          puppy.off('change', '#cats');
          done();
        });

      });
    });
    it('should NOT be called if things remain the same for matched selector',function(done){
      var wasCalled = false;
      bulldog.watch('http://localhost:' + serverPort, step, function(error, puppy){

        setTimeout(function(){
          wasCalled.should.equal(false);
          puppy.off('look').off('change', '#cats');
          done();
        }, twoSteps + halfStep);

        puppy.on('look', function(result){
          should.exist(result);
          result.should.equal(bodyResponses.base);
        });

        puppy.on('change', '#cats', function(result){
          wasCalled = true;
        });

      });
    });
  });
  
  describe('look', function(){
    it('should pass something to the callback (cannot be null)', function(done){
      dog.on('look', function(obj){
        should.exist(obj);
        dog.off('look');
        done();
      }); 
    });
    it('should allow to suscribe as sniff too', function(done){
      dog.on('sniff', function(obj){
        should.exist(obj);
        dog.off('sniff');
        done();
      }); 
    });
    it('should pass the content of the site to the callback', function(done){
      bulldog.watch('http://localhost:' + serverPort, 100, function(error, puppy){

        puppy.on('look', function(result){
          should.exist(result);
          result.should.equal(bodyResponses.base);
          done();
        });
      });
    });
  });

  describe('error', function(){
    it('should ONLY be called in case of HTTP error responses');
    it('should allow to suscribe as poop too');
  });

});