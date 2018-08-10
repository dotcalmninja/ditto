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
  
  delete this.path.root;  
  delete this.path.base;
};

DittoFile.prototype.pathWithExtension = function(){
  var pathWithExtension = path.join(this.path.dir, this.path.name + this.path.ext);

  return pathWithExtension;
};