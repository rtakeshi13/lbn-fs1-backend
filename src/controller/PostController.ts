import { Request, Response } from "express";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/Authenticator";
import { PostInputDTO } from "../model/Post";
import { PostDatabase } from "../data/PostDatabase";
import { PostBusiness } from "../business/PostBusiness";

export class PostController {
  async createPost(req: Request, res: Response) {
    console.log("PostController");
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
      res.status(400).send({ error });
    }
  }

  async getPostsByUserId(req: Request, res: Response) {
    try {
      const postBusiness = new PostBusiness(
        new Authenticator(),
        new IdGenerator(),
        new PostDatabase()
      );
      const userId = req.query.userId as string;
      const posts = await postBusiness.getPostsByUserId(
        userId,
        Number(req.query.page)
      );

      res.status(200).send({ posts });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
}
