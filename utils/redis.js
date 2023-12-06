import { promisify } from 'util';
const redis = require('redis');

class RedisClient {
  constructor() {
    this.isConnected = true;
    this.redisClient = redis.createClient();
    this.redisClient.on('error', (error) => {
      console.error(`Redis client not connected to the server : ${error}`);
      this.isConnected = false;
    });
    this.redisClient.on('ready', () => {
      this.isConnected = true;
    });
  }

  isAlive() {
    return this.isConnected;
  }

  async get(key) {
    const promiseData = promisify(this.redisClient.get).bind(this.redisClient);
    return promiseData(key);
  }

  async set(key, value, exp) {
    const promiseData = promisify(this.redisClient.setex).bind(this.redisClient);
    return promiseData(key, exp, value);
  }

  async del(key) {
    const promiseData = promisify(this.redisClient.del).bind(this.redisClient);
    return promiseData(key);
  }
}
const redisClient = new RedisClient();
module.exports = redisClient;
