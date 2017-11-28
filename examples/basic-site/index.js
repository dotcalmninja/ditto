const
  Ditto = require('ditto'),
  DittoJSON = require('ditto-json');

Ditto(__dirname)
  .metadata({
    title: 'ditto basic site'
  })
  .source('./src')
  .destination('./build')
  .use(DittoJSON())
  .build();
