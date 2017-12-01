/*
 * Ditto
 */
const
  events = require('events'),
  fs = require('fs-extra'),
  glob = require('glob'),
  path = require('path'),
  rimraf = require('rimraf'),
  util = require('util');

module.exports = Ditto;

function Ditto(workingDirectory) {
  if (!(this instanceof Ditto)) {
    return new Ditto(workingDirectory);
  }

  events.EventEmitter.call(this);
  
  //pipline
  this.clobber(true);
  this.metadata({});
  this.middleware = [];

  //directories
  this.destination('build');
  this.source('src');
  this.cwd(workingDirectory);  
};

/* Inherit Event Emitter prototype */
util.inherits(Ditto, events.EventEmitter);

/* Build It */
Ditto.prototype.build = function(onError) {
  var self = this;

  //register listeners
  self.on("foundFiles", self.read);
  self.on("readFiles", self.run);

  try {
    //kickoff build
    self.discover();
  }
  catch (err){
    console.error(err);
  }  
};

/* Should we clobber on build? */
Ditto.prototype.clobber = function(clobber) {
  this._clobber = clobber;
  return this;
};

/* Set current working directory */
Ditto.prototype.cwd = function(cwd) {
  this._cwd = path.resolve(cwd);
  return this;
};

/* Set destination directory */
Ditto.prototype.destination = function(destination) {
  this._destination = path.resolve(destination);
  return this;
};

/* Discover & parse files in source directory */
Ditto.prototype.discover = function() {
  var self = this;

  glob(this._source + '/**/*.*', function(err, filepaths){
    if(err) throw err;

    self.emit("foundFiles", filepaths);
  });
};

/* Set metadata */
Ditto.prototype.metadata = function(metadata) {
  this._metadata = metadata;
  return this;
};

/* Read files into buffer */
Ditto.prototype.read = function(filepaths){
  var 
    self = this, 
    promises = [];

  for (var i = 0; i < filepaths.length; i++) {
    promises.push(this.readFile(filepaths[i]));
  }

  Promise.all(promises)
    .then(function(files){
      self.emit("readFiles", files);
    });
};

/* Read file async */
Ditto.prototype.readFile = function(filepath){
  var self = this;

  return new Promise(function(resolve, reject) {
    fs.readFile(filepath, function(err, buffer){
        if (err) reject(err); 
        else { 
          resolve({ 
            rel: path.relative(self._source, filepath), 
            content: buffer 
          });
        } 
    });
  });
};

/* Run middleware pipeline */
Ditto.prototype.run = function(files){
  var self = this,
      i = 0;

  function next(files) {
    var mw = self.middleware[i++];
    console.log(mw.toString());
    if(mw)
      mw(files, self, next);
  };

  if (self._clobber)
    rimraf(path.join(self._destination, '/*'), next.bind(null, files));
  else
    next(files);
};

/* Set source directory */
Ditto.prototype.source = function(source) {
  this._source = path.resolve(source);
  return this;
};

/* Add middleware to file processing pipeline */
Ditto.prototype.use = function(middleware) {
  this.middleware.push(middleware);
  return this;
};


