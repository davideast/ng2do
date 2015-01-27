import * as ng from 'angular/angular';

@ng.Component({
    selector: 'todo-app',
    template: new ng.TemplateConfig({
      inline: `
      <div class="todo-container">
        <input type="text" (keyup)="enterTodo($event)">
        <button class="addButton" (click)="addTodo()">Add Todo</button>
        <hr >
        <!-- Can I use $index or something here?-->
        <div template="ng-repeat #todo in todos">

        {{todo.title}}

        <input type="checkbox">

        </div>
      </div>
    `,
    directives: [ng.NgRepeat]
  })
})
class TodoList {
  todos: Array;
  el: ng.NgElement;

  constructor(element: ng.NgElement) {
    this.todos = [new Todo('Eat Pizza', false), new Todo('Walk Dog', true)];
    this.el = element;
    // Needs some polishing here. Can I use #var on the input?
    this.input = this.el.domElement.shadowRoot.querySelector('input[type=text]');
  }
  enterTodo($event) {
    if($event.which === 13) {
      this.addTodo();
    }
  }
  addTodo() {
    this.todos.push(new Todo(this.input.value, false));
    this.clearInput();
  }
  clearInput() {
    this.input.value = '';
  }
}

class Todo {

  title: string;
  completed: boolean;

  constructor(theTitle: string, isCompleted: boolean) {
    this.title = theTitle;
    this.completed = isCompleted;
  }
}


export function main() {
  ng.bootstrap(TodoList);
}
