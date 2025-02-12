const dbConnection = require("../config/db");

const userEntryValidation = (email, password, res) => {
	if (email.length === 0 || password.length === 0) {
		res.status(400).json({ message: "Email and password required" });
	}
};

exports.renderLoginPage = (req, res) => {
	res.render("login");
};

exports.signUp = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	if (userEntryValidation(email, password)) {
		console.log("Entry Validation");
		return 0;
	} else {
		const userSearchQuery = "SELECT * FROM users WHERE email = ?";

		dbConnection.query(userSearchQuery, email, (err, result, fields) => {
			if (err) throw err;
			if (result.length > 0) {
				res.status(400).json({ message: "Email already exists" });
			} else {
				const data = [email, password];
				const addUserQuery =
					"INSERT INTO users (email, password) VALUES (?, ?)";

				dbConnection.query(
					addUserQuery,
					data,
					(err, result, fields) => {
						if (err) throw err;
						console.log("The following user was added: ", result);
						res.status(201).json({ message: "New user created" });
					}
				);
			}
		});
	}
};
