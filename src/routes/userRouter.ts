import express from "express";
import { UserController } from "../controller/UserController";

export const userRouter = express.Router();

const userController = new UserController();

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/:nickname", userController.getUserByNickname);
userRouter.post("/follow", userController.follow);
userRouter.delete("/unfollow", userController.unfollow);
