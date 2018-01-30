/*
 * Ditto
 */
const
	async = require('async'),
  // events = require('events'),
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

	this.files = {};

  //defaults
	this.clobber(false);  
	this.destination('public');
  this.metadata({});
  this.middleware = [];
	this.source('src');

	//working directory
  if (typeof workingDirectory == 'string') {
    this.cwd(workingDirectory);
	} 
	else {
    this.cwd(__dirname);
	}
};

/**
 * Inherit Event Emitter prototype
 */
// util.inherits(Ditto, events.EventEmitter);

/**
 * Build It
 * @param {function} onBuild 
 */
Ditto.prototype.build = function(onBuild) {
  console.info("*************\n*** ditt0 ***\n*************");

	async.waterfall([
		this.discover.bind(this),
		this.readFiles.bind(this)
	], function(err, results){
		console.log(err, results);
	});
  // //register listeners
  // this.on("foundFiles", this.readFiles);
  // this.on("readFiles", this.run);
  // this.on("middlewareDone", this.write);

  // if (onBuild)
  //   this.on("built", onBuild);

  // try {
  //   //kickoff build
  //   this.discover();
  // } catch (err) {
  //   console.error(err);
  //   if (onBuild) onBuild(err);
  // }
};

/**
 * Should we clobber on build?
 * @param {boolean} clobber 
 */
Ditto.prototype.clobber = function(clobber) {
  this._clobber = clobber;
  return this;
};

/**
 * Set current working directory
 * @param {String} cwd 
 */
Ditto.prototype.cwd = function(cwd) {
  this._cwd = path.resolve(cwd);
  return this;
};

/**
 * Set the build destination directory
 * @param {String} destination 
 */
Ditto.prototype.destination = function(destination) {
  this._destination = path.resolve(destination);
  return this;
};

/**
 * Discover & parse files in source directory
 */
Ditto.prototype.discover = function(callback) {
  glob(this._source + '/**/*.*', function(err, filepaths) {
		callback(err, filepaths)
  });
};

/**
 * Set metadata
 * @param {object} metadata 
 */
Ditto.prototype.metadata = function(metadata) {
	if(typeof metadata == 'object') {
		this._metadata = metadata;	
	}
	else if(typeof metadata == 'string') {
		let metadataPath = path.resolve(metadata);
		
		if(metadataPath) {
			this._metadataPath = metadataPath;
		}		
	}	
	
  return this;
};

/**
 * Read files into buffer 
 * @param {array} filepaths 
 */
Ditto.prototype.readFiles = function(filepaths, callback) {
	async.map(filepaths, this.readFile.bind(this), function(err, files){
		if(err) callback(err);
		callback(null, files);
	})
  // let self = this,
  //   promises = [];

  // for (var i = 0; i < filepaths.length; i++) {
  //   promises.push(this.readFile(filepaths[i]));
  // }

  // Promise.all(promises)
  //   .then(function(filesAry) {
  //     filesAry.map(function(file) {
  //       self.files[file.rel] = {
  //         content: file.buffer,
  //         path: file.rel,
  //         stats: file.stats
  //       };
  //     });

  //     self.emit("readFiles");
  //   });
};

/* Read file async */
Ditto.prototype.readFile = function(filepath, callback) {
	let self = this;
	fs.stat(filepath, function(err, stats){
		if(err) callback(err, null);

		fs.readFile(filepath, function(err, buffer){
			if(err) callback(err, null);
			
			callback(null, {
				rel: path.relative(self._source, filepath),
				buffer: buffer,
				stats: stats
			})
		});
	})	
  // let self = this;

  // return new Promise(function(resolve, reject) {
  //   fs.stat(filepath, function(err, stats) {
  //     if (err) reject(err);

  //     fs.readFile(filepath, function(err, buffer) {
  //       if (err) reject(err);
  //       else {
  //         resolve({
  //           rel: path.relative(self._source, filepath),
  //           buffer: buffer,
  //           stats: stats
  //         });
  //       }
  //     });
  //   });
  // });
};

/* Run middleware pipeline */
Ditto.prototype.run = function() {
  let self = this,
    i = 0;

  function next(files) {
    let mw = self.middleware[i++];

    if (mw)
      mw.run(self.files, self, next);
    else
      self.emit("middlewareDone");
  };

  if (self._clobber)
    rimraf(path.join(self._destination, '/*'), next.bind(null, self.files));
  else
    next(self.files);
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

/* Write Files */
Ditto.prototype.write = function() {
  let self = this;

  Object.keys(self.files).forEach(function(filepath) {
    let file = self.files[filepath];

    fs.outputFile(path.resolve(self._destination, file.path), file.content, function(err) {
      if (err) throw err;
    });
  });

  self.emit("built");
};