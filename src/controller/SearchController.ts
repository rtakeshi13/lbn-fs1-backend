import { Request, Response } from "express";
import { SearchBusiness } from "../business/SearchBusiness";
import { Authenticator } from "../services/Authenticator";
import { UserDatabase } from "../data/UserDatabase";
import { PostDatabase } from "../data/PostDatabase";

export class SearchController {
  async search(req: Request, res: Response) {
    try {
      const input = req.query.q as string;
      const searchBusiness = new SearchBusiness(
        new Authenticator(),
        new UserDatabase(),
        new PostDatabase()
      );

      const result = await searchBusiness.execute(
        req.headers.authorization as string,
        input
      );

      res.status(200).send({ sucess: true, result });
    } catch (error) {
      res.status(400).send({ error });
    }
  }
}
