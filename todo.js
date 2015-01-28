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
      var fireTodo = new FireTodo(todo.title, todo.completed, snap.ref());
      this.todos.push(fireTodo);
      lifecycle.tick(); // Websockets not good on zone
    }.bind(this));
  }
  enterTodo($event) {
    this.text = $event.target.value;
    if($event.which === 13) {
      this.addTodo();
    }
  }
  addTodo() {
    //this.todos.push(new Todo(this.text, false));
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
}

class Todo {

  constructor(theTitle: string, isCompleted: boolean) {
    this.title = theTitle;
    this.completed = isCompleted;
  }
}

class FireTodo extends Todo {
  id: string;
  ref: Firebase;

  constructor(theTitle: string, isCompleted: boolean, theRef: Firebase) {
    super(theTitle, isCompleted);
    this.ref = theRef;
    this.id = theRef.key();
  }

  update() {
    this.ref.update(new Todo(this.title, this.completed));
  }

}


export function main() {
  ng.bootstrap(TodoList);
}
