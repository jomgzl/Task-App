const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");

router.get("/db/todo-list", tasksController.getTasks);
router.post("/db/todo-list/add", tasksController.createTask);
router.put("/db/todo-list/:id", tasksController.updateTask);
router.delete("/db/todo-list/:id", tasksController.deleteTask);

module.exports = router;