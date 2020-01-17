import { User } from "../entity/user";
import { Organization } from "../entity/Organization";
import { Request, Response } from "express";

interface IRequest extends Request {
  user: User | null,
  organization: Organization | null,
  auth?: {
    id: number,
    roles: string[],
    iat: number
  } 
}

export interface Context {
  req: IRequest;
  res: Response;
}
