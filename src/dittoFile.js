module.exports = DittoFile;

/**
 @typedef DittoFile
 @type {Object}
 @property {Array} buffer file contents as byte array
 @property {String} path relative filepath
 @property {Object} stats node Stats object
 */
function DittoFile(buffer, rel, stats) {
  this.content = buffer;
  this.path = rel;
  this.stats = stats;
};