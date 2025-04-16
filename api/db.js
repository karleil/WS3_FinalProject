const mysql = require("mysql2"); //we use mysql for the server

const db = mysql.createConnection({ //this is used to use the details of the server to connect to it.
    user: "root",
    password: 'root',
    database: "guitarStore",
    host: "localhost",
    port: "8889"
});

db.connect( (error) => { //error handling if the user can't connect and handles if the user does connect.

    if(error) {
      console.log("Error connecting to database" , error);
      return;
    }
  
    console.log("Database connected");
  
  });
module.exports = db;