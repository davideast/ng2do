import * as ng from 'angular/angular';
import {LifeCycle} from 'core/life_cycle/life_cycle';
import {Injector} from 'di/di';

/*

  Websockets with Zone
  Inject lifecycle regardless of the circular dependencies which breaks the DI

*/

@ng.Component({
    selector: 'todo-app',
    template: new ng.TemplateConfig({
      inline: `
      <div class="todo-container">
        <input type="text" (keyup)="enterTodo($event)" [value]="text">
        <button class="addButton" (click)="addTodo()">Add Todo</button>
        <hr >

        <div template="ng-repeat #todo in todos">

        <!-- <div template="ng-repeat: var todo in todos; var i = index;"> -->

      {{todo.title}}

        <input type="checkbox" (click)="completeMe(todo)" [checked]="todo.completed">
        <button (click)="deleteMe(todo)">Delete</button>

        </div>
      </div>
    `,
    directives: [ng.NgRepeat]
  })
})
class TodoList {
  todos: Array;
  text: string;
  ref: Firebase;

  constructor(injector: Injector) {
    this.todos = [];
    this.text = '';
    this.ref = new Firebase('https://webapi.firebaseio.com/test');
    this.ref.on('child_added', function(snap) {
      var lifecycle = injector.get(LifeCycle);
      var todo = snap.val();
      var fireTodo = new FireTodo(new Todo(todo), snap.ref());
      this.todos.push(fireTodo);
      lifecycle.tick();
    }.bind(this));

    this.ref.on('child_removed', function(snap) {
      var lifecycle = injector.get(LifeCycle);
      var fireTodo = this.todos.find((todo) => {
        return todo.id === snap.key();
      });
      var indexOfFireTodo = this.todos.indexOf(fireTodo);
      if (indexOfFireTodo > -1) {
        this.todos.splice(indexOfFireTodo, 1);
      }
      lifecycle.tick();
    }.bind(this));

  }
  enterTodo($event) {
    this.text = $event.target.value;
    if($event.which === 13) {
      this.addTodo();
    }
  }
  addTodo() {
    this.ref.push({
      title: this.text,
      completed: false
    });
    this.text = '';
  }
  completeMe(todo) {
    todo.completed = !todo.completed;
    todo.update();
  }
  deleteMe(todo) {
    todo.remove();
  }
}

class Todo {
  constructor(todo: any) {
    this.title = todo.title;
    this.completed = todo.completed;
  }
}

class FireTodo extends Todo {
  constructor(todo: Todo, theRef: Firebase) {
    super(todo);
    this.ref = theRef;
    this.id = theRef.key();

    // listen to any value changes on the model
    this.ref.on('value', function(snap) {
      var todoValue = snap.val();
      this.title = todoValue.title;
      this.completed = todoValue.completed;
    }.bind(this));

  }

  update() {
    this.ref.update(new Todo({title: this.title, completed: this.completed}));
  }

  remove() {
    this.ref.remove();
  }

}


export function main() {
  ng.bootstrap(TodoList);
}
