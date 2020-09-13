import { Request, Response } from "express";
import { SignupInputDTO, LoginInputDTO } from "../model/User";
import { UserBusiness } from "../business/UserBusiness";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { LoginBusiness } from "../business/LoginBusiness";
import { SignupBusiness } from "../business/SignupBusiness";

export class UserController {
  async signup(req: Request, res: Response) {
    console.log("UserController: signup");
    try {
      const signupData: SignupInputDTO = req.body;

      const signupBusiness = new SignupBusiness(
        new Authenticator(),
        new HashManager(),
        new IdGenerator(),
        new UserDatabase()
      );
      const nicknameAndToken = await signupBusiness.execute(signupData);

      res.status(200).send(nicknameAndToken);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const loginData: LoginInputDTO = req.body;

      const loginBusiness = new LoginBusiness(
        new Authenticator(),
        new HashManager(),
        new UserDatabase()
      );
      const nicknameAndToken = await loginBusiness.execute(loginData);

      res.status(200).send(nicknameAndToken);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  async getUserInfoByNickname(req: Request, res: Response) {
    try {
      const userBusiness = new UserBusiness(
        new Authenticator(),
        new UserDatabase()
      );

      const user = await userBusiness.getUserInfoByNickname(
        req.params.nickname as string
      );
      res.status(200).send({ user });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  async follow(req: Request, res: Response) {
    try {
      const userBusiness = new UserBusiness(
        new Authenticator(),
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
  }

  async unfollow(req: Request, res: Response) {
    try {
      const userBusiness = new UserBusiness(
        new Authenticator(),
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
  }
}
