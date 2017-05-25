module.exports = {
  apps : [ {
    name: 'vj',
    script: './build/server.js',
    watch: true,
    ignore_watch: [
      'node_modules',
      'package.json',
      'src',
      'webpack',
      'gulp',
      '.git',
    ],
    env: {
      'NODE_ENV': 'development',
    },
    env_production : {
       'NODE_ENV': 'production',
    },
  } ],
}
