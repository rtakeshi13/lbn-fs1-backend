import { PostInputDTO } from "../model/Post";
import { PostDatabase } from "../data/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/Authenticator";
import { Validator } from "../services/Validator";

export class PostBusiness {
  constructor(
    private authenticator: Authenticator,
    private idGenerator: IdGenerator,
    private postDatabase: PostDatabase
  ) {}
  async createPost(token: string, postData: PostInputDTO) {
    if (!Validator.validateDto(postData, new PostInputDTO())) {
      console.log("bad");
    }

    const userId = this.authenticator.getData(token).id;
    const postId = this.idGenerator.generate();

    await this.postDatabase.createPost(postId, userId, postData);
  }
  async getPostsByUserId(userId: string) {
    return this.postDatabase.getPostsByUserId(userId);
  }
}
