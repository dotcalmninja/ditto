/*
 * Ditto
 */
const
  fs = require('fs-extra'),
  glob = require('glob'),
  path = require('path'),
  rimraf = require('rimraf');

module.exports = Ditto;

function Ditto(workingDirectory) {
  if (!(this instanceof Ditto)) {
    return new Ditto(workingDirectory);
  }

  //pipline
  this.clobber(true);
  this.metadata({});
  this.middleware = [];

  //directories
  this.destination('build');
  this.source('src');
  this.cwd(workingDirectory);
};

/* Build It */
Ditto.prototype.build = function(onError) {
  var
    self = this,
    files = self.discover(),
    i = 0;

  function next(files) {
    var mw = self.middleware[i++];

    if(mw)
      mw(files, self, next);
  };

  if (self._clobber)
    rimraf(this._destination + '/*', next.bind(null, files));
  else
    next(files);
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
Ditto.prototype.discover = function(next) {
  var
    filepaths = glob.sync(this._source + '/**/*.*'),
    files = {};

  for (var i = 0; i < filepaths.length; i++) {
    var file = filepaths[i];

    var buffer = fs.readFileSync(file);

    files[path.relative(this._source, file)] = {
      _contents: buffer
    };
  }

  return files;
};

/* Set metadata */
Ditto.prototype.metadata = function(metadata) {
  this._metadata = metadata;
  return this;
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

/* Write the file parsed by middleware */
Ditto.prototype.writeFile = function(filepath, data) {
  delete data._contents;

  fs.outputFile(filepath, data, function(err) {
    if (err) console.error(err);
  })
};
