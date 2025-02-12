const express = require("express");
const app = express();

const usersRoutes = require("./routes/usersRouter");
const tasksRoutes = require("./routes/tasksRouter");
const aboutRoute = require("./routes/aboutRouter");

const bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("views"));
app.use(express.static("public"));

app.use("/user", usersRoutes);
app.use("/api", tasksRoutes);
app.use("/", aboutRoute);

const port = 3000;

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

module.exports = app;

// Saving on file:

// const fs = require("fs");

// let toDo = [];

// const writeToFile = (toDos) => {
// 	const tasks = JSON.stringify(toDos);

// 	fs.writeFile("tasks.json", tasks, (err) => {
// 		if (err) throw err;
// 		console.log("Data added or deleted");
// 	});
// };

// fs.readFile("tasks.json", (err, jsonData) => {
// 	if (err) throw err;
// 	if (jsonData.length > 0) {
// 		data = JSON.parse(jsonData);
// 		console.log(data);
// 		toDo = data;
// 	}
// });

// app.get("/todo-list", (req, res) => {
// 	res.status(200).json(toDo);
// });

// app.post("/todo-list", (req, res) => {
// 	const title = String(req.body.title);
// 	const status = String(req.body.status);

// 	if (title.trim().length === 0) {
// 		return res
// 			.status(400)
// 			.json({ error: "Title must be at least 3 characters" });
// 	}
// 	if (status.trim().length === 0) {
// 		return res
// 			.status(400)
// 			.json({ error: "Status must be at least 3 characters" });
// 	} else if (
// 		status.toLowerCase() !== "To Do".toLowerCase() &&
// 		status.toLowerCase() !== "Ongoing".toLowerCase() &&
// 		status.toLowerCase() !== "Done".toLowerCase()
// 	) {
// 		return res.status(400).json({
// 			error: "Status must be To do, or Ongoing or Done",
// 		});
// 	}

// 	const newToDo = {
// 		id: toDo.length + 1,
// 		title: title,
// 		status: status,
// 	};

// 	toDo.push(newToDo);
// 	res.status(201).json(newToDo);

// 	writeToFile(toDo);
// });

// app.delete("/todo-list/:id", (req, res) => {
// 	const id = Number(req.params.id);

// 	const itemIndex = toDo.findIndex((toDoTask) => toDoTask.id === id);

// 	if (itemIndex === -1) {
// 		return res.status(400).json({
// 			error: "Task doesn't exist",
// 			description: `There are currently ${toDo.length} tasks`,
// 		});
// 	}

// 	toDo.splice(itemIndex, 1);

// 	for (let i = itemIndex; i < toDo.length; i++) {
// 		toDo[i].id = toDo[i].id - 1;
// 	}

// 	res.status(200).send();

// 	writeToFile(toDo);
// });

// app.put("/todo-list/:id", (req, res) => {
// 	const id = Number(req.params.id);
// 	const title = String(req.body.title);
// 	const status = String(req.body.status);

// 	const item = toDo.find((task) => task.id === id);

// 	item.title = title || item.title;
// 	item.status = status || item.status;

// 	res.status(200).send();

// 	writeToFile(toDo);
// });
