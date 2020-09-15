import { SignupInputDTO, UserRole } from "../model/User";
import { UserDatabase } from "../data/UserDatabase";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { Validator } from "../services/Validator";
import { IdGenerator } from "../services/IdGenerator";

export class SignupBusiness {
  constructor(
    private authenticator: Authenticator,
    private hashManager: HashManager,
    private idGenerator: IdGenerator,
    private userDatabase: UserDatabase
  ) {}
  async execute(signupData: SignupInputDTO) {
    Validator.validateDto(signupData, new SignupInputDTO());

    const id = this.idGenerator.generate();
    const hashPassword = await this.hashManager.hash(signupData.password);

    await this.userDatabase.createUser(id, hashPassword, signupData);

    const token = this.authenticator.generateToken({
      id,
      role: UserRole.NORMAL,
    });

    return { nickname: signupData.nickname, token };
  }
}
