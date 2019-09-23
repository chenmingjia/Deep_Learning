const sendmessage = require('sendmessage');
const EventEmitter = require('events');
const is = require('is-type-of');

class Messenger extends EventEmitter {

  constructor() {
    super();
    this.pid = String(process.pid);
    // pids of agent or app maneged by master
    // - retrieve app worker pids when it's an agent worker
    // - retrieve agent worker pids when it's an app worker
    this.opids = [];
    this.on('egg-pids', pids => {
      this.opids = pids;
    });
    this._onMessage = this._onMessage.bind(this);
    process.on('message', this._onMessage);
  }

  broadcast(action, data) {
    console.log('[%s] broadcast %s with %j', this.pid, action, data);
    this.send(action, data, 'app');
    this.send(action, data, 'agent');
    return this;
  }

  sendRandom(action, data) {
    /* istanbul ignore if */
    if (!this.opids.length) return this;
    const pid = random(this.opids);
    this.sendTo(String(pid), action, data);
    return this;
  }

  sendToApp(action, data) {
    console.log('[%s] send %s with %j to all app', this.pid, action, data);
    this.send(action, data, 'app');
    return this;
  }

  sendToAgent(action, data) {
    console.log('[%s] send %s with %j to all agent', this.pid, action, data);
    this.send(action, data, 'agent');
    return this;
  }

  sendTo(pid, action, data) {
    console.log('[%s] send %s with %j to %s', this.pid, action, data, pid);
    sendmessage(process, {
      action,
      data,
      receiverPid: String(pid),
    });
    return this;
  }

  send(action, data, to) {
    sendmessage(process, {
      action,
      data,
      to,
    });
    return this;
  }

  _onMessage(message) {
    if (message && is.string(message.action)) {
      console.log('[%s] got message %s with %j, receiverPid: %s, myPid: %s',
        this.pid, message.action, message.data, message.receiverPid, this.pid);
      this.emit(message.action, message.data);
    }
  }

  close() {
    process.removeListener('message', this._onMessage);
    this.removeAllListeners();
  }

}

exports.create = egg => {
  return new Messenger(egg);
};
