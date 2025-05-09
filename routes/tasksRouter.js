const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");
const { ensureTitle, ensureStatus } = require("../middleware/validateTask");
const { ensureTaskExists } = require("../middleware/taskExists");

router.route("/tasks/new").get(tasksController.renderAddTaskPage);
router.route("/tasks/edit/:id").get(tasksController.renderUpdatePage);

router
	.route("/tasks")
	.get(tasksController.getTasks)
	.post(ensureTitle, ensureStatus, tasksController.createTask);

router
	.route("/tasks/:id")
	.get(ensureTaskExists, tasksController.getTask)
	.put(ensureTitle, ensureStatus, tasksController.updateTask)
	.delete(tasksController.deleteTask);

module.exports = router;
