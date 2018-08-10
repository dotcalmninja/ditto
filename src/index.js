const
  async = require('async'),
  DittoFile = require('./dittoFile'),
  fs = require('fs-extra'),
  glob = require('glob'),
  path = require('path'),
  rimraf = require('rimraf'),
  util = require('util');

module.exports = Ditto;

/**
 @typedef Ditto
 @type {Object}
 @property {String} workingDirectory
 */
function Ditto(workingDirectory) {
  if (!(this instanceof Ditto)) {
    return new Ditto(workingDirectory);
  }

  //defaults
  this.clobber(false, '/*');  
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
 * Build It
 * @param {function} onBuild 
 */
Ditto.prototype.build = function (onBuild) {
  console.info("*************\n*** ditt0 ***\n*************");

  async.waterfall([
    this.clean.bind(this),
    this.discover.bind(this),
    this.readFiles.bind(this),    
    this.run.bind(this),
    this.writeFiles.bind(this)
  ], function (err) {
    if (onBuild) onBuild(err);
  });
};

/**
 * Clean destination if clobber
 * @param {Function} callback 
 */
Ditto.prototype.clean = function(callback){
  if(this._clobber) {
    rimraf(path.join(this._destination, this._clobberGlob), callback);
  }
  else {
    callback(null);
  }
};

/**
 * Should we clobber on build?
 * @param {boolean} clobber 
 */
Ditto.prototype.clobber = function (clobber, glob) {
  this._clobber = clobber;
  this._clobberGlob = glob || this._clobberGlob;
  return this;
};

/**
 * Set current working directory
 * @param {String} cwd 
 */
Ditto.prototype.cwd = function (cwd) {
  this._cwd = path.resolve(cwd);
  return this;
};

/**
 * Set the build destination directory
 * @param {String} destination 
 */
Ditto.prototype.destination = function (destination) {
  this._destination = path.resolve(destination);
  return this;
};

/**
 * Discover & parse files in source directory
 * @param {Function.<Error, Array.<string>>} callback
 */
Ditto.prototype.discover = function (callback) {
  glob(this._source + '/**/*.*', function (err, filepaths) {
    if(err) callback(err);    
    callback(null, filepaths);
  });
};

/**
 * Set metadata
 * @param {Object} metadata 
 */
Ditto.prototype.metadata = function (metadata) {
  this._metadata = metadata;
  return this;
};

/**
 * Read files
 * @param {Array.<String>} filepaths 
 * @param {Function.<Error, Array.<Object.<DittoFile>>>} callback
 */
Ditto.prototype.readFiles = function (filepaths, callback) {  
  async.map(filepaths, this.readFile.bind(this), function (err, files) {
    
    if (err) callback(err);
    
    callback(null, files);
  });
};

/**
 * Read file into buffer
 * @param {String} filepath 
 * @param {Function.<Error, Object.<DittoFile>>} callback
 */
Ditto.prototype.readFile = function (filepath, callback) {
  let self = this;
  
  fs.stat(filepath, function (err, stats) {
    if (err) callback(err, null);

    fs.readFile(filepath, function (err, buffer) {      
      if (err) callback(err, null);
      
      callback(null, new DittoFile(buffer, path.relative(self._source, filepath), stats));
    });
  })
};

/**
 * Run middleware pipeline
 * @param {Function} callback
 */
Ditto.prototype.run = function (files, callback) {
  let self = this,
    i = 0;

  function next(err, files) {
    let mw = self.middleware[i++];

    if (mw) {      
      mw(files, self, next);
    }      
    else {      
      callback(null, files);
    }
      
  };

  next(null, files);   
};

/**
 * Set source directory
 * @param {String} source 
 */
Ditto.prototype.source = function (source) {
  this._source = path.resolve(source);
  return this;
};

/**
 * Add middleware to file processing pipeline
 * @param {Function} middleware 
 */
Ditto.prototype.use = function (middleware) {
  this.middleware.push(middleware);
  return this;
};

/**
 * Write Files
 * @param {Array.<DittoFile>} files collection of DittoFile
 * @param {Function.<Error>} callback
 */
Ditto.prototype.writeFiles = function (files, callback) {
  async.map(files, this.writeFile.bind(this), function (err) {
    if (err) callback(err);
    callback(null);
  });
};

/**
 * Write file to disk
 * @param {Object.<DittoFile>} file DittoFile
 * @param {Function.<Error>} callback
 */
Ditto.prototype.writeFile = function (file, callback) {   
  fs.outputFile(path.resolve(this._destination, path.join(filethis.path.dir, file.path.name + file.path.ext)), file.content, function (err) {
    if (err) callback(err);
    callback(null);
  });
};