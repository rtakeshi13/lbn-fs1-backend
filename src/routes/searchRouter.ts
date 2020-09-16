import express from "express";
import { SearchController } from "../controller/SearchController";

export const seachRouter = express.Router();

const seachController = new SearchController();

seachRouter.get("", seachController.search);
