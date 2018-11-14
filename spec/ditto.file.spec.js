const DittoFile = require('../src/file');
const fs = require('fs');
const path = require('path');

describe('ditto file', function(){
  
  let dittoFile;

  beforeAll(function(){
    let filename = path.resolve('./spec/support/files/index.json');
    dittoFile = new DittoFile(fs.readFileSync(filename), path.relative(__dirname, filename));
  });

  it('should have a non-empty buffer', function(){    
    expect(dittoFile.content).toBeTruthy();    
  });

  it('should have path.dir eq "support/files"', function(){
    var pieces = dittoFile.path.dir.split(path.sep);
    
    expect(pieces[0]).toEqual('support');
    expect(pieces[1]).toEqual('files');
  });

  it('should have path.ext eq ".json"', function(){
    expect(dittoFile.path.ext).toEqual('.json');    
  });

  it('should have path.name eq "index"', function(){
    expect(dittoFile.path.name).toEqual('index');
  });

  it('should have path.rel eq "support/files/index.json"', function(){
    var pieces = dittoFile.path.rel.split(path.sep);
    
    expect(pieces[0]).toEqual('support');
    expect(pieces[1]).toEqual('files');
    expect(pieces[2]).toEqual('index.json');
  });

  it('valid setDir, path.dir should eq "test"', function(){
    dittoFile.setDir('test');
    expect(dittoFile.path.dir).toEqual('test');
  });

  it('setExt, path.ext should eq ".txt"', function(){
    dittoFile.setExt('.txt');
    expect(dittoFile.path.ext).toEqual('.txt');
  });
});