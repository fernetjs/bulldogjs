var should = require('should'),
  bulldog = require('../lib/bulldog.js')
  testServer = require('./test-util/testserver.js'),
  SERVER_PORT = 3001;

describe('change', function(){
  var timesCalled = 0,
      step = 100,
      twoSteps = step * 2,
      halfStep = step / 2,
      oneTime = 1,
      twoTimes = oneTime * 2;
  var baseResponse = '<html><body><span id="cats">catssss</span><span id="unicorns">unicornssss</span><ul id="animals"><li>cat</li><li>unicorn</li><li>dog</li></ul></body></html>';
  var bodyResponses = {
      base: '<html><body><span id="cats">catssss</span><span id="unicorns">unicornssss</span><ul id="animals"><li>cat</li><li>unicorn</li><li>dog</li></ul></body></html>',
      catification: '<html><body><span id="cats">cat cat cat cat</span><span id="unicorns">unicornssss</span></body></html>',
      unicornication: '<html><body><span id="cats">catssss</span><span id="unicorns">unicorns. just unicorns.</span></body></html>',

      baseList: '<html><body><ul id="animals"><li>cat</li><li>unicorn</li><li>dog</li></ul></body></html>',
      changeListContent: '<html><body><ul id="animals"><li>cat</li><li>rhino</li><li>dog</li></ul></body></html>',
      changeListLength: '<html><body><ul id="animals"><li>cat</li><li>dog</li></ul></body></html>'
    };
    
  beforeEach(function(){
    testServer.currentResponse = baseResponse;
  });
  
  describe('basic usage', function(){
    
    afterEach(function(){
      bulldog.stopWatching();
    }); 

    it('should pass something to the callback (cannot be null)', function(done){
      setTimeout(function(){ testServer.change('#cats'); }, 150);
      bulldog.watch('http://localhost:' + SERVER_PORT, 100, function(error, dog){
        dog.on('change', function(obj){
          should.exist(obj);
          dog.off('change');
          done();
        });
      });
    });
    it('should allow to suscribe as bark too', function(done){
      setTimeout(function(){ testServer.change('#cats'); }, 150);
      bulldog.watch('http://localhost:' + SERVER_PORT, 100, function(error, dog){ 
        dog.on('bark', function(obj){
          should.exist(obj);
          dog.off('bark');
          done();
        });
      });
    });
    
    it('should allow to be called with "change", callback', function(){
      bulldog.watch('http://localhost:' + SERVER_PORT, 100, function(error, dog){
        dog.on('change', function(obj){});
        dog.off('change');
      });
    });
    it('should allow to be called with "bark", callback', function(){
      bulldog.watch('http://localhost:' + SERVER_PORT, 100, function(error, dog){
        dog.on('bark', function(obj){});
        dog.off('bark');
      });
    });
    
    it('should allow to be called with "change", "selector", callback', function(){
      bulldog.watch('http://localhost:' + SERVER_PORT, 100, function(error, dog){
        dog.on('change', 'div.info', function(obj){});
        dog.off('change', 'div.info');
      });
    });
    it('should allow to be called with "bark", "selector", callback', function(){
      bulldog.watch('http://localhost:' + SERVER_PORT, 100, function(error, dog){
        dog.on('bark', 'div.info', function(obj){});
        dog.off('bark', 'div.info');
      });
    });
  });
  
  describe('time-based', function(){
    it('should allow to add and remove the handler', function(done){
      var timesCalled = 0;

      bulldog.watch('http://localhost:' + SERVER_PORT, step, function(error, puppy){
        setTimeout(function(){ testServer.change('#cats'); }, step + halfStep);
        
        setTimeout(function(){
          timesCalled.should.equal(oneTime);
          done();
        }, twoSteps + halfStep);

        puppy.on('change', function(){
          timesCalled++;
          puppy.off('change');
        });

      });
    });
    it('should allow to add and remove the handler for calls providing selectors', function(done){
      var timesCalled = 0;

      bulldog.watch('http://localhost:' + SERVER_PORT, step, function(error, puppy){
        setTimeout(function(){ testServer.change('#unicorns'); }, step + halfStep);

        setTimeout(function(){
          timesCalled.should.equal(oneTime);
          done();
        }, twoSteps + halfStep);
        
        puppy.on('change', '#unicorns', function(){
          timesCalled++;
          puppy.off('change', '#unicorns');
        });
      });
    });
    it('should handle each change event for each selector independently', function(done){
      var catsCallsCount = 0,
        unicornsCallsCount = 0,
        generalCallsCount = 0;
      
      bulldog.watch('http://localhost:' + SERVER_PORT, step, function(error, puppy){

        setTimeout(function(){ 
          testServer.change('#cats'); 
          setTimeout(function(){ 
            testServer.change('#unicorns'); 
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
          done();
        }, twoSteps * 2);
        
      });
    });
    it('should be called if something changed with before and now states', function(done){
      bulldog.watch('http://localhost:' + SERVER_PORT, step, function(error, puppy){

        setTimeout(function(){ testServer.change('#cats'); }, halfStep);

        puppy.on('change', function(result){
          should.exist(result.before);
          should.exist(result.now);

          result.before.should.be.a('string');
          result.now.should.be.a('string');

          result.before.should.equal(baseResponse);
          result.now.should.equal(testServer.currentResponse);

          puppy.off('change');
          done();
        });

      });
    });
    it('should NOT be called if things remain the same',function(done){
      var wasCalled = false;
      bulldog.watch('http://localhost:' + SERVER_PORT, step, function(error, puppy){

        setTimeout(function(){
          wasCalled.should.equal(false);
          puppy.off('look').off('change');
          done();
        }, twoSteps + halfStep);

        puppy.on('look', function(result){
          should.exist(result);
          result.should.be.a('string').and.equal(bodyResponses.base);
        });

        puppy.on('change', function(result){
          wasCalled = true;
        });

      });
    });
  });


  describe('selectors', function(){
    it('should be called if something changed for matched selector with before and now states', function(done){
      var catsBefore = 'catssss';
      var catsAfter = 'cat cat cat cat';

      bulldog.watch('http://localhost:' + SERVER_PORT, step, function(error, puppy){

        setTimeout(function(){ testServer.change('#cats', catsAfter); }, halfStep);

        puppy.on('change', '#cats', function(result){
          should.exist(result.before);
          should.exist(result.now);

          result.before.should.be.an.instanceOf(Array).with.lengthOf(1);
          result.now.should.be.an.instanceOf(Array).with.lengthOf(1);

          result.before[0].should.be.a('string').and.equal(catsBefore);
          result.now[0].should.be.a('string').and.equal(catsAfter);

          puppy.off('change', '#cats');
          done();
        });

      });
    });
    it('should be called if elements content or length changed for a matched selector', function(done){
      var contentBefore = "unicorn",
        contentNow = "rhino";

      testServer.currentResponse = bodyResponses.baseList; 

      bulldog.watch('http://localhost:' + SERVER_PORT, step, function(error, puppy){

        setTimeout(function(){ 
          testServer.currentResponse = bodyResponses.changeListContent; 

          setTimeout(function(){ 
            testServer.currentResponse = bodyResponses.changeListLength;

            setTimeout(function(){ 
              times.should.equal(2);
              puppy.off('change', '#animals li');
              done();

            }, step);
          }, step);
        }, halfStep);

        var times = 0;
        puppy.on('change', '#animals li', function(result){
          should.exist(result.before);
          should.exist(result.now);

          if (times === 0){
            result.before.should.be.an.instanceOf(Array).with.lengthOf(3);
            result.now.should.be.an.instanceOf(Array).with.lengthOf(3);

            result.before[1].should.equal(contentBefore);
            result.now[1].should.equal(contentNow);

            times++;
          }
          else if (times === 1){
            result.before.should.be.an.instanceOf(Array).with.lengthOf(3);
            result.now.should.be.an.instanceOf(Array).with.lengthOf(2); 
            times++;
          }
        });

      });
      
    });
    it('should NOT be called if things remain the same for matched selector',function(done){
      var wasCalled = false;
      bulldog.watch('http://localhost:' + SERVER_PORT, step, function(error, puppy){

        setTimeout(function(){
          wasCalled.should.equal(false);
          puppy.off('look').off('change', '#cats');
          done();
        }, twoSteps + halfStep);

        puppy.on('look', function(result){
          should.exist(result);
          result.should.be.a('string').and.equal(bodyResponses.base);
        });

        puppy.on('change', '#cats', function(result){
          wasCalled = true;
        });

      });
    });
  });
});
