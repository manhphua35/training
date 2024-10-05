// src/types/express.d.ts
import { UserRoleEnum } from "../../entities/UserRole";

declare global {
  namespace Express {
    export interface Request {
      user?: {
        userId: number;
        email: string;
        roles: UserRoleEnum[];
      };
    }
  }
}

export {};
