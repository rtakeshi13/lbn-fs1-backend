import { BaseDatabase } from "./BaseDatabase";
import { User, SignupInputDTO } from "../model/User";

export class UserDatabase extends BaseDatabase {
  private static USER_TABLE_NAME = "fs1_user";
  private static RELATION_TABLE_NAME = "fs1_user_relation";
  private static POST_TABLE_NAME = "fs1_post";

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
          role: signupData.role,
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

    return response[0];
  }

  public async follow(userId: string, followId: string): Promise<void> {
    await this.getConnection()
      .insert({ user_id: userId, follow_id: followId })
      .into(UserDatabase.RELATION_TABLE_NAME);
  }

  public async unfollow(userId: string, followId: string): Promise<void> {
    await this.getConnection()
      .del()
      .from(UserDatabase.RELATION_TABLE_NAME)
      .where({ user_id: userId, follow_id: followId });
  }
}
