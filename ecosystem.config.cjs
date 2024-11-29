module.exports = {
  apps: [{
    name: 'vcc-platform',
    script: './dist/server/server.js',
    instances: 4,
    exec_mode: 'cluster',
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    wait_ready: false,
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    node_args: [
      '--experimental-specifier-resolution=node',
      '--es-module-specifier-resolution=node'
    ]
  }]
};
