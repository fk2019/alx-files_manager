import redisClient from './utils/redis';
import dbClient from './utils/db';

class AppController {
    static getStatus(req, res) {
	let data = {};
	res.status(200).message();
    }

    static getStats() {
    }
}
