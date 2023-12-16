import sha1 from 'sha1';

import { v4 as uuid4 } from 'uuid';

import dbClient from '../utils/db';

import redisClient from '../utils/redis';


class AuthController {
  static async getConnect(request, response) {
    const b64Header = request.headers.authorization.split(' ')[1];
    const args = Buffer.from(b64Header, 'base64').toString();
    const email = args.split(':')[0];
    const pass = args.split(':')[1];
    const user = await dbClient.findUser({ email });
    if (user) {
      if (sha1(pass) === user.password) {
        const uuid = uuid4();
        await redisClient.set(`auth_${uuid}`, user._id.toString(), 24 * 60 * 60);
        return response.status(200).json({ token: uuid });
      }
    }
    return response.status(401).json({ error: 'Unauthorized' });
  }

  static async getDisconnect(request, response) {
    const token = request.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (userId) {
      redisClient.del(`auth_${token}`);
      return response.status(204).send('');
    }
    return response.status(401).json({ error: 'Unautorized' });
  }
}
module.exports = AuthController;
