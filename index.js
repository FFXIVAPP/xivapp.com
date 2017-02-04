require('babel-register');

if (process.env.NEW_RELIC_APP_NAME && process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

const source = require('./src/');

const cluster = require('cluster');
const fs = require('fs');
const os = require('os');

const fork = () => {
  // Let's get cluster count based on total memory and container size if not default of 1.5GB
  // process.env.CONTAINER_MEMORY_LIMIT is represented in MB
  const CONTAINER_MEMORY_LIMIT = parseInt(process.env.CONTAINER_MEMORY_LIMIT || 0, 10) * 1024 * 1024;
  const AVAILABLE_MEMORY = CONTAINER_MEMORY_LIMIT || os.totalmem();
  const LIMIT = Math.floor((AVAILABLE_MEMORY / (1610612736)) * 0.75) || 1;

  for (let i = 0; i < LIMIT; i++) {
    const worker = cluster.fork();
    console.log('FORKED =>', {
      message: `A worker with ID [${worker.id}] was forked.`
    });
  }
};

if (module.parent) {
  module.exports = source(false);
} else {
  if (cluster.isMaster) {
    const timeouts = {};

    fork();

    cluster.on('fork', (worker) => {
      timeouts[worker.id] = setTimeout(() => {
        console.log('TIMEDOUT =>', {
          message: 'Something must be wrong with the connection.'
        });
      }, 30000);
    });
    cluster.on('listening', (worker, address) => {
      clearTimeout(timeouts[worker.id]);

      console.log('LISTENING =>', {
        message: `A worker is now connected to [${address.address}:${address.port}].`
      });
    });

    cluster.on('online', (worker) => {
      console.log('ONLINE =>', {
        message: 'Worker responded after it was forked.'
      });
    });

    cluster.on('disconnect', (worker) => {
      console.log('DISCONNECT =>', {
        message: `Worker #[${worker.id}] has disconnected.`
      });
    });

    cluster.on('exit', (worker, code, signal) => {
      console.log('EXIT =>', {
        message: `Worker [${worker.process.pid}] died [Signal:(${signal}), Code:(${code})].`
      });
    });
  } else {
    source();
  }
}
