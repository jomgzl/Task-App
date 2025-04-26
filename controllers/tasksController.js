const dbConnection = require("../config/db");
const task = require("../models/task");

exports.getTasks = async (req, res, next) => {
	try {
		const tasks = await task.findAll();
		const formattedRows = tasks.map((task) => {
			return {
				...task,
				created_at: new Date(task.created_at).toLocaleDateString(),
				updated_at: new Date(task.updated_at).toLocaleDateString(),
				due_date: new Date(task.due_date).toLocaleDateString(),
			};
		});
		res.render("tasks", { tasks: formattedRows });
	} catch (err) {
		next(err);
	}
};

exports.getTask = async (req, res, next) => {
	try {
		const id = req.params.id;
		const tasks = await task.findTask(id);
		const formattedTask = [
			{
				...tasks,
				due_date: new Date(tasks.due_date).toLocaleDateString(),
			},
		];
		res.render("task", { task: formattedTask });
	} catch (err) {
		next(err);
	}
};

exports.renderAddTaskPage = (req, res) => {
	res.render("add-task");
};

exports.createTask = async (req, res, next) => {
	try {
		const title = String(req.body.title);
		const status = String(req.body.status);
		const description = String(req.body.description);
		const dueDate = String(req.body.due_date);

		const id = await task.create({ title, status, description, dueDate });

		res.redirect(`/api/tasks/${id}`);
	} catch (err) {
		next(err);
	}
};
exports.renderUpdatePage = (req, res, next) => {
	try {
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
	} catch (err) {
		next(err);
	}
};

exports.updateTask = async (req, res, next) => {
	try {
		const id = Number(req.params.id);
		const title = String(req.body.title);
		const status = String(req.body.status);
		const description = String(req.body.description);
		const dueDate = String(req.body.due_date);

		const tasks = await task.modify({
			id,
			title,
			status,
			description,
			dueDate,
		});

		res.status(201).json({
			message: "Task updated successfully",
		});
	} catch (err) {
		next(err);
	}
};

exports.deleteTask = async (req, res, next) => {
	try {
		const id = Number(req.params.id);
		
		const tasks = task.delete(id);

		res.status(200).json({
			message: "Item deleted successfully",
		});
	} catch (err) {
		next(err);
	}
};
