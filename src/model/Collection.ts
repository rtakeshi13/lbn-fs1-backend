import { DateFormatter } from "../services/DateFormatter";
import { User } from "./User";

export class Collection {
  constructor(
    private id: string,
    private name: string,
    private description: string,
    private createdAt: Date,
    private thumbnailUrl: string,
    private user: User
  ) {}

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getDescription() {
    return this.description;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getThumbnailUrl() {
    return this.thumbnailUrl;
  }

  getUser() {
    return this.user;
  }

  setId(id: string) {
    this.id = id;
  }

  setName(name: string) {
    this.name = name;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  setThumbnailUrl(thumbnailUrl: string) {
    this.thumbnailUrl = thumbnailUrl;
  }

  setUser(user: User) {
    this.user = user;
  }

  static toColletionDTO(collection: any): CollectionOutputDTO {
    return {
      collectionId: collection.id,
      name: collection.name,
      description: collection.description,
      createdAt: DateFormatter.mySqlDatetimeToMilliseconds(
        collection.created_at
      ),
      userId: collection.user_id,
    };
  }
}

export class CollectionInputDTO {
  constructor(
    public name: string = "",
    public description: string = "",
    public thumbnailUrl: string = ""
  ) {}
}

export interface CollectionOutputDTO {
  collectionId: string;
  name: string;
  description: string;
  createdAt: number;
  userId: number;
}
