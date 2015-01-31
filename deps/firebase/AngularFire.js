import {LifeCycle} from 'core/life_cycle/life_cycle';
import {Injector, Inject, bind} from 'di/di';

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
