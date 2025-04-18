const dbConnection = require("../config/db");

const createTaskValidator = (title, status, res) => {
	if (title.trim().length === 0) {
		return res
			.status(400)
			.json({ error: "Title must be at least 3 characters" });
	}
	if (status.trim().length === 0) {
		return res
			.status(400)
			.json({ error: "Status must be at least 3 characters" });
	} else if (
		status.toLowerCase() !== "To Do".toLowerCase() &&
		status.toLowerCase() !== "Ongoing".toLowerCase() &&
		status.toLowerCase() !== "Done".toLowerCase()
	) {
		return res.status(400).json({
			error: "Status must be To do, or Ongoing or Done",
		});
	}
};

const updateTaskValidator = (status, res) => {
	if (
		status.toLowerCase() !== "To Do".toLowerCase() &&
		status.toLowerCase() !== "Ongoing".toLowerCase() &&
		status.toLowerCase() !== "Done".toLowerCase()
	) {
		return res.status(400).json({
			error: "Status must be To do, or Ongoing or Done",
		});
	}
};

const taskDoesNotExist = (id, res, doesNotExist) => {
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

exports.getTasks = (req, res) => {
	const selectTableQuery = "SELECT * FROM tasks";
	dbConnection.query(selectTableQuery, (err, rows, fields) => {
		if (err) throw err;
		console.log("The table is: ", rows);

		const formattedRows = rows.map((task) => {
			return {
				...task,
				created_at: new Date(task.created_at).toLocaleDateString(),
				updated_at: new Date(task.updated_at).toLocaleDateString(),
				due_date: new Date(task.due_date).toLocaleDateString(),
			};
		});

		res.render("tasks", { tasks: formattedRows });
		// res.status(200).json(rows);
	});
};

exports.getTask = (req, res) => {
	const id = req.params.id;
	taskDoesNotExist(id, res, (doesNotExist) => {
		if (doesNotExist) {
			return 0;
		} else {
			const selectTaskQuery = "SELECT * FROM tasks WHERE id = ?";
			dbConnection.query(selectTaskQuery, id, (err, task, fields) => {
				if (err) throw err;
				const formattedTask = [
					{
						...task[0],
						due_date: new Date(
							task[0].due_date
						).toLocaleDateString(),
					},
				];
				console.log("The task is: ", formattedTask);
				res.render("task", { task: formattedTask });
				// res.status(200).json(task);
			});
		}
	});
};

exports.renderAddTaskPage = (req, res) => {
	res.render("add-task");
};

exports.createTask = (req, res) => {
	const title = String(req.body.title);
	const status = String(req.body.status);
	const description = String(req.body.description);
	const dueDate = String(req.body.due_date);

	if (createTaskValidator(title, status, res)) return 0;
	else {
		const selectlastId = "SELECT id FROM tasks ORDER BY id DESC LIMIT 1";
		const postQuery =
			"INSERT INTO tasks (id, title, status, description, due_date) VALUES (?, ?, ?, ?, ?)";
		let data = [];

		dbConnection.query(selectlastId, (err, id, fields) => {
			if (err) throw err;
			id = id[0].id;
			data.push(id + 1, title, status, description, dueDate);

			dbConnection.query(postQuery, data, (err, taskAdded, fields) => {
				if (err) throw err;
				console.log("The following task was added: ", data);
				res.redirect(`/api/tasks/${id + 1}`);
				// res.status(201).json({ Message: "Task added successfully" });
			});
		});
	}
};
exports.renderUpdatePage = (req, res) => {
	const id = Number(req.params.id);

	const idSearchQuery = "SELECT * FROM tasks WHERE id = ? ";

	dbConnection.query(idSearchQuery, id, (err, result, fields) => {
		if (err) throw err;
		let formattedResult;
		result[0].due_date
			? (formattedResult = [
					{
						...result[0],
						due_date: result[0].due_date
							.toISOString()
							.split("T")[0],
					},
			  ])
			: (formattedResult = result);

		console.log("This is the formatted task", formattedResult);
		res.render("modify-task", { task: formattedResult });
	});
};

exports.updateTask = (req, res) => {
	const id = Number(req.params.id);
	const title = String(req.body.title);
	const status = String(req.body.status);
	const description = String(req.body.description);
	const dueDate = String(req.body.due_date);

	if (updateTaskValidator(status, res)) return 0;
	else {
		const idSearchQuery = "SELECT * FROM tasks WHERE id = ? ";

		dbConnection.query(idSearchQuery, id, (err, result, fields) => {
			if (err) throw err;

			if (result.length === 0) {
				return res.status(400).json({
					error: "Task doesn't exist",
					description: "Please choose a smaller ID",
				});
			} else {
				const idFinal = result[0].id;
				const taskTitle = result[0].title;
				const taskStatus = result[0].status;
				const taskDescription = result[0].description;
				const taskDueDate = result[0].due_date;
				const data = [
					title || taskTitle,
					status || taskStatus,
					description || taskDescription,
					dueDate || taskDueDate,
					idFinal,
				];
				const updateIdsQuery =
					"UPDATE tasks SET title = ?, status = ?, description = ?, due_date = ? WHERE id = ?";

				dbConnection.query(
					updateIdsQuery,
					data,
					(err, result, fields) => {
						if (err) throw err;
						res.status(201).json({
							message: "Task updated successfully",
						});
					}
				);
			}
		});
	}
};

exports.deleteTask = (req, res) => {
	const id = Number(req.params.id);

	const idSearchQuery = "SELECT * FROM tasks WHERE id = ? ";

	dbConnection.query(idSearchQuery, id, (err, result, fields) => {
		if (err) throw err;

		if (result.length === 0) {
			return res.status(400).json({
				error: "Task doesn't exist",
				description: "Please choose a smaller ID",
			});
		} else {
			console.log("The id is: ", result[0].id);
			const idFinal = result[0].id;
			const deleteQuery = "DELETE FROM tasks WHERE id = ?";
			const updateIdsQuery = "UPDATE tasks SET id = id - 1 WHERE id > ?";

			dbConnection.query(deleteQuery, idFinal, (err, result, fields) => {
				if (err) throw err;
				dbConnection.query(
					updateIdsQuery,
					idFinal,
					(err, result, fields) => {
						if (err) throw err;
					}
				);
				res.status(200).json({ message: "Item deleted successfully" });
			});
		}
	});
};
