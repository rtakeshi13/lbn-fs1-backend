import { BaseDatabase } from "./BaseDatabase";
import { Post, PostInputDTO } from "../model/Post";
import { DateFormatter } from "../services/DateFormatter";

export class PostDatabase extends BaseDatabase {
  private static POST_TABLE_NAME = "fs1_post";
  private static TAG_TABLE_NAME = "fs1_post_tag";
  private static COLLECTION_TABLE_NAME = "fs1_collection";

  public async createPost(
    postId: string,
    userId: string,
    postData: PostInputDTO
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id: postId,
          user_id: userId,
          media_url: postData.mediaUrl,
          caption: postData.caption,
          created_at: new DateFormatter().nowToMySqlDatetime(),
        })
        .into(PostDatabase.POST_TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}
