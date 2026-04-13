import { Router, Request, Response } from "express";

const pingRouter = Router();

pingRouter.get("/", (req: Request, res: Response) => {
  console.log("Received ping request");
  return res.status(200).send("pong");
});

export default pingRouter;
