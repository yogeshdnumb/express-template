import { Request, Response } from "express";
import * as indexService from "../services/index.service";
export function getRoot(req: Request, res: Response) {
  res.send(indexService.sayHello());
}
