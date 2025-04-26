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

module.exports = {
	ensureTitle,
	ensureStatus,
};
