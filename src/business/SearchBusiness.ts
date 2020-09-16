import { LoginInputDTO } from "../model/User";
import { UserDatabase } from "../data/UserDatabase";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { Validator } from "../services/Validator";
import { PostDatabase } from "../data/PostDatabase";

export class SearchBusiness {
  constructor(
    private authenticator: Authenticator,
    private userDatabase: UserDatabase,
    private postDatabase: PostDatabase
  ) {}

  async execute(token: string, input: string): Promise<any[]> {
    this.authenticator.getData(token);
    Validator.validateString(input);

    if (input.includes("#")) {
      const tags = await this.postDatabase.searchTags(input);
      return tags;
    } else {
      const users = await this.userDatabase.searchUsers(input);
      return users;
    }
  }
}
