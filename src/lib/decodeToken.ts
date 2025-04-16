import { getCookie } from "cookies-next/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import toast from "react-hot-toast";

export const decodeToken = (token: string): JwtPayload => {
  try {
    const authToken = getCookie(token);
    console.log(authToken);
    if (!authToken) {
      throw new Error("User Authorization failed : Token not available");
    }
    const decoded_token = jwt.verify(
      authToken,
      "GKeyForAll"
    ) as JwtPayload;
    console.log(decoded_token);
    console.log("Hello");
    return decoded_token;
  } catch (error: unknown) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.NotBeforeError ||
      error instanceof jwt.TokenExpiredError || 
      error instanceof Error
    ) {
      toast.error(error.message);
    }

    return {} as JwtPayload;
  }
};
