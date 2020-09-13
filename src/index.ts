import dotenv from "dotenv";
import { AddressInfo } from "net";
import express from "express";
import cors from "cors";
import { userRouter } from "./routes/userRouter";
import { postRouter } from "./routes/postRouter";
dotenv.config();
const app = express();

app.use(express.json());
// app.use(cors());

app.use("/user", userRouter);
app.use("/post", postRouter);

const server = app.listen(Number(process.env.port) || 3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(
      `Server running on ${address.address}:${address.port} - ${address.family}`
    );
  } else {
    console.error(`Server start failed.`);
  }
});
