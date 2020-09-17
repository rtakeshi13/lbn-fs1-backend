import express from "express";
import { PostController } from "../controller/PostController";

export const postRouter = express.Router();

const postController = new PostController();

postRouter.post("/create", postController.createPost);
postRouter.get("/", postController.getPostsByUserId);
postRouter.get("/tag", postController.getPostsByTag);
postRouter.put("/collection", postController.createColletion);
postRouter.get("/collection", postController.getCollectionsByUserId);
