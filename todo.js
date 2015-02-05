import * as ng from 'angular/angular';
import {Injector, Inject, bind} from 'di/di';
import {AngularFire, FirebaseArray} from 'firebase/AngularFire';

@ng.Component({
    selector: 'todo-app',
    componentServices: [
      AngularFire,
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
          <input id="toggle-all" type="checkbox" (click)="toggleAll($event)">
          <label for="toggle-all">Mark all as complete</label>

          <ul id="todo-list">
            <li template="ng-repeat #todo in todoService.list">
              <div [style]="todoStyle" class="view">
                <input class="toggle" type="checkbox" (click)="completeMe(todo)" [checked]="todo.completed">
                <label (dblclick)="editTodo($event, todo)">{{todo.title}}</label>
                <button class="destroy" (click)="deleteMe(todo)"></button>
              </div>
              <form (submit)="saveEdits(todo, 'submit')" [hidden]="todo != editTodo"> <!-- !== breaks here -->
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

    `,
    directives: [ng.NgRepeat]
  })
})
class TodoApp {
  text: string;
  todoService: FirebaseArray;
  todoStyle: any;
  todoEdit: any;

  constructor(sync: AngularFire) {
    this.todoService = sync.asArray();
    this.text = '';
    this.todoEdit = null;
    this.todoStyle = {};
  }
  enterTodo($event) {
    this.text = $event.target.value;
    if($event.which === 13) { // ENTER_KEY
      this.addTodo();
    }
  }
  editTodo($event, todo) {
    this.todoEdit = todo;
    this.todoStyle = {
      display: 'none'
    };
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
  toggleAll($event) {
    var isComplete = $event.target.checked;
    this.todoService.list.forEach(function(todo) {
      todo.completed = isComplete;
      this.todoService.save(todo);
    }.bind(this));
  }
  clearCompleted() {
    var toClear = {};
    this.todoService.list.forEach((todo) => {
      if(todo.completed) {
        toClear[todo._key] = null;
      }
    });
    this.todoService.bulkUpdate(toClear);
  }

}

@ng.Decorator({
  selector: '[todo-focus]',
  bind: {
    'todo-focus': 'isFocused'
  }
})
class TodoFocus {
  set isFocused(value) {
    if(value) {
      //
    } else {
      //
    }
  }
  constructor(el: ng.NgElement) {

  }
}

export function main() {
  ng.bootstrap(TodoApp);
}
