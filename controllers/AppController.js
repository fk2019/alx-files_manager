import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(request, response) {
    if (redisClient.isAlive() && dbClient.isAlive()) {
      const data = {
        redis: true,
        db: true,
      };
      response.status(200).json(data);
    }
  }
}
module.exports = AppController;
