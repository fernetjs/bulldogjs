##BulldogJS [![Build Status](https://secure.travis-ci.org/fernetjs/bulldogjs.png?branch=master)](http://travis-ci.org/fernetjs/bulldogjs)

Release some Bulldogs to watch internet for you.

The purpose of this library is to know when and what has changed in a website for a period of time.

### How to use it?

```bash
npm install bulldog
```

### Watching a WebSite

#### Basics
```javascript
var bulldog = require('bulldog');

//Watch a website every 5 mins
bulldog.watch('http://somedomain.com', 60000 * 5, function(err, dog){
  if (err) throw new Error(err); //something went wrong

  //dog: will give you a Dog with events
});

//pause all current watchs 
bulldog.stopWatching();

//resume all watchs 
bulldog.resumeWatching();
```

#### Dog Events

##### look
```javascript
var bulldog = require('bulldog');

//Watch a website every 10 seconds
bulldog.watch('http://somedomain.com', 10000, function(err, dog){
  if (err) throw new Error(err); //something went wrong

  //Everytime the dog looks at the website (10 seconds)
  dog.on('look', function(res){
    console.log('looking up\n');
    console.log(res);
  });

});
```

##### change
```javascript
var bulldog = require('bulldog');

//Watch a website every 10 seconds
bulldog.watch('http://somedomain.com', 10000, function(err, dog){
  if (err) throw new Error(err); //something went wrong

  //Every time the site changed
  dog.on('change', function(res){
    console.log('HTML Before: ' + res.before);
    console.log('HTML Now: ' + res.now);
  });

  //When some part of the site changed (by a selector)
  dog.on('change', '#lastCommentsBox', function(res){
    console.log('Content of selector Before: ' + res.before);
    console.log('Content of selector Now: ' + res.now);
  });

});
```

##### error
```javascript
var bulldog = require('bulldog');

//Watch a website every 10 seconds
bulldog.watch('http://somedomain.com', 10000, function(err, dog){
  if (err) throw new Error(err); //something went wrong

  dog.on('error', function(err){
    dog.off('change'); //unsuscribe event
    dog.off('change', '#lastCommentsBox'); //unsuscribe for specific selector

    console.log(err); //something went wrong
  });

});
```

##### wait and start
```javascript
var bulldog = require('bulldog');

//Watch a website every 10 seconds
bulldog.watch('http://somedomain.com', 10000, function(err, dog){
  if (err) throw new Error(err); //something went wrong

  //Stop the dog
  dog.wait(); 

  //Resume a wait event
  dog.start();

});
```

#### Dog Events but Funny
```javascript
var bulldog = require('bulldog');

bulldog.watch('http://somedomain.com', 10000, function(err, dog){
  if (err) throw new Error(err); //something went wrong

  //Same event as 'look'
  dog.on('sniff', function(res){
    console.log('sniffing aroung');
  });

  //Same event as 'change'
  dog.on('bark', function(res){
    console.log('Barking!');
  });

  //Same event as 'error'
  dog.on('poop', function(err){
    console.log('error');
  });
});
```

## License 

(The MIT License)

Copyright (c) 2012 Pablo Novas &lt;pjnovas@gmail.com&gt;  
Copyright (c) 2012 Matias Arriola &lt;matias.arriola@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.