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
    console.log("PostBusiness");
    if (!Validator.validateDto(postData, new PostInputDTO())) {
      throw new Error("Invalid or missing parameters");
    }

    const userId = this.authenticator.getData(token).id;
    const postId = this.idGenerator.generate();

    await this.postDatabase.createPost(postId, userId, postData);
  }
  async getPostsByUserId(userId: string, page: number) {
    return this.postDatabase.getPostsByUserId(userId, page);
  }
}
