var path = require('path');
module.exports = DittoFile;

/**
 @typedef DittoFile
 @type {Object}
 @property {Array} buffer file contents as byte array
 @property {String} relPath relative filepath
 @property {Object} stats node Stats object
 */
function DittoFile(buffer, relPath, stats) {
  this.content = buffer;
  this.stats = stats;

  this.path = path.parse(relPath)  
  this.path.rel = relPath.replace(this.path.ext, '');
  delete this.path.root;  
};

DittoFile.prototype.pathWithExtension = function(){
  return this.path.rel + this.path.ext;
};