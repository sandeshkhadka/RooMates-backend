import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import CustomError from "./errors";
export interface User {
  username: string;
  id: string;
}
export function createJwt(user: User) {
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret) {
    const token = jwt.sign(user, jwtSecret);
    return token;
  } else {
    throw new CustomError("jwt secret not found", "server");
  }
}
export function verifyJwt(token: string) {
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret) {
    return jwt.verify(token, jwtSecret) as User;
  } else {
    throw new CustomError("jwt secret not found", "server");
  }
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 5);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
