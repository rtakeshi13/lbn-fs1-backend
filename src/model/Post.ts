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

  static toPostDTO(post: any): PostDTO {
    return {
      postId: post.id,
      userId: post.user_id,
      mediaUrl: post.media_url,
      caption: post.caption,
      createdAt: new DateFormatter().mySqlDatetimeToMilliseconds(
        post.created_at
      ),
    };
  }
}

export interface PostInputDTO {
  caption: string;
  mediaUrl: string;
  tags: string[];
  collectionsIds: string[];
}

export interface PostDTO {
  postId: string;
  userId: string;
  mediaUrl: string;
  caption: string;
  createdAt: number;
}