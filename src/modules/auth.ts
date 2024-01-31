import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export type User = {
  username: string;
  id: string;
  email: string;
};
type TempTokenInfo = {
  username: string;
  email: string;
};
export function createJwt(user: User) {
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret) {
    const token = jwt.sign(user, jwtSecret, { expiresIn: "7d" });
    return token;
  } else {
    console.log("JWT secret not found");
    throw new Error();
  }
}
export function createTemporaryToken(info: TempTokenInfo) {
  const temporarySecret = process.env.TEMP_SECRET;
  if (temporarySecret) {
    const token = jwt.sign(info, temporarySecret, { expiresIn: "1h" });
    return token;
  } else {
    console.log("Temporary Token Secret not found");
    throw new Error();
  }
}

export function verifyTemporaryToken(token: string) {
  const signUpSecret = process.env.TEMP_SECRET;
  if (signUpSecret) {
    return jwt.verify(token, signUpSecret) as TempTokenInfo;
  } else {
    console.log("Temporary Token Secret not found");
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
