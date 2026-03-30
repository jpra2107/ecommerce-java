const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommercedb2",
  port: 3307
});

module.exports = pool;
