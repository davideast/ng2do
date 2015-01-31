import * as ng from 'angular/angular';
import {LifeCycle} from 'core/life_cycle/life_cycle';
import {Injector, Inject, bind} from 'di/di';


@ng.Component({
    selector: 'todo-app',
    componentServices: [
      FirebaseArray,
      bind(Firebase).toValue(new Firebase('https://webapi.firebaseio.com/test'))
    ],
    template: new ng.TemplateConfig({
      inline: `

      <style>@import "/deps/css/base.css";</style>

      <section id="todoapp">

        <header id="header">
          <h1>todos</h1>
          <input id="new-todo" placeholder="What needs to be done?"
                 autofocus (keyup)="enterTodo($event)" [value]="text">
        </header>

        <section id="main">
          <input id="toggle-all" type="checkbox">
          <label for="toggle-all">Mark all as complete</label>

          <ul id="todo-list">
            <li template="ng-repeat #todo in todos">
              <div class="view">
                <input class="toggle" type="checkbox" (click)="completeMe(todo)" [checked]="todo.completed">
                <label editable>{{todo.title}}</label>
                <button class="destroy" (click)="deleteMe(todo)"></button>
              </div>
            </li>
          </ul>

        </section>

        <footer id="footer">
          <span id="todo-count"></span>
          <ul id="filters">
            <li>
              <a href="#/" class="selected">All</a>
            </li>
            <li>
              <a href="#/active">Active</a>
            </li>
            <li>
              <a href="#/completed">Completed</a>
            </li>
          </ul>
          <button id="clear-completed">Clear completed</button>
        </footer>
      </section>

      <footer id="info">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="http://twitter.com/_davideast">David East</a></p>
      </footer>


      <!-- <div template="ng-repeat: var todo in todos; var i = index;"> -->
    `,
    directives: [ng.NgRepeat, DatePicker, Editable]
  })
})
class TodoApp {
  todos: Array;
  text: string;
  firebaseArray: FirebaseArray;

  constructor(firebaseArray: FirebaseArray) {
    this.firebaseArray = firebaseArray;
    this.todos = firebaseArray.list;
    this.text = '';
  }
  enterTodo($event) {
    this.text = $event.target.value;
    if($event.which === 13) { // ENTER_KEY
      this.addTodo();
    }
  }
  addTodo() {
    this.firebaseArray.add({
      title: this.text,
      completed: false
    });
    this.text = '';
  }
  completeMe(todo) {
    todo.completed = !todo.completed;
    this.firebaseArray.save(todo);
  }
  deleteMe(todo) {
    this.firebaseArray.remove(todo);
  }
}

@ng.Component({
  selector: 'editable-label'
})
class EditableLabel {
  
}

@ng.Decorator({
  selector: '[editable]'
})
class Editable {
  constructor(el: ng.NgElement) {
    var domElement = el.domElement;
    domElement.addEventListener('dblclick', function(e) {
      debugger;
    });
  }
}

class ITodo {
  static assert(todo) {
    return todo && todo.hasOwnProperty('title') && todo.hasOwnProperty('completed');
  }
}

class Todo {
  constructor(todo: ITodo) {
    this.title = todo.title;
    this.completed = todo.completed;
  }
}

class FireTodo extends Todo {
  constructor(todo: ITodo, theRef: Firebase) {
    super(todo);
    this.ref = theRef;
    this.id = theRef.key();

    // listen to any value changes on the model
    this.ref.on('value', function(snap) {
      var todoValue = snap.val();
      if(this.isValidTodo(todoValue)) {
        this.title = todoValue.title;
        this.completed = todoValue.completed;
      }
    }.bind(this));

  }

  isValidTodo(todo) {
    return todo && todo.title && todo.completed;
  }

  update() {
    this.ref.update(new Todo({title: this.title, completed: this.completed}));
  }

  remove() {
    this.ref.remove();
  }

}

var TodoReferences = {
  all: () => {
    return new Firebase('https://webapi.firebaseio.com/test');
  },
  completed: () => {
    return new Firebase('https://webapi.firebaseio.com/test');
  }
};

@ng.Component({
  selector: 'stats',
  bind: {
    size: 'numCompleted'
  },
  template: new ng.TemplateConfig({
    inline: `
      A: {{numCompleted}}
    `
  })
})
class Stats {
    numCompleted: number;

    constructor() {

    }
}


@ng.Component({
  selector: 'date-picker',
  template: new ng.TemplateConfig({
    inline: `{{selected}}`
  }),
  bind: {
    selected: 'selected'
  }
})
class DatePicker {
  selected: string;
}

export function main() {
  ng.bootstrap(TodoApp);
}

/*
  FirebaseArray

*/
@Inject()
class FirebaseArray {
  ref: Firebase;
  error: any;
  list: Array;
  injector: Injector;

  constructor(ref: Firebase, injector: Injector) {
    this.ref = ref;
    this.list = [];
    this.injector = injector;

    // listen for changes at the Firebase instance
    this.ref.on('child_added', this.created.bind(this), this.error);
    this.ref.on('child_moved', this.moved.bind(this), this.error);
    this.ref.on('child_changed', this.updated.bind(this), this.error);
    this.ref.on('child_removed', this.removed.bind(this), this.error);

    // determine when initial load is completed
    // ref.once('value', function() { resolve(null); }, resolve);

  }

  getItem(recOrIndex: any) {
    var item = recOrIndex;
    if(typeof(recOrIndex) === "number") {
      item = this.getRecord(recOrIndex);
    }
    return item;
  }

  getChild(recOrIndex: any) {
    var item = this.getItem(recOrIndex);
    return this.ref.child(item._key);
  }

  add(rec: any) {
    this.ref.push(rec);
  }

  remove(recOrIndex: any) {
    this.getChild(recOrIndex).remove();
  }

  save(recOrIndex: any) {
    var item = this.getItem(recOrIndex);
    this.getChild(recOrIndex).update(item);
  }

  lifecycleTick() {
    this.injector.get(LifeCycle).tick();
  }

  keyify(snap) {
    var item = snap.val();
    item._key = snap.key();
    return item;
  }

  created(snap) {
    var addedValue = this.keyify(snap);
    this.list.push(addedValue);
    this.lifecycleTick();
  }

  moved(snap) {
    var key = snap.key();
    this.spliceOut(key);
    this.lifecycleTick();
  }

  updated(snap) {
    var key = snap.key();
    var indexToUpdate = this.indexFor(key);
    this.list[indexToUpdate] = this.keyify(snap);
    this.lifecycleTick();
  }

  removed(snap) {
    var key = snap.key();
    this.spliceOut(key);
    this.lifecycleTick();
  }

  spliceOut(key) {
    var i = this.indexFor(key);
    if( i > -1 ) {
      return this.list.splice(i, 1)[0];
    }
    return null;
  }

  indexFor(key) {
    var record = this.getRecord(key);
    return this.list.indexOf(record);
  }

  getRecord(key) {
    return this.list.find((item) => key === item._key);
  }

}
