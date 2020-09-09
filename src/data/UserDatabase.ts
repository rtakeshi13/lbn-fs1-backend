import { BaseDatabase } from "./BaseDatabase";
import { User } from "../model/User";

export class UserDatabase extends BaseDatabase {
  private static TABLE_NAME = "fs1_user";

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
        .into(UserDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getUserByEmail(email: string): Promise<User> {
    const result = await this.getConnection()
      .select("*")
      .from(UserDatabase.TABLE_NAME)
      .where({ email });

    return User.toUserModel(result[0]);
  }

  public async getUserInfoById(id: string): Promise<any> {
    const result = await this.getConnection()
      .select("id", "name", "nickname")
      .from(UserDatabase.TABLE_NAME)
      .where({ id });
  }

  public async getUserInfoByNickname(nickname: string): Promise<any> {
    const result = await this.getConnection()
      .select("id", "name", "nickname")
      .from(UserDatabase.TABLE_NAME)
      .where({ nickname });
  }
}
