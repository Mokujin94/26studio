const redis = require("redis");

const clientRedis = redis.createClient().on('error', err => console.log('Redis Client Error', err))
	.connect();

module.exports = clientRedis