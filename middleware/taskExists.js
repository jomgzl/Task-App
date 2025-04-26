const dbConnection = require("../config/db");

const ensureTaskExists = (req, res, next) => {
	const id = req.params.id;
	const idSearchQuery = "SELECT * FROM tasks WHERE id = ? ";

	dbConnection.query(idSearchQuery, id, (err, result, fields) => {
		if (result.length === 0) {
			return res.status(400).json({
				error: "Task doesn't exist",
				description: "Please choose a smaller ID",
			});
		}
		next();
	});
};

module.exports = {
	ensureTaskExists,
};
