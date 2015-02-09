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
    url: '/todo.html',
    directives: [ng.NgRepeat]
  })
})
class TodoApp {
  text: string;
  todoService: FirebaseArray;
  todoEdit: any;

  constructor(sync: AngularFire) {
    this.todoService = sync.asArray();
    this.text = '';
    this.todoEdit = null;
  }
  enterTodo($event) {
    this.text = $event.target.value;
    if($event.which === 13) { // ENTER_KEY
      this.addTodo();
    }
  }
  editTodo($event, todo) {
    this.todoEdit = todo;
  }
  doneEditing($event, todo) {
    var which = $event.which;
    var target = $event.target;
    if(which === 13) {
      todo.title = target.value;
      this.todoService.save(todo);
      this.todoEdit = null;
    } else if (which === 27) {
      this.todoEdit = null;
      target.value = todo.title;
    }
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
