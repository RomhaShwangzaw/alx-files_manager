import { MongoClient } from 'mongodb';

/**
 * Represents a MongoDB client.
 */
class DBClient {
  /**
   * Creates a new DBClient instance.
   */
  constructor() {
    const HOST = process.env.DB_HOST || 'localhost';
    const PORT = process.env.DB_PORT || 27017;
    const DB = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${HOST}:${PORT}/${DB}`;

    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect();
  }

  /**
   * Checks if this client's connection to the MongoDB server is active.
   * @returns {boolean}
   */
  isAlive() {
    return this.client.isConnected();
  }

  /**
   * Retrieves the number of users in the database.
   * @returns {Promise<Number>}
   */
  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * Retrieves the number of files in the database.
   * @returns {Promise<Number>}
   */
  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  /**
   * Inserts a new user document in the `users` collection.
   * @params {obj} the fields to be inserted into the document.
   * @returns {Obj} info about the inserted document.
   */
  async saveUser(obj) {
    return this.client.db()
      .collection('users').insertOne(obj);
  }

  /**
   * Retrieves a record from the `users` collection.
   * @params {obj} the field/s used to search for the document.
   * @returns {User} the user document.
   */
  async getUser(obj) {
    return this.client.db()
      .collection('users')
      .findOne(obj);
  }
}

const dbClient = new DBClient();
export default dbClient;
