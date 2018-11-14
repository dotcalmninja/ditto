const async = require('async');
const DittoFile = require('./file');
const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const rimraf = require('rimraf');

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
  this._middleware = [];
  this.source('src');
  this.stats(false);

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
    clean.bind(this),
    discover.bind(this),
    readFiles.bind(this),
    run.bind(this),
    writeFiles.bind(this)
  ], function (err) {
    if (onBuild) onBuild(err);
  });
};

/**
 * Should we clobber on build? If so, gimme a glob or we nuke it!
 * @param {boolean} clobber
 * @param {String} glob 
 */
Ditto.prototype.clobber = function (clobber, glob) {
  this._clobber = clobber;
  this._clobberGlob = path.posix.normalize(glob || this._clobberGlob);
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
 * Set metadata
 * @param {Object} metadata 
 */
Ditto.prototype.metadata = function (metadata) {
  this._metadata = metadata;
  return this;
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
 * Determines whether stats are included in each DittoFile
 * @param {boolean} source 
 */
Ditto.prototype.stats = function (stats) {
  this._stats = stats;
  return this;
};

/**
 * Add middleware to file processing pipeline
 * @param {Function} middleware 
 */
Ditto.prototype.use = function (middleware) {
  this._middleware.push(middleware);
  return this;
};

/**
 * Clean destination if clobber
 * @param {Function} callback 
 */
function clean (callback) {
  if (this._clobber) {
    rimraf(path.join(destination, this._clobberGlob), callback);
  }
  else {
    callback(null);
  }
};

/**
 * Discover & parse files in source directory
 * @param {Function.<Error, Array.<string>>} callback
 */
function discover (callback) {
  glob(path.join(this._source, '/**/*.*'), function (err, filepaths) {
    if (err) callback(err);
    callback(null, filepaths);
  });
};

/**
 * Read files
 * @param {Array.<String>} filepaths 
 * @param {Function.<Error, Array.<Object.<DittoFile>>>} callback
 */
function readFiles (filepaths, callback) {
  async.map(filepaths, readFile.bind(this), function (err, files) {

    if (err) callback(err);

    callback(null, files);
  });
};

/**
 * Read file into buffer
 * @param {String} filepath 
 * @param {Function.<Error, Object.<DittoFile>>} callback
 */
function readFile (filepath, callback) {
  let self = this;

  fs.stat(filepath, function (err, stats) {
    if (err) callback(err, null);

    fs.readFile(filepath, function (err, buffer) {
      if (err) callback(err, null);
      
      let rel = path.relative(self._source, filepath);
      callback(null, new DittoFile(buffer, rel, (this._stats ? stats : null)));
    });
  })
};

/**
 * Run middleware pipeline
 * @param {Function} callback
 */
function run (files, callback) {
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
 * Write Files
 * @param {Array.<DittoFile>} files collection of DittoFile
 * @param {Function.<Error>} callback
 */
function writeFiles (files, callback) {
  async.map(files, writeFile.bind(this), function (err) {
    if (err) callback(err);
    callback(null);
  });
};

/**
 * Write file to disk
 * @param {Object.<DittoFile>} file DittoFile
 * @param {Function.<Error>} callback
 */
function writeFile (file, callback) {
  fs.outputFile(path.resolve(this._destination, path.join(file.path.dir, file.path.name + file.path.ext)), file.content, function (err) {
    if (err) callback(err);
    callback(null);
  });
};
