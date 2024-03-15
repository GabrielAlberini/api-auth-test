import { Request, Response } from "express";

import { UserModel } from "../models/users";
import { validatePartialUser, validateUser } from "../validators/users";

import crypto from "node:crypto";

abstract class UserController {
  public static getAllUsers = async (req: Request, res: Response) => {
    const data = await UserModel.getAllUsers();
    res.json(data);
  };

  public static createUser = async (req: Request, res: Response) => {
    const validate = validateUser(req.body);

    if (!validate.success) return res.status(400).json({ error: validate });

    const { username, mail, password } = req.body;

    const hashPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const response = await UserModel.createUser({
      username,
      mail,
      hashPassword,
    });

    if (response === 409)
      return res.status(409).json({ error: "Existing user..." });

    res
      .status(201)
      .json({ message: "User created successfully", username: response });
  };

  public static login = async (req: Request, res: Response) => {
    const validate = validatePartialUser(req.body);

    if (!validate.success)
      return res.status(400).json({ error: "Bad request..." });

    const userLogged = await UserModel.login(req.body);

    if (userLogged === 400)
      return res.status(400).json({ error: "Bad request..." });

    if (userLogged === 404)
      return res.status(400).json({ error: "Not found user..." });

    res
      .status(201)
      .json({ message: "User logged successufuly", token: userLogged });
  };
}

export { UserController };
