const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.get("/db/authPage", usersController.renderLoginPage);
router.post("/db/sign-up", usersController.signUp);

module.exports = router;
