# Angular 2 Todo App

Angular 2 is not packaged or ready for production... but this is a todo app with it.

### Prerequisite: Build Angular 2.0

1. Clone the [Angular Github repo](https://github.com/angular/angular/) to your computer: `git clone https://github.com/angular/angular.git`. For this example, we'll assume you've cloned Angular to your $HOME directory (~/angular).
2. `cd ~/angular` then `sudo npm install` to install the Angular build dependencies.
3. Next, build Angular: `gulp build`

### Instructions

1. Clone the ng2do repo to your computer: `git clone https://github.com/davideast/ng2do`. Again, we'll assume you're cloning to your home directory (~/ng2do).
2. `cd ~/ng2do`
3. Create a symlink to the angular2 es6 folder:
 `ln -s ~/angular/dist/js/dev/es6 ng`
4. Start a simple webserver using either python `python -m SimpleHTTPServer` or node `sudo npm install -g live-server;live-server;` and open your browser to that webserver's url.

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

### Apache 2.0 License
