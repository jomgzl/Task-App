const express = require("express");
const app = express();

app.use(express.json());

const toDo = [
	{ id: 1, title: "Grocery shopping", status: "Done" },
	{ id: 2, title: "Tidying room", status: "Ongoing" },
];

app.get("/todo-list", (req, res) => {
	res.status(200).json(toDo);
});

app.post("/todo-list", (req, res) => {
	const title = String(req.body.title);
	const status = String(req.body.status);

	console.log('Headers', req.headers);
	console.log('Body', req.body);

	const newToDo = {
		id: toDo.length + 1,
		title: title,
		status: status,
	};

	toDo.push(newToDo);
	res.status(201).json(newToDo);
});

app.delete("/todo-list/:id", (req, res) => {
	const id = Number(req.params.id);

	const itemIndex = toDo.findIndex((toDoTask) => toDoTask.id === id);

	toDo.splice(itemIndex, 1);
	res.status(200).send();
})

const port = 3000;

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
