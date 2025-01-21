const mysql = require("mysql2");

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "iZu__T}&9z6Nc,&+OT}]",
	database: "tasks",
});

module.exports = connection;