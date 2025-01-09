const express = require("express");
const app = express();

const fs = require("fs");

app.use(express.json());

let toDo = [];

fs.readFile("tasks.json", (err, jsonData) => {
	if (err) throw err;
	data = JSON.parse(jsonData);
	console.log(data);
	toDo = data;
});

app.get("/todo-list", (req, res) => {
	res.status(200).json(toDo);
});

app.post("/todo-list", (req, res) => {
	const title = String(req.body.title);
	const status = String(req.body.status);

	if (title.trim().length === 0) {
		return res
			.status(400)
			.json({ error: "Title must be at least 3 characters" });
	}
	if (status.trim().length === 0) {
		return res
			.status(400)
			.json({ error: "Status must be at least 3 characters" });
	} else if (status.toLowerCase() !== "To Do".toLowerCase() && status.toLowerCase() !== "Ongoing".toLowerCase() && status.toLowerCase() !== "Done".toLowerCase()) {
		return res.status(400).json({
			error: "Status must be To do, or Ongoing or Done",
		});
	}

	const newToDo = {
		id: toDo.length + 1,
		title: title,
		status: status,
	};

	toDo.push(newToDo);
	res.status(201).json(newToDo);

	const tasks = JSON.stringify(toDo);

	fs.writeFile("tasks.json", tasks, (err) => {
		if (err) throw err;
		console.log("Data added");
	});
});

app.delete("/todo-list/:id", (req, res) => {
	const id = Number(req.params.id);

	const itemIndex = toDo.findIndex((toDoTask) => toDoTask.id === id);
	console.log(itemIndex);
	console.log(toDo.splice(itemIndex + 1, 1));

	toDo.splice(itemIndex + 1, 1);
	console.log("This task was deleted:", toDo.splice(itemIndex + 1, 1));
	res.status(200).send();
});

const port = 3000;

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
