# config-consul

针对基于 [Consul](https://www.consul.io/) 的中心化配置方案，实现的客户端的配置文件同步模块。

基于类库 [config](https://www.npmjs.com/package/config) and [consul](https://www.npmjs.com/package/consul);

# 特性
 1. 读取特定前缀的配置信息
 2. 监听该前缀配置的变化
 3. 导出到 [config](https://www.npmjs.com/package/config) 
 
 
# 选项
 1. host: 必选，配置中心的host
 2. port: 可选，默认为：8500
 
# 使用

```
var configSync = require('config-consul');

configSync({
  host: '{host}',
  port: 80,
  prefixKey: 'id-mapping/'
})
.then(function (config) {
  console.log('config: ', config);
})
.catch(console.error);
```

# 配合koa.js使用

```
var configSync = require('config-consul');
var server = require('koa');

const PORT = process.env.PORT || 2048;
const ENV = process.env.NODE_ENV || 'development';

configSync({
  host: '{host}',
  port: 80,
  prefixKey: `project/${ENV}/`
}).then(() => {
  server.listen(PORT, function () {
    console.log('Server started on port ', PORT);
  });
}).catch(err => {
  console.error('server start err: ', err.stack);
})

```

# 在代码中读取配置
```
var config = require('config');

var name = config.name;
console.log('name: ', name);
```
