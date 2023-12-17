import sha1 from 'sha1';

import dbClient from '../utils/db';

import redisClient from '../utils/redis';

const { ObjectId } = require('mongodb');

class FilesController {
  static async postUpload(request, response) {
    const token = request.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (userId) {
      const user = await dbClient.findUser({ _id: ObjectId(userId) });
      const { name, type, data } = request.body;
      const arr = [name, type, data];
      console.log(arr);
      return response.json({ status: 'okay' });
    }
    return response.status(401).json({ error: 'Unauthorized' });
  }
}
module.exports = FilesController;
