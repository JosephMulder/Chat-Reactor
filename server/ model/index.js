let db = require('../../database/database.js');
let bcrypt = require('bcryptjs');
let bHash = require('../lib/util.js')

module.exports = {
  messages: {
    get: function(query, callback) {
      var strQuery = `Select * from messages where roomname="${query}"`;
      db.getConnection((err,connection)=>{
        if(err) return console.log(err)
        connection.query(strQuery, (err, result) => {
          connection.release();
          if (err) {
            callback(err);
          } else {
            callback(null, result);
          }
        });
      })
    },
    post: function(data, callback) {
      var strQuery = `INSERT INTO messages (roomId, userId, username, text, score, roomname)
      VALUES (${data.roomId}, ${data.userId}, "${data.username}", "${data.text}", ${data.score}, "${data.roomname}")`
      db.getConnection((err,connection)=>{
        if(err) return console.log(err)
        connection.query(strQuery, (err, result) => {
          connection.release();
          if (err) {
            callback(err);
          } else {
            var updateQuery = `UPDATE users u SET u.totalscore = u.totalscore + ${data.score} WHERE u.id = ${data.userId}`
            db.query(updateQuery,(err2,result2)=>{
              if(err) callback(err)
              else callback(null, result);
            })
          }
        });
      })
    }
  },

  users: {
    get: function(input, callback) {
      let {username,password} = input;
      let queryStr = `SELECT * FROM users u WHERE u.username = "${username}"`
      db.getConnection((err,connection)=>{
        if(err) return console.log(err)
        connection.query(queryStr,(err, result) => {
          connection.release();
          if (!result.length) {
            callback("No username found");
          } else {
            bcrypt.compare(password,result[0].password,(err, matched)=>{
              if (!matched) callback("Wrong password")
              else{
                let {id,username,totalscore}= result[0]
                callback(null, {id,username,totalscore});
              }
            })
          }
        })
      })
    }, 
    post: function(input, callback) {
      bHash(input.password,(err,result)=>{ // hash password before storing
        if(err) return console.log(err)
        let params = [input.username,result]
        let queryStr = `INSERT INTO users VALUES (default,?,?,0)`
        db.getConnection((err,connection)=>{
          if(err) return console.log(err)
          connection.query(queryStr, params,(err, result) => {
            connection.release();
            if (err) {
              callback(err);
            } else {
              let user = {
                id: result.insertId,
                username: input.username,
                totalscore: 0
              }
              callback(null, user);
            }
          })
        })
      })
    }
  }, 
  
  rooms: {
    get: function(callback) {
      db.getConnection((err,connection)=>{
        if(err) return console.log(err)
        connection.query("SELECT roomname FROM rooms", (err, result) => {
          connection.release();
          if (err) {
            callback(err);
          } else {
            callback(null, result);
          }
        })
      })
      
    },
    post: function(input, callback) {
      db.getConnection((err,connection)=>{
        if(err) return console.log(err)
        connection.query(`INSERT INTO rooms (roomname, users_id, roomscore) VALUES ("${input.roomname}", ${input.users_id}, ${input.roomscore})`, (err, result) => {
          connection.release();
          if (err) {
            callback(err);
          } else {
            callback(result);
          }
        })
      })
    }
  }  
};
