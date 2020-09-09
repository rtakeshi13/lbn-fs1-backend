import { BaseDatabase } from "./BaseDatabase";
import { User } from "../model/User";

export class UserDatabase extends BaseDatabase {
  private static USER_TABLE_NAME = "fs1_user";
  private static RELATION_TABLE_NAME = "fs1_user_relation";
  private static POST_TABLE_NAME = "fs1_post";

  public async createUser(
    id: string,
    name: string,
    nickname: string,
    email: string,
    password: string,
    role: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id,
          name,
          nickname,
          email,
          password,
          role,
        })
        .into(UserDatabase.USER_TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getUserByEmail(email: string): Promise<User> {
    const result = await this.getConnection()
      .select("*")
      .from(UserDatabase.USER_TABLE_NAME)
      .where({ email });

    return User.toUserModel(result[0]);
  }

  public async getUserInfoById(id: string): Promise<any> {
    const result = await this.getConnection()
      .select("id", "name", "nickname")
      .from(UserDatabase.USER_TABLE_NAME)
      .where({ id });
  }

  public async getUserInfoByNickname(nickname: string): Promise<any> {
    const knex = this.getConnection();

    const response = await knex
      .select(
        "u.id",
        "u.name",
        "u.nickname",
        knex
          .count()
          .from(UserDatabase.POST_TABLE_NAME)
          .where("user_id", knex.ref("u.id"))
          .as("postsCount"),
        knex
          .count()
          .from(UserDatabase.RELATION_TABLE_NAME)
          .where("follow_id", knex.ref("u.id"))
          .as("followersCount"),
        knex
          .count()
          .from(UserDatabase.RELATION_TABLE_NAME)
          .where("user_id", knex.ref("u.id"))
          .as("followingCount")
      )
      .from({ u: UserDatabase.USER_TABLE_NAME })
      .where({ nickname });

    return response[0];
  }
}
