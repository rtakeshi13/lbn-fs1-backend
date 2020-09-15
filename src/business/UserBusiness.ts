import { UserDatabase } from "../data/UserDatabase";
import { Authenticator } from "../services/Authenticator";
import { Validator } from "../services/Validator";

export class UserBusiness {
  constructor(
    private authenticator: Authenticator,
    private userDatabase: UserDatabase
  ) {}

  public async getUserByNickname(nickname: string): Promise<any> {
    Validator.validateString(nickname);

    const userInfo = await this.userDatabase.getUserByNickname(nickname);
    return userInfo;
  }

  public async follow(token: string, followId: string): Promise<void> {
    Validator.validateString(followId);

    const userId = this.authenticator.getData(token).id;
    await this.userDatabase.follow(userId, followId);
  }

  public async unfollow(token: string, unfollowId: string): Promise<void> {
    Validator.validateString(unfollowId);

    const userId = this.authenticator.getData(token).id;
    await this.userDatabase.unfollow(userId, unfollowId);
  }
}
