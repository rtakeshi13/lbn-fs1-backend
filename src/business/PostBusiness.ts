import { PostInputDTO } from "../model/Post";
import { PostDatabase } from "../data/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/Authenticator";
import { DateFormatter } from "../services/DateFormatter";

export class PostBusiness {
  constructor(
    private authenticator: Authenticator,
    private idGenerator: IdGenerator,
    private postDatabase: PostDatabase
  ) {}
  async createPost(token: string, postData: PostInputDTO) {
    const userId = this.authenticator.getData(token).id;
    const postId = this.idGenerator.generate();

    await this.postDatabase.createPost(postId, userId, postData);
  }
}
