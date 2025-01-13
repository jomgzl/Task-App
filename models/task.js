class Task {
	constructor(id, title, status = "Ongoing") {
		this.id = id;
		this.title = title;
		this.status = status;
	}
}

module.exports = Task;