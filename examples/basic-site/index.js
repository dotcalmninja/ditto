const
  Ditto = require('ditt0'),
  DittoJson = require('ditt0-json'),
  DittoHbs = require('ditt0-hbs');

Ditto(__dirname)
  .metadata({
    title: 'ditto basic site'
  })
  .source('./src')
  .destination('./build')
  .use(new DittoJson())
  .use(new DittoHbs())
  .build(function(err){
    if(err) throw err;    
    console.log("examples/basic-site finished building!")
  });
