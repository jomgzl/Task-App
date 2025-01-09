const express = require("express");
const app = express();

app.use(express.json());

const toDo = [
	{ id: 1, title: "Grocery shopping", status: "Done" },
	{ id: 2, title: "Tidying room", status: "Ongoing" },
];

const fs = require("fs");
const tasks = JSON.stringify(toDo);

app.get("/todo-list", (req, res) => {
	res.status(200).json(toDo);
});

app.post("/todo-list", (req, res) => {
	const title = String(req.body.title);
	const status = String(req.body.status);

	const newToDo = {
		id: toDo.length + 1,
		title: title,
		status: status,
	};

	toDo.push(newToDo);
	res.status(201).json(newToDo);

	fs.writeFile("tasks.json", toDo, (err) => {
		if (err) throw err;
		console.log("Data added");
	});
});

app.delete("/todo-list/:id", (req, res) => {
	const id = Number(req.params.id);

	const itemIndex = toDo.findIndex((toDoTask) => toDoTask.id === id);

	toDo.splice(itemIndex, 1);
	res.status(200).send();
});

const port = 3000;

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

// const fs = require("fs");
// const tasks = JSON.stringify(toDo);
// fs.writeFile("tasks.json", tasks, (err) => {
// 	if (err) throw err;
// 	console.log("File saved");
// });
