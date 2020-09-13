import { UserDatabase } from "../data/UserDatabase";
import { Authenticator } from "../services/Authenticator";
import { Validator } from "../services/Validator";

export class UserBusiness {
  constructor(
    private authenticator: Authenticator,
    private userDatabase: UserDatabase
  ) {}

  public async getUserInfoByNickname(nickname: string): Promise<any> {
    if (!Validator.validateString(nickname)) {
      throw new Error("Invalid or missing parameters");
    }
    const userInfo = await this.userDatabase.getUserInfoByNickname(nickname);
    return userInfo;
  }

  public async follow(token: string, followId: string): Promise<void> {
    if (!Validator.validateString(followId)) {
      throw new Error("Invalid or missing parameters");
    }
    const userId = this.authenticator.getData(token).id;
    await this.userDatabase.follow(userId, followId);
  }

  public async unfollow(token: string, followId: string): Promise<void> {
    const userId = this.authenticator.getData(token).id;
    await this.userDatabase.unfollow(userId, followId);
  }
}
