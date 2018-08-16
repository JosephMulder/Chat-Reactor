var mysql = require('mysql');
var dbURL = process.env.CLEARDB_DATABASE_URL || {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'chat'
}

var db = mysql.createPool(dbURL);

module.exports = db;

