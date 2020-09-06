const routes = require("express").Router();

const authMiddleware = require("./app/middlewares/auth");

const UserController = require("./app/controllers/UserController");

routes.post("/users", UserController.store);

// routes.use(authMiddleware);

module.exports = routes;
