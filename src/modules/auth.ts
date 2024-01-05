import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export type User = {
  username: string;
  id: string;
};
export function createJwt(user: User) {
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret) {
    const token = jwt.sign(user, jwtSecret);
    return token;
  } else {
    console.log("JWT secret not found");
    throw new Error();
  }
}
export function verifyJwt(token: string) {
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret) {
    return jwt.verify(token, jwtSecret) as User;
  } else {
    console.log("JWT secret not found");
    throw new Error();
  }
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 5);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
