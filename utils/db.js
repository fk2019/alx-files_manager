const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || '127.0.0.1';
    const port = process.env.DB_PORT || 27017;
    const db = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}/${db}`;
    this.mongoClient = new MongoClient(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
    this.mongoClient.connect()
      .then(() => {
        this.database = this.mongoClient.db(db);
      }).catch((er) => console.log('Error', er));
  }

  isAlive() {
    return this.mongoClient.isConnected();
  }

  async nbUsers() {
    return this.database.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.database.collection('files').countDocuments();
  }

  async findUser(u) {
    return this.database.collection('users').findOne(u);
  }
    
    async addUser(email, password) {
	await this.database.collection('users').insertOne({ email, password });
	return this.database.collection('users').findOne({ email });
    }
	
    async findFile(f) {
	return this.database.collection('files').findOne(f);
    }
    
    async addFile(file) {
	return  await this.database.collection('files').insertOne(file);
    }
}

const dbClient = new DBClient();
module.exports = dbClient;
