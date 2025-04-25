const VALID_STATUSES = ["To do", "Ongoing", "Done"];

const ensureTitle = (req, res, next) => {
	let title = String(req.body.title);
	if (title.trim().length < 3) {
		return res
			.status(400)
			.json({ error: "Title must be at least 3 characters" });
	}
	next();
};

const ensureStatus = (req, res, next) => {
	let status = req.body.status;

	const isValid = VALID_STATUSES.some(
		(validateStatus) =>
			validateStatus.toLocaleLowerCase() === status.toLowerCase()
	);

	if (status.trim().length < 3) {
		return res
			.status(400)
			.json({ error: "Status must be at least 3 characters" });
	} else if (!isValid) {
		return res.status(400).json({
			error: "Status must be: To do, Ongoing or Done",
		});
	}
	next();
};

const ensureTaskExists = (id, res, doesNotExist) => {
	const idSearchQuery = "SELECT * FROM tasks WHERE id = ? ";

	dbConnection.query(idSearchQuery, id, (err, result, fields) => {
		if (err) throw err;

		if (result.length === 0) {
			res.status(400).json({
				error: "Task doesn't exist",
				description: "Please choose a smaller ID",
			});
			doesNotExist(true);
		} else doesNotExist(false);
	});
};

module.exports = {
	ensureTitle,
	ensureStatus,
	ensureTaskExists,
};
