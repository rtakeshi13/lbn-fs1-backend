import { BaseDatabase } from "./BaseDatabase";
import { Post, PostInputDTO } from "../model/Post";
import { DateFormatter } from "../services/DateFormatter";

export class PostDatabase extends BaseDatabase {
  private static POST_TABLE_NAME = "fs1_post";
  private static TAG_TABLE_NAME = "fs1_tag";
  private static POST_TAG_TABLE_NAME = "fs1_post_tag";
  private static COLLECTION_TABLE_NAME = "fs1_collection";

  public async createPost(
    postId: string,
    userId: string,
    postData: PostInputDTO
  ): Promise<void> {
    try {
      const knex = this.getConnection();

      /* Inserts new post in posts table */
      await knex
        .insert({
          id: postId,
          user_id: userId,
          media_url: postData.mediaUrl,
          caption: postData.caption,
          created_at: DateFormatter.currentTimeToMySqlDatetime(),
        })
        .into(PostDatabase.POST_TABLE_NAME);

      /* Inserts tags without repetition */
      const queries = postData.tags.map((item) =>
        knex.raw(`
          INSERT INTO fs1_tag (tag) SELECT '${item}'
          WHERE NOT EXISTS (SELECT 1 FROM fs1_tag WHERE tag = '${item}')
        `)
      );
      await Promise.all(queries);

      /* Select tag ids from tag names received */
      const tagIds = await knex
        .select("id")
        .from(PostDatabase.TAG_TABLE_NAME)
        .whereIn("tag", postData.tags);

      /* Create objects for insertion in post-tag relation table */
      const postTagInsertions = tagIds.map((item) => ({
        post_id: postId,
        tag_id: item.id,
      }));

      /* Inserts post-tag into relation table */
      await knex
        .insert(postTagInsertions)
        .into(PostDatabase.POST_TAG_TABLE_NAME);
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
