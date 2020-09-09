import { Request, Response } from "express";
import { UserInputDTO, LoginInputDTO } from "../model/User";
import { UserBusiness } from "../business/UserBusiness";
import { BaseDatabase } from "../data/BaseDatabase";

export class UserController {
  async signup(req: Request, res: Response) {
    try {
      const input: UserInputDTO = req.body;

      const userBusiness = new UserBusiness();
      const token = await userBusiness.createUser(input);

      res.status(200).send({ token });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  async login(req: Request, res: Response) {
    try {
      const loginData: LoginInputDTO = req.body;

      const userBusiness = new UserBusiness();
      const token = await userBusiness.getUserByEmail(loginData);

      res.status(200).send({ token });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }

    await BaseDatabase.destroyConnection();
  }
  async getUserInfoByNickname(req: Request, res: Response) {
    try {
      const userBusiness = new UserBusiness();

      const userInfo = await userBusiness.getUserInfoByNickname(
        req.params.nickname as string
      );
      res.status(200).send({ userInfo });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }

    await BaseDatabase.destroyConnection();
  }
}
