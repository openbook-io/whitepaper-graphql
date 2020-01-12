import { User } from "../entity/user";
import { Request, Response } from "express";

interface IRequest extends Request {
  user: User
}

export interface Context {
  req: IRequest;
  res: Response;
}
