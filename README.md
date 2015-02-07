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
