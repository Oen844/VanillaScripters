const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const { MONGO_URL } = process.env;

let _db;

mongoConnect = () => {
  MongoClient
    .connect(MONGO_URL)
    .then(client => {
      console.log("Successfully connected to database");
      _db = client.db();
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      throw error;
    });
};

getDb = () => {
  if(_db){
    return _db;
  }else{
    console.log("No database found!");
  }
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;