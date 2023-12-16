import dbClient from '../utils/db';

const crypto = require('crypto');

class UsersController {
    static async postNew(request, response) {
        const { email, password } = request.body;
        if (!email) return response.status(400).json({ error: 'Missing email' });
        if (!password) return response.status(400).json({ error: 'Missing password' });
        const user = await dbClient.findUser({ email });
	if (user) return response.status(400).json({ error: 'Already exist' });
        const hashPass = crypto.createHash('sha1').update(password).digest('hex');
        const newUser = await dbClient.addUser(email, hashPass);
        return response.status(200).json({ id: newUser._id, email: newUser.email });
  }
}
module.exports = UsersController;
