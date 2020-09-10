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

  private async checkIfUserExistsById(userId: string): Promise<boolean> {
    const response = await this.getConnection()
      .count("id AS count")
      .from(UserDatabase.USER_TABLE_NAME)
      .where({ id: userId });
    return Boolean(response[0].count);
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
