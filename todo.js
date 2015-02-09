import {
  bootstrap,
  Component,
  Decorator,
  TemplateConfig,
  Foreach,
  NgElement
} from 'angular2/angular2';
import {DOM} from 'angular2/src/facade/dom';
import {Injector, Inject, bind} from 'angular2/di';
import {AngularFire, FirebaseArray} from 'firebase/AngularFire';

var keymap = {
  tab: 9,
  enter: 13,
  esc: 27,
  up: 38,
  down: 40
};

@Decorator({
  selector: '[todo-focus]',
  bind: {
    'todo-focus': 'isFocused'
  }
})
class TodoFocus {
  set isFocused(value) {
    console.log('isFocused', value);
    if (value) {
      this.element.domElement.focus();
    }
    return value;
  }
  constructor(el: NgElement) {
    console.log('todo-focus', el);
    this.element = el;

  }
}

@Decorator({
  selector: '[ng-show]',
  bind: {
    'ng-show': 'ngShow'
  }
})
class NgShow {
  element:NgElement;
  set ngShow(value) {
    var el = this.element.domElement;
    if (value) {
      el.style.display = 'block';
      DOM.removeClass(el, 'hidden');
      DOM.addClass(el, 'visible');
      // el.className = el.className.replace('hidden', '');
      // el.className += ' visible';
    } else {
      el.style.display = 'none';
      DOM.removeClass(el, 'visible');
      DOM.addClass(el, 'hidden');
    }
    return value;
  }
  constructor(el: NgElement) {
    console.log('ng-show', el);
    this.element = el;
  }
}


@Component({
  selector: 'todo-app',
  componentServices: [
    AngularFire,
    bind(Firebase).toValue(new Firebase('https://webapi.firebaseio.com/test'))
  ],
  template: new TemplateConfig({
    url: '/todo.html',
    directives: [
      Foreach,
      TodoFocus,
      NgShow
    ]
  })
})
class TodoApp {
  text: string;
  todoService: FirebaseArray;
  todoEdit: any;

  constructor(sync: AngularFire) {
    // TODO: refactor into TodoStorage service
    this.todoService = sync.asArray();
    this.text = '';
    this.todoEdit = null;
  }
  enterTodo($event) {
    this.text = $event.target.value;
    if ($event.which === keymap.enter) { // ENTER_KEY
      this.addTodo();
    }
  }
  editTodo($event, todo) {
    this.todoEdit = todo;
  }
  doneEditing($event, todo) {
    var which = $event.which;
    var target = $event.target;
    if (which === keymap.enter) {
      todo.title = target.value;
      this.todoService.save(todo);
      this.todoEdit = null;
    }
    else if (which === keymap.esc) {
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
    this.todoService.list.forEach((todo) => {
      todo.completed = isComplete;
      this.todoService.save(todo);
    });
  }
  clearCompleted() {
    var toClear = {};
    this.todoService.list.forEach((todo) => {
      if (todo.completed) {
        toClear[todo._key] = null;
      }
    });
    this.todoService.bulkUpdate(toClear);
  }
  get remainingCount() {
    return this.todoService.list.filter((todo) => !todo.completed).length;
  }
  get completedCount() {
    return this.todoService.list.filter((todo) => todo.completed).length;
  }
  get locationPath() {
    // dirty checking plz
    // TODO: refactor into service
    return location.hash.replace('#/', '');
  }
}


export function main() {
  bootstrap(TodoApp);
}
