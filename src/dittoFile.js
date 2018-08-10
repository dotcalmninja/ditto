var path = require('path');
module.exports = DittoFile;

/**
 @typedef DittoFile
 @type {Object}
 @property {Array} buffer file contents as byte array
 @property {String} src 
 @property {String} path filepath
 @property {Object} stats node Stats object
 */
function DittoFile(buffer, src, filePath, stats) {
  this.content = buffer;
  this.stats = stats;

  this.path = {
    ext: '',
    name: '',
    rel: ''
  };

  var parsedPath = path.parse(filePath);
  var relativePath = path.relative(src, filePath);

  this.path.ext = parsedPath.ext;
  this.path.name = parsedPath.name;
  this.path.rel = relativePath.replace(parsedPath.ext, '');
};