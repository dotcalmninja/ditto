const Ditto = require('../src');
const path = require('path');

describe('ditto', function() {

  let cwdCompare;
  let ditto;

  beforeAll(function(){
    cwdCompare = path.resolve('src');
    ditto = new Ditto(path.resolve('src'));
  })

  /**
   * Working Directory
   */
  it('cwd should equal __dirname', function(){    
    expect(ditto._cwd).toEqual(cwdCompare);
  });

  /**
   * Clobber
   */
  it('default clobber should be false', function(){
    expect(ditto._clobber).toEqual(false);
    expect(ditto._clobberGlob).toEqual('/*');    
  });

  it('clobber should be true', function(){
    ditto.clobber(true);

    expect(ditto._clobber).toEqual(true);
    expect(ditto._clobberGlob).toEqual('/*');
  });

  it('clobberGlob should be non-default', function(){
    ditto.clobber(true, '/*!(*.css)');

    expect(ditto._clobberGlob).toEqual('/*!(*.css)');
  });

  /**
   * Destination
   */
  it('default destination should be "public"', function(){
    ditto.destination('public');

    expect(ditto._destination).toEqual(path.resolve('public'));
  });

  it('destination should be "publicTest"', function(){
    ditto.destination('publicTest');

    expect(ditto._destination).toEqual(path.resolve('publicTest'));
  });

  /**
   * Metadata
   */
  it('metadata should equal {}', function(){
    expect(ditto._metadata).toEqual({});
  });

  it('metadata should equal { title: "test" }', function () {    
    let metadata = { title: 'test' };
    ditto.metadata(metadata);

    expect(ditto._metadata).toEqual(metadata);
  });

  /**
   * Source
   */
  it('default source should be "src"', function(){    
    ditto.source('src');

    expect(ditto._source).toEqual(path.resolve('src'));
  });

  it('source should be "srcTest"', function(){
    ditto.source('srcTest');

    expect(ditto._source).toEqual(path.resolve('srcTest'));
  });

  /**
   * Middleware
   */
  it('default middleware should be "[]"', function(){
    expect(ditto._middleware).toEqual([]);
  });

  it('should have 1 middleware', function(){
    var dummyMiddlware = function(){
      return function(files, ditto, done){
        done(null, files);
      }
    };

    ditto.use(dummyMiddlware);

    expect(ditto._middleware).toEqual([dummyMiddlware]);
  });

  /**
   * Stats
   */
  it('default should be false', function(){
    expect(ditto._stats).toEqual(false);
  });

  it('should be "true"', function(){
    ditto.stats(true);

    expect(ditto._stats).toEqual(true);
  });
});