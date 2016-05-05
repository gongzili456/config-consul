const Consul = require('consul');
const _ = require('lodash');
const assert = require('assert');
const assign = require('deep-assign');
const config = require('config');

module.exports = function (options) {

  ['host', 'prefixKey'].map(key => {
    assert(options[key], `${key} is required.`);
  });

  options = assign({
    port: 8500,
    promisify: true
  }, options);

  var consul = Consul(options);

  var watch = consul.watch({
    method: consul.kv.get,
    options: {
      key: options.prefixKey,
      recurse: true
    }
  });

  return new Promise(function(resolve, reject) {
    consul.kv.get({
      key: options.prefixKey,
      recurse: true
    }).then(data => {
      var conf = transform(data, options.prefixKey);
      return assign(config, conf);
    })
    .then(() => {
      watch.on('change', (data, res) => {
        var conf = transform(data, options.prefixKey);
        assign(config, conf);
      });
      watch.on('error', (err) => {
        throw(err);
      });
      resolve(config);
    })
    .catch(reject);
  });
}

function transform(original, prefixKey) {
  var kv = _.reduce(original, function (target, o) {
    return assign(target, {
      [o.Key]: o.Value
    })
  }, {});

  var conf = {};
  _.map(Object.keys(kv), k => {
    return assign(conf, _.reduceRight(k.split('/'), function (target, key) {
      return {[key]: target};
    }, kv[k]));
  });

  return _.reduce(_.compact(prefixKey.split('/')), function (target, k) {
    return target[k];
  }, conf);;
}
