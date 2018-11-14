var path = require('path');
module.exports = DittoFile;

/**
 @typedef DittoFile
 @type {Object}
 @property {Array} buffer file contents as byte array
 @property {Object} rel relative filepath
 @property {Object} stats node Stats object (optional)
 */
function DittoFile(buffer, rel, stats) {
  this.content = buffer;
  this.stats = stats || {};

  this.path = {
    dir: '', //directory(s) relative to source
    ext: '', //file extension with dot
    name: '', //file name without extension    
    rel: rel //relative to source with extension
  };

  var parsedPath = path.parse(rel);
  this.path.dir = parsedPath.dir;
  this.path.ext = parsedPath.ext;
  this.path.name = parsedPath.name;
};


function makeRel(){
  this.path.rel = path.join(this.path.dir, this.path.name + this.path.ext);
};

DittoFile.prototype.setDir = function(dir){
  if(dir !== undefined && dir !== null && dir != ''){
    this.path.dir = dir;  
    makeRel.call(this);
  }
};

DittoFile.prototype.setExt = function(ext){
  if(ext !== undefined && ext !== null && ext != ''){
    
    if(ext[0] !== '.'){
      ext = '.' + ext;
    }

    this.path.ext = ext;  
    makeRel.call(this);
  }
};

DittoFile.prototype.setName = function(name){
  if(name !== undefined && name !== null && name !== ''){
    this.path.name = name;  
    makeRel.call(this);
  }
};