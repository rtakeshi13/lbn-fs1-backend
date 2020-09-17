import { DateFormatter } from "../services/DateFormatter";

export class Post {
  constructor(
    private id: string,
    private caption: string,
    private userId: string,
    private createdAt: Date,
    private mediaUrl: string
  ) {}

  getId() {
    return this.id;
  }

  getCaption() {
    return this.caption;
  }

  getUserId() {
    return this.userId;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getMediaUrl() {
    return this.mediaUrl;
  }

  setId(id: string) {
    this.id = id;
  }

  setCaption(caption: string) {
    this.caption = caption;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  setMediaUrl(mediaUrl: string) {
    this.mediaUrl = mediaUrl;
  }

  static toPostModel(post: any): Post {
    return new Post(
      post.id,
      post.caption,
      post.user_id,
      post.created_at,
      post.media_url
    );
  }

  static toPostDTO(post: any): PostOutputDTO {
    return {
      postId: post.id,
      userId: post.user_id,
      mediaUrl: post.media_url,
      caption: post.caption,
      createdAt: DateFormatter.mySqlDatetimeToMilliseconds(post.created_at),
      userNickname: post.nickname,
      userName: post.name,
      avatarUrl: post.avatar_url,
    };
  }
}

export class PostInputDTO {
  constructor(
    public caption: string = "",
    public mediaUrl: string = "",
    public collectionsIds: string[] = ["id"]
  ) {}
}

export interface PostOutputDTO {
  postId: string;
  userId: string;
  mediaUrl: string;
  caption: string;
  createdAt: number;
  userNickname: string;
  userName: string;
  avatarUrl: string;
}
