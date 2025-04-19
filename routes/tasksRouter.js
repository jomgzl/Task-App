const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");

router
	.route("/tasks")
	.get(tasksController.getTasks)
	.post(tasksController.createTask);
	
router
	.route("/tasks/:id")
	.get(tasksController.getTask)
	.put(tasksController.updateTask)
	.delete(tasksController.deleteTask);

router.route("/tasks/new").get(tasksController.renderAddTaskPage);
router.route("/tasks/edit/:id").get(tasksController.renderUpdatePage);

module.exports = router;
