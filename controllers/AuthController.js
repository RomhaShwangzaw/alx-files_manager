import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import mongoDBCore from 'mongodb/lib/core';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    const base64AuthString = authHeader.split(' ')[1];
    const buff = Buffer.from(base64AuthString, 'base64');
    const decodedAuthString = buff.toString();
    const [email, password] = decodedAuthString.split(':');

    const user = await dbClient.getUser({ email });
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (sha1(password) !== user.password) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const token = uuidv4();
    const key = `auth_${token}`;
    await redisClient.set(key, user._id.toString(), 24 * 60 * 60);
    res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (await !dbClient.existsUser({ _id: new mongoDBCore.BSON.ObjectId(userId) })) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await redisClient.del(key);
    res.status(204).json({});
  }
}

export default AuthController;
