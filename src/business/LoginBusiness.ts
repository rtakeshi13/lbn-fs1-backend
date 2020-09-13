import { LoginInputDTO } from "../model/User";
import { UserDatabase } from "../data/UserDatabase";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { Validator } from "../services/Validator";

export class LoginBusiness {
  constructor(
    private authenticator: Authenticator,
    private hashManager: HashManager,
    private userDatabase: UserDatabase
  ) {}

  async execute(loginData: LoginInputDTO) {
    if (!Validator.validateDto(loginData, new LoginInputDTO())) {
      throw new Error("Invalid or missing parameters");
    }
    const userFromDB = await this.userDatabase.getUserByEmailOrNickname(
      loginData.emailOrNickname
    );

    const hashCompare = await this.hashManager.compare(
      loginData.password,
      userFromDB.getPassword()
    );
    if (!hashCompare) {
      throw new Error("Invalid Password!");
    }

    const token = this.authenticator.generateToken({
      id: userFromDB.getId(),
      role: userFromDB.getRole(),
    });

    return { nickname: userFromDB.getNickname(), token };
  }
}
