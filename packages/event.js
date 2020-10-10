export default class EventEmitter {
    constructor() {
        this._events = {};
    }
    on(event, callback) {
        //监听 event 事件,触发时调用 callback 函数
        let callbacks = this._events[event] || [];
        callbacks.push(callback);
        this._events[event] = callbacks;
        return this;
    }
    off(event, callback) {
        //停止监听 event 事件
        let callbacks = this._events[event];
        this._events[event] = callbacks && callbacks.filter(fn => fn !== callback);
        return this;
    }
    emit(event, ...args) {
        //触发事件,并把参数传给事件的处理函数
        const callbacks = this._events[event];
        callbacks.forEach(fn => fn.apply(null, args));
        return this;
    }
}