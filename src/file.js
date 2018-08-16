var path = require('path');
module.exports = DittoFile;

/**
 @typedef DittoFile
 @type {Object}
 @property {Array} buffer file contents as byte array
 @property {Object} relPath relative filepath
 @property {Object} stats node Stats object
 */
function DittoFile(buffer, relPath, stats) {
  this.content = buffer;
  this.stats = stats;

  this.path = {
    dir: '', //directory(s) relative to source
    ext: '', //file extension with dot
    name: '', //file name without extension    
    rel: relPath //relative to source with extension
  };

  var parsedPath = path.parse(relPath);
  this.path.dir = parsedPath.dir;
  this.path.ext = parsedPath.ext;
  this.path.name = parsedPath.name;
};


function makeRel(){
  this.path.rel = path.join(this.path.dir, this.path.name + this.path.ext);
};

DittoFile.prototype.setDir = function(dir){
  this.path.dir = dir;  
  makeRel.call(this);
};

DittoFile.prototype.setExt = function(ext){
  this.path.ext = ext;  
  makeRel.call(this);
};

DittoFile.prototype.setName = function(name){
  this.path.name = name;  
  makeRel.call(this);
};