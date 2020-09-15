import { CollectionOutputDTO } from "./Collection";

export class User {
  constructor(
    private id: string,
    private name: string,
    private nickname: string,
    private email: string,
    private password: string,
    private role: UserRole
  ) {}

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getNickname() {
    return this.nickname;
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  getRole() {
    return this.role;
  }

  setId(id: string) {
    this.id = id;
  }

  setName(name: string) {
    this.name = name;
  }

  setNickname(nickname: string) {
    this.nickname = nickname;
  }

  setEmail(email: string) {
    this.email = email;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setRole(role: UserRole) {
    this.role = role;
  }

  static stringToUserRole(input: string): UserRole {
    switch (input) {
      case "NORMAL":
        return UserRole.NORMAL;
      case "ADMIN":
        return UserRole.ADMIN;
      default:
        throw new Error("Invalid user role");
    }
  }

  static toUserModel(user: any): User {
    return new User(
      user.id,
      user.name,
      user.nickname,
      user.email,
      user.password,
      User.stringToUserRole(user.role)
    );
  }

  static toUserDTO(user: any): UserOutputDTO {
    return {
      name: user.name,
      nickname: user.nickname,
      postsCount: user.postsCount,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      collections: [],
    };
  }
}

export class SignupInputDTO {
  constructor(
    public email: string = "",
    public password: string = "",
    public name: string = "",
    public nickname: string = ""
  ) {}
}

export class LoginInputDTO {
  constructor(
    public emailOrNickname: string = "",
    public password: string = ""
  ) {}
}

export interface UserOutputDTO {
  name: string;
  nickname: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  collections: CollectionOutputDTO[];
}

export enum UserRole {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
}
