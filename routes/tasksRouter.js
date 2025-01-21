const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");

router.get("/db/todo-list", tasksController.getTasks);
router.post("/db/todo-list/add", tasksController.createTask);