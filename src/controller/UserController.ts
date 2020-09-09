import { Request, Response } from "express";
import { SignupInputDTO, LoginInputDTO } from "../model/User";
import { UserBusiness } from "../business/UserBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";

export class UserController {
  async signup(req: Request, res: Response) {
    try {
      const signupData: SignupInputDTO = req.body;

      const userBusiness = new UserBusiness(
        new Authenticator(),
        new HashManager(),
        new IdGenerator(),
        new UserDatabase()
      );
      const token = await userBusiness.createUser(signupData);

      res.status(200).send({ token });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  async login(req: Request, res: Response) {
    try {
      const loginData: LoginInputDTO = req.body;

      const userBusiness = new UserBusiness(
        new Authenticator(),
        new HashManager(),
        new IdGenerator(),
        new UserDatabase()
      );
      const token = await userBusiness.getUserByEmail(loginData);

      res.status(200).send({ token });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }

    await BaseDatabase.destroyConnection();
  }
  async getUserInfoByNickname(req: Request, res: Response) {
    try {
      const userBusiness = new UserBusiness(
        new Authenticator(),
        new HashManager(),
        new IdGenerator(),
        new UserDatabase()
      );

      const userInfo = await userBusiness.getUserInfoByNickname(
        req.params.nickname as string
      );
      res.status(200).send({ userInfo });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  async follow(req: Request, res: Response) {
    try {
      const userBusiness = new UserBusiness(
        new Authenticator(),
        new HashManager(),
        new IdGenerator(),
        new UserDatabase()
      );
      await userBusiness.follow(
        req.headers.authorization as string,
        req.body.followId
      );
      res.status(200).send({ sucess: true });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  async unfollow(req: Request, res: Response) {
    try {
      const userBusiness = new UserBusiness(
        new Authenticator(),
        new HashManager(),
        new IdGenerator(),
        new UserDatabase()
      );
      await userBusiness.unfollow(
        req.headers.authorization as string,
        req.body.followId
      );
      res.status(200).send({ sucess: true });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }

    await BaseDatabase.destroyConnection();
  }
}
