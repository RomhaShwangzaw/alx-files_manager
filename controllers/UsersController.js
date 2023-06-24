import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }
    const user = await dbClient.getUser({ email });
    if (user) {
      res.status(400).json({ error: 'Already exist' });
      return;
    }
    const insertionInfo = await dbClient.saveUser({ email, password: sha1(password) });
    const userId = insertionInfo.insertedId.toString();
    res.status(201).json({ id: userId, email });
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;
    const _id = await redisClient.get(key);
    if (await !dbClient.existsUser({ _id })) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const user = await dbClient.getUser({ _id });
    res.status(200).json({ id: _id, email: user.email });
  }
}

export default UsersController;
