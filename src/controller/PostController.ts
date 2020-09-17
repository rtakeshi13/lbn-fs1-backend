import { Request, Response } from "express";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/Authenticator";
import { PostInputDTO } from "../model/Post";
import { PostDatabase } from "../data/PostDatabase";
import { PostBusiness } from "../business/PostBusiness";
import { CollectionInputDTO } from "../model/Collection";

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
      res.status(400).send({ sucess: false, message: error.message });
    }
  }

  async getPostsByUserId(req: Request, res: Response) {
    try {
      const postBusiness = new PostBusiness(
        new Authenticator(),
        new IdGenerator(),
        new PostDatabase()
      );

      const posts = await postBusiness.getPostsByUserId(
        req.headers.authorization as string,
        req.query.userId as string,
        Number(req.query.page)
      );

      res.status(200).send({ sucess: true, posts });
    } catch (error) {
      res.status(400).send({ sucess: false, message: error.message });
    }
  }

  async getPostsByTag(req: Request, res: Response) {
    try {
      const postBusiness = new PostBusiness(
        new Authenticator(),
        new IdGenerator(),
        new PostDatabase()
      );

      const posts = await postBusiness.getPostsByTag(
        req.headers.authorization as string,
        req.query.tag as string,
        Number(req.query.page)
      );

      res.status(200).send({ sucess: true, posts });
    } catch (error) {
      res.status(400).send({ sucess: false, message: error.message });
    }
  }

  async createColletion(req: Request, res: Response) {
    try {
      const postBusiness = new PostBusiness(
        new Authenticator(),
        new IdGenerator(),
        new PostDatabase()
      );
      const collectionData: CollectionInputDTO = req.body;

      await postBusiness.createCollection(
        req.headers.authorization as string,
        collectionData
      );

      res.status(200).send({ sucess: true });
    } catch (error) {
      res.status(400).send({ sucess: false, message: error.message });
    }
  }

  async getCollectionsByUserId(req: Request, res: Response) {
    try {
      const postBusiness = new PostBusiness(
        new Authenticator(),
        new IdGenerator(),
        new PostDatabase()
      );

      const collections = await postBusiness.getCollectionsByUserId(
        req.headers.authorization as string
      );

      res.status(200).send({ sucess: true, collections });
    } catch (error) {
      res.status(400).send({ sucess: false, message: error.message });
    }
  }
}
