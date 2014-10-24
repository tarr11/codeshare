Codeshare
=========

NOTE - this project has more or less been merged into ShareJs.  Check out the example on the ShareJS repo:

https://github.com/share/share-codemirror



## Description
Codeshare lets you create collaborative docs (like etherpad) with [CodeMirror](http://www.codemirror.net) and [ShareJs](http://www.sharejs.org)  

This code was inspired by the ACE version on ShareJS.

## Installation
```
   $ git clone git://github.com/tarr11/codeshare

   $ npm install
```
## Running
   node bin/codeshare.js

   open 2 browser windows to http://localhost:8000
   
   start typing!
 
## Live Demo
http://codesharejs.herokuapp.com/

note, this doesn't work too well because of Heroku's restrictions on Socket.io, but you'll get the idea. 

http://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku

This code is available under the MIT License.
