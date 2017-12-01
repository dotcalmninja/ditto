const
  Ditto = require('ditto'),
  DittoJson = require('ditto-json'),
  DittoHbs = require('ditto-hbs');

Ditto(__dirname)
  .metadata({
    title: 'ditto basic site'
  })
  .source('./src')
  .destination('./build')
  .use(DittoJson())
  .use(DittoHbs({  	
  	defaultTemplate: 'index.hbs',
  	partials: './templates/partials',
  	templates: './templates'
  }))
  .build(function(err){
  	if(err) throw err;
  });
