import * as ng from 'angular/angular';
import {LifeCycle} from 'core/life_cycle/life_cycle';
import {Injector, Inject, bind} from 'di/di';


@ng.Component({
    selector: 'todo-app',
    componentServices: [
      $Firebase,
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
            <li template="ng-repeat #todo in todoService.list">
              <div class="view">
                <input class="toggle" type="checkbox" (click)="completeMe(todo)" [checked]="todo.completed">
                <label (dblclick)="editTodo($event, todo)">{{todo.title}}</label>
                <button class="destroy" (click)="deleteMe(todo)"></button>
              </div>
              <form (submit)="saveEdits(todo, 'submit')">
                <input class="edit">
              </form>
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
          <button id="clear-completed" (click)="clearCompleted()">Clear completed</button>
        </footer>
      </section>

      <footer id="info">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="http://twitter.com/_davideast">David East</a></p>
      </footer>


      <!-- <div template="ng-repeat: var todo in todos; var i = index;"> -->
    `,
    directives: [ng.NgRepeat]
  })
})
class TodoApp {
  text: string;
  todoService: FirebaseArray;

  constructor($firebase: $Firebase) {
    this.todoService = $firebase.asArray();
    this.text = '';
  }
  enterTodo($event) {
    this.text = $event.target.value;
    if($event.which === 13) { // ENTER_KEY
      this.addTodo();
    }
  }
  editTodo($event, todo) {
    debugger;
  }
  addTodo() {
    this.todoService.add({
      title: this.text,
      completed: false
    });
    this.text = '';
  }
  completeMe(todo) {
    todo.completed = !todo.completed;
    this.todoService.save(todo);
  }
  deleteMe(todo) {
    this.todoService.remove(todo);
  }
  clearCompleted() {
    this.todoService.list.forEach(function(todo) {
      if(todo.completed) {
        this.todoService.remove(todo);
      }
    }.bind(this));
  }
}

@ng.Decorator({
  selector: '[todo-focus]'
})
class TodoFocus {

}

export function main() {
  ng.bootstrap(TodoApp);
}

@Inject()
class TodoService {
  constructor(ref: Firebase) {
    this.todos = [];

  }
  add(){

  }
  save(){

  }
  remove(){

  }
}

@Inject()
class $Firebase {
  ref: Firebase;
  injector: Injector;
  constructor(ref: Firebase, injector: Injector) {
    this.ref = ref;
    this.injector = injector;
  }
  asArray() {
    return new FirebaseArray(this.ref, this.injector);
  }
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
