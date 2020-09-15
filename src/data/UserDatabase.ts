import { BaseDatabase } from "./BaseDatabase";
import { User, SignupInputDTO } from "../model/User";
import { PostDatabase } from "./PostDatabase";
import { Collection } from "../model/Collection";

export class UserDatabase extends BaseDatabase {
  private static USER_TABLE_NAME = "fs1_user";
  private static RELATION_TABLE_NAME = "fs1_user_relation";
  private static POST_TABLE_NAME = "fs1_post";
  private static COLLECTION_TABLE_NAME = "fs1_collection";

  public async createUser(
    id: string,
    hashPassword: string,
    signupData: SignupInputDTO
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id,
          name: signupData.name,
          nickname: signupData.nickname,
          email: signupData.email,
          password: hashPassword,
        })
        .into(UserDatabase.USER_TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getUserByEmailOrNickname(input: string): Promise<User> {
    const response = await this.getConnection()
      .select()
      .from(UserDatabase.USER_TABLE_NAME)
      .where({ email: input })
      .orWhere({ nickname: input });
    if (!response[0]) throw new Error("UserDatabase:getUserByEmailOrNickname");
    return User.toUserModel(response[0]);
  }

  public async getUserByNickname(nickname: string): Promise<any> {
    const knex = this.getConnection();

    const userFromDb = await knex
      .select(
        "u.id",
        "u.name",
        "u.nickname",
        knex
          .count("id")
          .from(UserDatabase.POST_TABLE_NAME)
          .where("user_id", knex.ref("u.id"))
          .as("postsCount"),
        knex
          .count("follow_id")
          .from(UserDatabase.RELATION_TABLE_NAME)
          .where("follow_id", knex.ref("u.id"))
          .as("followersCount"),
        knex
          .count("user_id")
          .from(UserDatabase.RELATION_TABLE_NAME)
          .where("user_id", knex.ref("u.id"))
          .as("followingCount")
      )
      .from({ u: UserDatabase.USER_TABLE_NAME })
      .where({ nickname });

    if (!userFromDb[0]) throw new Error("UserDatabase:getUserInfoByNickname");

    const user = User.toUserDTO(userFromDb[0]);
    const collectionsFromDb = await knex
      .select(
        "c.id",
        "c.name",
        "c.description",
        "c.thumbnail_url",
        "c.created_at"
      )
      .from({ c: UserDatabase.COLLECTION_TABLE_NAME })
      .where({ user_id: user.id })
      .orderBy("created_at", "desc");

    user.collections = Collection.toColletionsDTO(collectionsFromDb);

    await UserDatabase.destroyConnection();

    return user;
  }

  async getCollectionByUserId(userId: string) {
    const collections = await this.getConnection()
      .select(
        "c.id",
        "c.name",
        "c.description",
        "c.thumbnail_url",
        "c.created_at"
      )
      .from({ c: UserDatabase.COLLECTION_TABLE_NAME })
      .where({ user_id: user.id })
      .orderBy("created_at", "desc");
  }

  private async checkIfUserPairExistsById(
    userId: string,
    followId: string
  ): Promise<boolean> {
    const response = await this.getConnection()
      .count("id AS count")
      .from(UserDatabase.USER_TABLE_NAME)
      .whereIn("id", [userId, followId]);
    return response[0].count === 2;
  }

  private async checkIfUserRelationExistsById(
    userId: string,
    followId: string
  ): Promise<boolean> {
    const response = await this.getConnection()
      .count("user_id AS count")
      .from(UserDatabase.RELATION_TABLE_NAME)
      .where({ user_id: userId })
      .andWhere({ follow_id: followId });
    return response[0].count === 1;
  }

  public async follow(userId: string, followId: string): Promise<void> {
    if (!(await this.checkIfUserPairExistsById(userId, followId)))
      throw new Error("Invalid user id");

    try {
      await this.getConnection()
        .insert({ user_id: userId, follow_id: followId })
        .into(UserDatabase.RELATION_TABLE_NAME);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("Already following this user");
      } else {
        throw new Error("This is weird");
      }
    }
  }

  public async unfollow(userId: string, followId: string): Promise<void> {
    if (!(await this.checkIfUserRelationExistsById(userId, followId))) {
      throw new Error("No relation between users");
    }
    await this.getConnection()
      .del()
      .from(UserDatabase.RELATION_TABLE_NAME)
      .where({ user_id: userId, follow_id: followId });
  }
}
