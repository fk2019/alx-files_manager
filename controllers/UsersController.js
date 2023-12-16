import sha1 from 'sha1';

import dbClient from '../utils/db';

import redisClient from '../utils/redis';

const { ObjectId } = require('mongodb');

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;
    if (!email) return response.status(400).json({ error: 'Missing email' });
    if (!password) return response.status(400).json({ error: 'Missing password' });
    const user = await dbClient.findUser({ email });
    if (user) return response.status(400).json({ error: 'Already exist' });
    const newUser = await dbClient.addUser(email, sha1(password));
    return response.status(200).json({ id: newUser._id, email: newUser.email });
  }

  static async getMe(request, response) {
    const token = request.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (userId) {
      const user = await dbClient.findUser({ _id: ObjectId(userId) });
      console.log(user._id, user.email);
      return response.status(200).json({ id: user._id, email: user.email });
    }
    return response.status(401).json({ error: 'Unauthorized' });
  }
}
module.exports = UsersController;
