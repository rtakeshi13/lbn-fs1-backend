import { SignupInputDTO, LoginInputDTO } from "../model/User";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { Validator } from "../services/Validator";

export class UserBusiness {
  constructor(
    private authenticator: Authenticator,
    private hashManager: HashManager,
    private idGenerator: IdGenerator,
    private userDatabase: UserDatabase
  ) {}
  async createUser(signupData: SignupInputDTO) {
    if (!Validator.validateDto(signupData, new SignupInputDTO())) {
      throw new Error("Invalid or missing parameters");
    }
    const id = this.idGenerator.generate();
    const hashPassword = await this.hashManager.hash(signupData.password);

    await this.userDatabase.createUser(id, hashPassword, signupData);

    const accessToken = this.authenticator.generateToken({
      id,
      role: signupData.role,
    });

    return accessToken;
  }

  async getUserByEmail(loginData: LoginInputDTO) {
    if (!Validator.validateDto(loginData, new LoginInputDTO())) {
      throw new Error("Invalid or missing parameters");
    }
    const userFromDB = await this.userDatabase.getUserByEmail(loginData.email);

    const hashCompare = await this.hashManager.compare(
      loginData.password,
      userFromDB.getPassword()
    );

    const accessToken = this.authenticator.generateToken({
      id: userFromDB.getId(),
      role: userFromDB.getRole(),
    });

    if (!hashCompare) {
      throw new Error("Invalid Password!");
    }

    return accessToken;
  }

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
