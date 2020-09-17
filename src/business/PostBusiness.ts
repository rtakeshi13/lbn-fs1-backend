import { PostInputDTO, PostOutputDTO } from "../model/Post";
import { PostDatabase } from "../data/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/Authenticator";
import { Validator } from "../services/Validator";
import { CollectionInputDTO } from "../model/Collection";

export class PostBusiness {
  constructor(
    private authenticator: Authenticator,
    private idGenerator: IdGenerator,
    private postDatabase: PostDatabase
  ) {}
  async createPost(token: string, postData: PostInputDTO): Promise<void> {
    Validator.validateDto(postData, new PostInputDTO());

    const userId = this.authenticator.getData(token).id;
    const postId = this.idGenerator.generate();

    await this.postDatabase.createPost(postId, userId, postData);
  }

  async getPostsByUserId(
    token: string,
    userId: string,
    page: number
  ): Promise<PostOutputDTO[]> {
    Validator.validateNatural(page);
    this.authenticator.getData(token);

    return this.postDatabase.getPostsByUserId(userId, page);
  }

  async createCollection(
    token: string,
    collectionData: CollectionInputDTO
  ): Promise<void> {
    const userId = this.authenticator.getData(token).id;
    const collectionId = this.idGenerator.generate();

    await this.postDatabase.createCollection(
      collectionId,
      userId,
      collectionData
    );
  }

  async getCollectionsByUserId(token: string) {
    const userId = this.authenticator.getData(token).id;
    return this.postDatabase.getCollectionByUserId(userId);
  }

  async getPostsByTag(token: string, tag: string, page: number) {
    Validator.validateString(tag);
    Validator.validateNatural(page);
    this.authenticator.getData(token);

    return this.postDatabase.getPostsByTag(tag, page);
  }

  async getFeed(token: string, page: number) {
    Validator.validateNatural(page);
    const userId = this.authenticator.getData(token).id;

    return this.postDatabase.getFeed(userId, page);
  }
}
