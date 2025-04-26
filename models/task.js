const db = require("../config/db").promise();

class Task {
	constructor({
		id,
		title,
		status = "Ongoing",
		description,
		created_at,
		updated_at,
		due_date,
	}) {
		this.id = id;
		this.title = title;
		this.status = status;
		this.description = description;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.due_date = due_date;
	}

	static async findAll() {
		const [rows] = await db.query("SELECT * FROM tasks");
		return rows.map((row) => new Task(row));
	}

	static async findTask(id) {
		const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
		return new Task(rows[0]);
	}

	static async create({ title, status, description, due_date = new Date() }) {
		let [id] = await db.query(
			"SELECT id FROM tasks ORDER BY id DESC LIMIT 1"
		);
		id = id[0].id;
		const data = [id + 1, title, status, description, due_date];

		const [rows] = await db.query(
			"INSERT INTO tasks (id, title, status, description, due_date) VALUES (?, ?, ?, ?, ?)",
			data
		);
		return id + 1;
	}

	static async modify({
		id,
		title,
		status,
		description,
		due_date = new Date(),
	}) {
		const [task] = await db.query("SELECT * FROM tasks WHERE id = ? ", [
			id,
		]);

		const data = [
			title || task[0].title,
			status || task[0].status,
			description || task[0].description,
			due_date || task[0].due_date,
			task[0].id,
		];
		const [rows] = await db.query(
			"UPDATE tasks SET title = ?, status = ?, description = ?, due_date = ? WHERE id = ?",
			data
		);
	}

	static async delete(id) {
		const [task] = await db.query("SELECT * FROM tasks WHERE id = ? ", [
			id,
		]);

		const [deleteTask] = await db.query(
			"DELETE FROM tasks WHERE id = ?",
			task[0].id
		);
		const [updateLastTask] = await db.query(
			"UPDATE tasks SET id = id - 1 WHERE id > ?",
			[task[0].id]
		);
	}
}

module.exports = Task;
