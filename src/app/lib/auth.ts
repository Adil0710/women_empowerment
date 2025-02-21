import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    console.log(error)
    return null;
  }
};
