import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/Authenticator";
import { PostInputDTO } from "../model/Post";
import { PostDatabase } from "../data/PostDatabase";
import { PostBusiness } from "../business/PostBusiness";

export class PostController {
  async createPost(req: Request, res: Response) {
    try {
      const postData: PostInputDTO = req.body;

      const postBusiness = new PostBusiness(
        new Authenticator(),
        new IdGenerator(),
        new PostDatabase()
      );
      await postBusiness.createPost(
        req.headers.authorization as string,
        postData
      );

      res.status(200).send({ sucess: true });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }

    await BaseDatabase.destroyConnection();
  }
}
