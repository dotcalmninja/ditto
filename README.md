# ditto

[![NPM](https://nodei.co/npm/ditt0.png?mini=true)](https://npmjs.org/package/ditt0)

> An extremely easy-to-use, composable, static site builder. But also much more...

A performant file pipeline, ditto allows you to compose your solution through a stack of prefabricated or ad hoc _middleware_. Provide ditto with a directory to parse, include some middleware and start building. 

At its core ditto is nothing more than an abstract directory parser. All of the magic happens as the file buffers are parsed through the designated stack of middleware.

## Getting Started

Below is a  simple [example](https://github.com/pimbrouwers/ditto/tree/master/examples/basic-site)  using the [ditt0-hbs](https://npmjs.org/package/ditt0-hbs) and [ditto-json](https://npmjs.org/package/ditt0-json) middleware to generate a basic static site.

1. `npm init`
2. `npm install ditt0`, `npm install ditt0-json` & `npm install ditt0-hbs` at which point you should be left with a package file that looks something like:
```json
{
  "name": "basic-site",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {
    "ditt0": "^1.0.0",
    "ditt0-json": "^1.0.0",
    "ditt0-hbs": "^1.0.0"
  },
  "scripts": {
    "start": "node index.js"
  }
}
```
3. Create the `./src` directory to house your page content 
    > This is the directory ditt0 will parse as denoted by `.source('./src')`
4. Create the `./templates` and `./templates/partials` directories to house your handlebars templates
    > [ditt0-hbs](https://npmjs.org/package/ditt0-hbs) will look for these directories by default, but is customizable using the `templates` and `partials` properties respectively)
5. In the root directory create `index.js` and include the following code:
```javascript
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
    Console.log("ditt0 basic site finished building!")
  });
```
6. To build run: `npm start`
7. Profit!

## API

`metadata(object)`
Set globally accessible data.

`source(path)`
The directory you want ditto to parse.

`destination(path)`
Where you want the built files to go.

`use(fn)`
Add middleware to the stack.

`clobber(boolean)`
Option to clear the destination directory before building (true by default)

`build(fn)`
Build the project with the given settings.

## License
MIT License

Copyright (c) 2017 Pim Brouwers

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.