# ditto

A performant file pipeline, ditto allows you to compose your solution through a stack of prefabricated or ad hoc _middleware_. Provide ditto with a directory to parse, include some middleware and start building. 

At its core ditto is nothing more than an asynchronous (and recursive) directory reader. All of the magic happens as the file buffers are parsed through the designated stack of middleware.

[![npm](https://img.shields.io/npm/v/ditt0.svg)](https://www.npmjs.com/package/ditt0)

## API

`metadata(object)`
Set globally accessible data. Default value: `{}`.

`source(path)`
The directory you want ditto to parse. Default value: `src`.

`destination(path)`
Where you want the built files to go. Default value: `public`.

`use(fn)`
Add middleware to the stack. 

`clobber(boolean)`
Option to clear the destination directory before building. Default value: `false`.

`build(fn)`
Build the project with the given settings.

## License
MIT License

Copyright (c) 2018 Pim Brouwers

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
