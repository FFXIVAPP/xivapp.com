module.exports = {
  ops: {
    interval: 15000
  },
  includes: {
    request: [
      'headers',
      'payload'
    ],
    response: [
      'payload'
    ]
  },
  reporters: {
    console: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{
        log: '*',
        error: '*',
        response: '*',
        request: '*'
      }]
    }, {
      module: 'good-console'
    }, 'stdout'],
    everything: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{
        ops: '*',
        log: '*',
        response: '*',
        request: '*',
        error: '*'
      }]
    }, {
      module: 'good-squeeze',
      name: 'SafeJson'
    }, {
      module: 'rotating-file-stream',
      args: ['everything.log', {
        path: './logs/',
        size: '10M',
        interval: '1d',
        compress: 'gzip'
      }]
    }],
    debug: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{
        log: 'debug'
      }]
    }, {
      module: 'good-squeeze',
      name: 'SafeJson'
    }, {
      module: 'rotating-file-stream',
      args: ['debug.log', {
        path: './logs/',
        size: '10M',
        interval: '1d',
        compress: 'gzip'
      }]
    }],
    info: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{
        log: 'info'
      }]
    }, {
      module: 'good-squeeze',
      name: 'SafeJson'
    }, {
      module: 'rotating-file-stream',
      args: ['info.log', {
        path: './logs/',
        size: '10M',
        interval: '1d',
        compress: 'gzip'
      }]
    }],
    error: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{
        log: 'error',
        error: '*'
      }]
    }, {
      module: 'good-squeeze',
      name: 'SafeJson'
    }, {
      module: 'rotating-file-stream',
      args: ['error.log', {
        path: './logs/',
        size: '10M',
        interval: '1d',
        compress: 'gzip'
      }]
    }]
  }
};
