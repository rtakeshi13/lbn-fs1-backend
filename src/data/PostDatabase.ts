import { BaseDatabase } from "./BaseDatabase";
import { Post, PostInputDTO, PostOutputDTO } from "../model/Post";
import { DateFormatter } from "../services/DateFormatter";
import {
  CollectionInputDTO,
  CollectionOutputDTO,
  Collection,
} from "../model/Collection";

export class PostDatabase extends BaseDatabase {
  private static POST_TABLE_NAME = "fs1_post";
  private static POST_LIMIT = 4;
  private static TAG_TABLE_NAME = "fs1_tag";
  private static POST_TAG_TABLE_NAME = "fs1_post_tag";
  private static COLLECTION_TABLE_NAME = "fs1_collection";
  private static POST_COLLECTION_TABLE_NAME = "fs1_post_collection";

  public async createPost(
    postId: string,
    userId: string,
    postData: PostInputDTO
  ): Promise<void> {
    try {
      const knex = this.getConnection();

      /* Inserts new post */
      await knex
        .insert({
          id: postId,
          user_id: userId,
          media_url: postData.mediaUrl,
          caption: postData.caption,
          created_at: DateFormatter.currentTimeToMySqlDatetime(),
        })
        .into(PostDatabase.POST_TABLE_NAME);

      const tagsFromClient = postData.caption
        .split(/\s+|\n+/)
        .filter(
          (item, idx, arr) => arr.indexOf(item) === idx && item.match(/#\w+/)
        )
        .map((item) => item.replace("#", ""));

      /* Select existing tags */
      const tagsFromDb = await knex
        .select()
        .from(PostDatabase.TAG_TABLE_NAME)
        .whereIn("tag", tagsFromClient);

      /* Insert tags that are not present in table */
      const tagNamesFromDb = tagsFromDb.map((item) => item.tag);
      const tagsNotInDb = tagsFromClient.filter(
        (item, idx, arr) =>
          arr.indexOf(item) === idx && !tagNamesFromDb.includes(item)
      );
      const newTagsIds = (
        await Promise.all(
          tagsNotInDb.map((item) =>
            knex.insert({ tag: item }).into(PostDatabase.TAG_TABLE_NAME)
          )
        )
      ).map((item) => item[0]);

      /* Create objects for insertion in post-tag relation table */
      const allTagsIds = tagsFromDb
        .map((dbItem) => dbItem.id)
        .concat(newTagsIds);

      const postTagInsertions = allTagsIds.map((item) => ({
        post_id: postId,
        tag_id: item,
      }));

      /* Inserts post-tag into relation table */
      await knex
        .insert(postTagInsertions)
        .into(PostDatabase.POST_TAG_TABLE_NAME);

      /* Inserts post-collection  */
      const postCollectionInsertions = postData.collectionsIds.map((item) => ({
        post_id: postId,
        collection_id: item,
      }));
      await knex
        .insert(postCollectionInsertions)
        .into(PostDatabase.POST_COLLECTION_TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getPostsByUserId(
    userId: string,
    page: number
  ): Promise<PostOutputDTO[]> {
    try {
      const response = await this.getConnection()
        .select()
        .from(PostDatabase.POST_TABLE_NAME)
        .where({ user_id: userId })
        .orderBy("created_at", "desc")
        .limit(PostDatabase.POST_LIMIT)
        .offset(PostDatabase.POST_LIMIT * page);
      return response.map((item) => Post.toPostDTO(item));
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async createCollection(
    collectionId: string,
    userId: string,
    collectionData: CollectionInputDTO
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id: collectionId,
          name: collectionData.name,
          description: collectionData.description,
          thumbnail_url: collectionData.thumbnailUrl,
          created_at: DateFormatter.currentTimeToMySqlDatetime(),
          user_id: userId,
        })
        .into(PostDatabase.COLLECTION_TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async getCollectionByUserId(userId: string): Promise<any[]> {
    const collectionsFromDb = await this.getConnection()
      .select("c.id", "c.name")
      .from({ c: PostDatabase.COLLECTION_TABLE_NAME })
      .where({ user_id: userId })
      .orderBy("created_at", "desc");

    const collections = collectionsFromDb.map((item) => ({
      value: item.id,
      label: item.name,
    }));

    await PostDatabase.destroyConnection();

    return collections;
  }
}
