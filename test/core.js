var should = require('should');
var Bulldog = require('../bulldog.js');

describe('Bulldog', function(){
  describe('#watch()', function(){
    it('should return an instance of a bulldog', function(){
   		var dog =   Bulldog.watch('http://fernetjs.com', 3600);
   		dog.should.be.a(Bulldog); 
    });
    it('should receive x and y??="#=$#?=');
  })
  describe('#on()', function(){
  	it('should allow event subscriptions');
  	it('should allow us to subscribe to "change", "look", and "error"');
  })
});