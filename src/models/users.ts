import users from "../database/users.json";
import { writeFile } from "jsonfile";
import crypto from "node:crypto";
import { dirname } from "../database";

abstract class UserModel {
  // Como realizamos las tareas de buscar un usuario y de guardar en la base de datos varias veces, separamos la lógica en métodos privados aparte. Privados para que sólo sean accesibles dentro del contexto de esta clase UserModel y no desde el exterior, ya que no es necesario.

  private static findUser(username: string) {
    return users.find((user) => user.username === username);
  }

  private static async writeDB() {
    return writeFile(dirname + "/users.json", users);
  }

  static async checkToken(token: string) {
    return users.find((user) => user.token === token);
  }

  static async getAllUsers() {
    return users;
  }

  static async createUser(userData: any) {
    const { username, mail, hashPassword } = userData;

    const newUser = { username, mail, password: hashPassword, token: "" };

    const user = this.findUser(username);

    if (user) return 409;

    users.push(newUser);

    await this.writeDB();

    return newUser.username;
  }

  static async login(userData: any) {
    const { username, password } = userData;

    const userFound = this.findUser(username);

    if (!userFound) return 404;

    const hashPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (userFound.password !== hashPassword) return 400;

    const token = crypto.randomUUID();

    userFound.token = token;
    await this.writeDB();

    return token;
  }

  static async logout(userData: any) {
    const { username } = userData;
    const user = this.findUser(username);

    if (!user) return 400;

    user.token = "";

    // Llama al método writeDB para guardar los cambios en la base de datos
    await this.writeDB();

    return 200;
  }
}

export { UserModel };
