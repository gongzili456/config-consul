const configSync = require('../lib/config');

configSync({
  host: '{host}',
  port: 80,
  prefixKey: 'id-mapping/' + (process.env.NODE_ENV || 'development') + '/'
})
.then(function (config) {
  console.log('config: ', config);
})
.catch(console.error);
