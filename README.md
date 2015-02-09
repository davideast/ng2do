# Angular 2 Todo App

Angular 2 is not packaged or ready for production... but this is a todo app with it.

### Installation

1. Clone angular2/angular2 somewhere on your disk.
2. Follow the instructions for Angular 2 and `gulp build` there.
3. `ln -s ~/angular/dist/js/dev deps/ng` in the root of this repo.
4. `$ npm install -g serve`
5. `$ serve`
6. Write your AtScript code in todo.js.
7. `localhost:8080`

### Static deps
(already included in the deps folder)
1. The latest version of traceur.js (modified to support atscript out of the box).
2. The latest version of system.js
3. The latest version of es6-module-loader.js
4. The latest version of zone.js (and long-stacktrace-zone.js)

### Hacks
Due to bug in system.js and traceur integration, options are not picked up,
(TODO:rado file a bug and put a link here). To support atscript, we manually
edited the atscript flags in `traceur.js` (see `index.html` for the names of the flags.)

The MIT License (MIT)

Copyright (c) David East

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
