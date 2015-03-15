
export class TodoStore {
  constructor() {
    this.list = [];
    this._uid = 0;
  }

  nextUid() {
    this._uid = this._uid + 1;
    return this._uid;
  }

  getItem(recOrIndex: any) {
    var item = recOrIndex;
    if(typeof(recOrIndex) === "number") {
      item = this.getRecord(recOrIndex);
    }
    return item;
  }

  add(rec: any) {
    var addedItem = this.keyify(rec);
    this.list.push(addedItem);
  }

  remove(recOrIndex: any) {
    var removeItem = this.getItem(recOrIndex);
    this.spliceOut(removeItem._key);
  }

  save(rec: any) {
    var item = this.getItem(rec);
    var indexToUpdate = this.indexFor(item._key);
    rec._key = item._key;
    this.list[indexToUpdate] = rec;
  }

  keyify(item) {
    item._key = this.nextUid();
    return item;
  }

  bulkUpdate(items) {
    this.list.forEach((item) => {
      this.save(item);
    });
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
