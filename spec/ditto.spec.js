const 
  Ditto = require('../src'),
  path = require('path');

describe('ditto', function() {

  /**
   * Working Directory
   */
  it('cwd should equal __dirname', function(){    
    let cwdCompare = path.resolve('src');
    let ditto = new Ditto(cwdCompare);

    expect(ditto._cwd).toEqual(cwdCompare);
  });

  /**
   * Metadata
   */
  it('metadata should equal {}', function(){
    let cwdCompare = path.resolve('src');
    let ditto = new Ditto(cwdCompare);
    
    expect(ditto._cwd).toEqual(cwdCompare);
    expect(ditto._metadata).toEqual({});
  });

  it('metadata should equal { title: "test" }', function () {
    let cwdCompare = path.resolve('src');
    let metadata = { title: 'test' };
    let ditto = new Ditto(cwdCompare).metadata(metadata);

    expect(ditto._cwd).toEqual(cwdCompare);
    expect(ditto._metadata).toEqual(metadata);
  });

  /**
   * Clobber
   */
  it('default clobber should be "false"', function(){
    let cwdCompare = path.resolve('src');
    let ditto = new Ditto(cwdCompare);

    expect(ditto._clobber).toEqual(false);
    expect(ditto._clobberGlob).toEqual('/*');
  });

  it('clobber should be "true"', function(){
    let cwdCompare = path.resolve('src');
    let ditto = new Ditto(cwdCompare).clobber(true, '/*!(*.css)');

    expect(ditto._clobber).toEqual(true);
    expect(ditto._clobberGlob).toEqual('/*!(*.css)');
  });

  /**
   * Source
   */
  it('default source should be "src"', function(){
    let sourceCompare = path.resolve('src');
    let ditto = new Ditto(sourceCompare).source('src');

    expect(ditto._source).toEqual(sourceCompare);
  });

  it('source should be "srcTest"', function(){
    let sourceCompare = path.resolve('srcTest');
    let ditto = new Ditto(sourceCompare).source('srcTest');

    expect(ditto._source).toEqual(sourceCompare);
  });

  /**
   * Destination
   */
  it('default destination should be "public"', function(){
    let destinationCompare = path.resolve('public');
    let ditto = new Ditto(destinationCompare).destination('public');

    expect(ditto._destination).toEqual(destinationCompare);
  });

  it('destination should be "publicTest"', function(){
    let destinationCompare = path.resolve('publicTest');
    let ditto = new Ditto(destinationCompare).destination('publicTest');

    expect(ditto._destination).toEqual(destinationCompare);
  });

  /**
   * Discover Files
   */
  it('should find 2 files', function(){
    let ditto = new Ditto().source('./spec/support/files');
    
    ditto.discover(function(err, filepaths){
      expect(filepaths.length).toEqual(2);
    });
  });
  
});

describe('ditto read files', function () {
  let ditto = new Ditto().source('./spec/support/files');
  let files = [];
  
  beforeAll(function(done){		
    ditto.discover(function(err, filepaths){
      ditto.readFiles(filepaths, function (err, f) {
        files = f;

        done();
      });
    });
  });

  /**
   * Read Files
   */
  it('should return 2 DittoFiles', function () {
    var file = files[0];
    
    expect(files.length).toEqual(2);
    
    expect(files[0].path.ext).toEqual('.json');
    expect(files[0].path.name).toEqual('index');
    expect(files[0].path.dir).toEqual('');    
    expect(files[0].path.rel).toEqual('index.json');    
    
    expect(files[1].path.ext).toEqual('.json');
    expect(files[1].path.name).toEqual('test');
    expect(files[1].path.dir).toEqual('nested');    
    expect(files[1].path.rel).toEqual('nested\\test.json');        
  });
});