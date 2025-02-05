const userEntryValidation = (username, password, res) => {
	if (username.length === 0 || password.length === 0) {
		res.status(400).json({ message: "Username and password required" });
	}
};

exports.renderLoginPage = (req, res) => {
	res.render("login");
};

exports.signUp = (req, res) => {
	if (userEntryValidation) return 0;
	console.log(req.body.username);
	res.status(200).json({ message: "Authentication success" });
};
