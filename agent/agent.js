const EggCore = require('./core');
const cluster = require('cluster');

class Agent extends EggCore {
  
  constructor(options = {}) {
    super(options);
  }

}

var agent = new Agent()

var client = new EggCore()
agent.messenger.sendToApp('xxx_action', {name: 123});

console.log(agent.messenger.pid, client.messenger.pid)