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
  .use(new DittoJson())
  .use(new DittoHbs({
  	defaultTemplate: 'index',
  	partials: './templates/partials',
  	templates: './templates'
  }))
  .build(function(err){
  	if(err) throw err;
  });
