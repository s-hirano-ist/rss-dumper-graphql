import { verify } from "jsonwebtoken";
import { Context } from "./context";

export const APP_SECRET = process.env.APP_SECRET;

type Token = {
  userId: string;
};

export function getUserId(context: Context) {
  if (!APP_SECRET) throw new Error("No app secret");

  const authHeader = context.req.get("Authorization");
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const verifiedToken = verify(token, APP_SECRET) as Token;
    return verifiedToken && Number(verifiedToken.userId);
  }
}
