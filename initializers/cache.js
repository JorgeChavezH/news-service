// TODO: Consider create an object to abstract the node-cache implementation
const Redis = require('ioredis');

global.cache = new Redis({
    host: config.cache.host,
    port: config.cache.port
});

global.ignoreCache = false;