class Node {
  constructor (v) {
    this.val = v;
    this.prev = null;
    this.next = null;
  }
}

class List {
  constructor () {
    this.cursor = new Node(-1);
    this.head = null;
    this.tail = null;
    this.listSize = 0;
  }

  // thisength(List this)
  // returns the number of elements in this
  length () {
    return this.listSize;
  }

  // index(List this)
  // returns index of cursor element if defined, otherwise returns -1
  index () {
    return this.cursor.val;
  }

  // front(List this)
  // returns the front element of this
  // pre: length() > 0
  front () {
    return this.head.val;
  }

  // back(List this)
  // returns the back element of this
  // pre: length() > 0
  back () {
    return this.tail.val;
  }

  isEmpty () {
    if (this.listSize === 0) {
      return true;
    }
    return false;
  }

  popFront () {
    const head = this.getFront();
    this.deleteFront();
    return head;
  }

  // get(List this)
  // returns cursor element of this
  // pre: length() > 0, index() >= 0
  get () {
    if (this.listSize === 0) {
      console.log('List Error: calling get() on empty List');
      return;
    }
    if (this.cursor.val === -1) {
      console.log('List Error: calling get() with undefined cursor');
      return;
    }
    return this.cursor.next.val;
  }

  // equals(List this, List B)
  // returns true (1) iff Lists this and B are in the same state, otherwise returns false (0)
  equals (B) {
    if (this.listSize !== B.listSize) { // Verify that lists are the same size
      return 0;
    }
    if (this.listSize === 0) { // Verify that lists are not empty
      return 1;
    }
    let S = this.head;
    let T = B.head;
    while (S !== null && T !== null) { // Verify that each index has the same value
      if (S.val !== T.val) {
        return 0;
      }
      S = S.next;
      T = T.next;
    }
    return 1;
  }

  // clear(List this)
  // resets this to empty state
  clear () {
    if (this.listSize === 0) {
      return;
    } else {
      let T = this.head;
      while (T !== null) {
        T = this.head.next;
        this.head = T;
      }
    }
    this.head = null;
    this.tail = null;
    this.cursor.val = -1;
    this.listSize = 0;
  }

  // moveFront(List this)
  // if this is nonempty, sets cursor to front element, otherwise does nothing
  moveFront () {
    if (this.listSize === 0) {
      return;
    }
    this.cursor.next = this.head;
    this.cursor.val = 0;
  }

  // moveBack(List this)
  // if this is nonempty, sets cursor to back element, otherwise does nothing
  moveBack () {
    if (this.listSize === 0) {
      return;
    }
    this.cursor.next = this.tail;
    this.cursor.val = this.listSize - 1;
  }

  // movePrev(List this)
  // if cursor is defined and not at the front, move the cursor one step toward the front. If at front, set to underfined. If underfined, do nothing
  movePrev () {
    if (this.cursor.val === -1) { // Exit if cursor is undefined
      return;
    }
    if (this.cursor.val === 0) { // Set cursor undefined if at front already
      this.cursor.val = -1;
    } else { // Move cursor one space back
      this.cursor.next = this.cursor.next.prev;
      this.cursor.val--;
    }
  }

  // moveNext(List this)
  // if cursor is defined and not at the back, move cursor one step toward the back. If at the back, set to undefined. If underfined, do nothing
  moveNext () {
    if (this.cursor.val === -1) { // Exit if cursor is undefined
      return;
    }
    if (this.cursor.val === this.listSize - 1) { // Set cursor undefined if at back already
      this.cursor.val = -1;
    } else { // Move cursor one space foreward
      this.cursor.next = this.cursor.next.next;
      this.cursor.val++;
    }
  }

  // prepend(List this, data)
  // insert new element into this, before the front element if nonempty
  prepend (data) {
    const N = new Node(data);
    if (this.listSize === 0) {
      this.head = N;
      this.tail = N;
      this.listSize++;
    } else {
      this.head.prev = N;
      N.next = this.head;
      this.head = N;
      this.listSize++;
      this.cursor.val++;
    }
  }

  // append(List this, data)
  // insert new element into this, after the last element if nonempty
  append (data) {
    const N = new Node(data);
    if (this.listSize === 0) {
      this.head = N;
      this.tail = N;
      this.listSize++;
    } else {
      this.tail.next = N;
      N.prev = this.tail;
      this.tail = N;
      this.listSize++;
    }
  }

  // insertBefore(List this, data)
  // inserts new element before cursor
  // pre: length() > 0, index() >= 0
  insertBefore (data) {
    if (this.listSize === 0) {
      console.log('List Error: calling insertBefore() on empty List');
      return;
    }
    if (this.cursor.val === -1) {
      console.log('List Error: calling insertBefore() with undefined cursor');
      return;
    }
    if (this.cursor.val === 0) {
      this.prepend(data);
    } else {
      const N = new Node(data);
      N.next = this.cursor.next;
      N.prev = this.cursor.next.prev;
      this.cursor.next.prev.next = N;
      this.cursor.next.prev = N;
      this.listSize++;
      this.cursor.val++;
    }
  }

  // insertAfter(List this, data)
  // inserts new element before cursor
  // pre: length() > 0, index() >= 0
  insertAfter (data) {
    if (this.listSize === 0) {
      console.log('List Error: calling insertAfter() on empty List');
      return;
    }
    if (this.cursor.val === -1) {
      console.log('List Error: calling insertAfter() with undefined cursor');
      return;
    }
    if (this.cursor.val === (this.listSize) - 1) {
      this.append(data);
    } else {
      const N = new Node(data);
      N.next = this.cursor.next.next;
      N.prev = this.cursor.next;
      this.cursor.next.next.prev = N;
      this.cursor.next.next = N;
      this.listSize++;
    }
  }

  // deleteFront(List this)
  // deletes front element
  // pre: length() > 0
  deleteFront () {
    if (this.listSize === 0) {
      console.log('List Error: calling deleteFront() on empty List');
      return;
    }
    if (this.listSize === 1) {
      this.clear();
    } else {
      const N = this.head.next;
      this.head = N;
      this.head.prev = null;
      this.listSize--;
      if (this.cursor.val !== -1) {
        this.cursor.val--;
      }
    }
  }

  // deleteBack(List this)
  // deletes back element
  // pre: length() > 0
  deleteBack () {
    if (this.listSize === 0) {
      console.log('List Error: calling deleteBack() on empty List');
      return;
    }
    if (this.listSize === 1) {
      this.clear();
    } else {
      if (this.cursor.val === this.listSize - 1) { // Set cursor to undefined if it was at the last element
        this.cursor.val = -1;
      }
      const N = this.tail.prev;
      this.tail = N;
      this.tail.next = null;
      this.listSize--;
    }
  }

  // delete(List this)
  // deletes cursor element, making cursor undefined
  // pre: length() > 0, index() >= 0
  delete () {
    if (this.listSize === 0) {
      console.log('List Error: calling delete() on empty List');
      return;
    }
    if (this.cursor.val === -1) {
      console.log('List Error: calling delete() with undefined cursor');
      return;
    }
    if (this.listSize === 1) {
      this.clear();
    } else if (this.cursor.next === this.head) {
      this.deleteFront();
    } else if (this.cursor.next === this.tail) {
      this.deleteBack();
    } else {
      const N = this.cursor.next.prev;
      N.next = this.cursor.next.next;
      this.cursor.next.next.prev = N;
      this.cursor.val = -1;
      this.listSize--;
    }
  }

  // copyList(List this)
  // returns a new List representing the same integer sequence as this. The cursor in the new List is undefined, regardless of the state of the cursor in this
  copyList () {
    const N = new List();
    if (this.listSize === 0) {
      return N;
    }
    let T = this.head;
    while (T !== null) {
      N.append(T.val);
      T = T.next;
    }
    return N;
  }
}
