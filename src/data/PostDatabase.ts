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
          created_at: DateFormatter.currentTimeToMySqlDatetime(),
        })
        .into(PostDatabase.POST_TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getPostsByUserId(userId: string) {
    try {
      const response = await this.getConnection()
        .select()
        .from(PostDatabase.POST_TABLE_NAME)
        .where({ user_id: userId })
        .orderBy("created_at", "desc")
        .limit(3)
        .offset(2);
      return response.map((item) => Post.toPostDTO(item));
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}
