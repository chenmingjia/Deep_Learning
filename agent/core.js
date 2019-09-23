const KoaApplication = require('koa');
const Messenger = require('./messenger');
const cluster = require('cluster-client');

console.log(Messenger)
class EggCore extends KoaApplication {

  constructor(options = {}) {
    super(options);

    this.messenger = Messenger.create(this);

    this.messenger.once('egg-ready', () => {
      // this.lifecycle.triggerServerDidReady();
      console.log('HAS READY')
    });

    this.cluster = (clientClass, options) => {
      options = Object.assign({}, this.config.clusterClient, options, {
        singleMode: this.options.mode === 'single',
        // cluster need a port that can't conflict on the environment
        port: this.options.clusterPort,
        // agent worker is leader, app workers are follower
        isLeader: this.type === 'agent',
        logger: this.coreLogger,
      });
      const client = cluster(clientClass, options);
      this._patchClusterClient(client);
      return client;
    };
  }
}

module.exports = EggCore;