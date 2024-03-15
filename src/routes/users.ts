import { Router } from "express";

import { validateAuth } from "../middlewares/auth";

import { UserController } from "../controllers/users";

const usersRouter = Router();

usersRouter.get("/", validateAuth, UserController.getAllUsers);

usersRouter.post("/", UserController.createUser);
usersRouter.post("/login", UserController.login);

export default usersRouter;
