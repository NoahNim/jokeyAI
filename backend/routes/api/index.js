const router = require('express').Router();
const usersRouter = require("./users.js");
const jokesRouter = require("./jokes.js")

router.use("/users", usersRouter);
router.use("/jokes", jokesRouter)

module.exports = router;