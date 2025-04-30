const dbConnection = require("../config/db");
const Task = require("../models/task");

exports.getTasks = async (req, res, next) => {
	try {
		const tasks = await Task.findAll();
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
		const tasks = await Task.findById(id);
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
		const due_date = String(req.body.due_date);

		const id = await Task.create({ title, status, description, due_date });

		res.status(201).json({
			id: id,
			message: "Task created successfully",
		});
	} catch (err) {
		next(err);
	}
};
exports.renderUpdatePage = async (req, res, next) => {
	try {
		const id = Number(req.params.id);
		const tasks = await Task.findById(id);
		const formattedResult = {
			...tasks,
			due_date: tasks.due_date.toLocaleDateString("en-CA"),
		};

		res.render("modify-task", { task: formattedResult });
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
		const due_date = String(req.body.due_date);

		const tasks = await Task.modify({
			id,
			title,
			status,
			description,
			due_date,
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

		const tasks = Task.delete(id);

		res.status(200).json({
			message: "Item deleted successfully",
		});
	} catch (err) {
		next(err);
	}
};
