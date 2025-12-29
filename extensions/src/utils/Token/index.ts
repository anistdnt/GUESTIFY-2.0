import { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

export const tokenIsVerified = (token: string) => {
  //Check if the token not exists
  if (!token) {
    return false;
  }

  // check whether the token is expired or not
  try {
    const { exp } = jwtDecode(token);

    if (exp !== undefined) {
      if (Date.now() >= exp * 1000) {
        return false;
      }
    } else {
      return false;
    }

    return true;
  } catch (error:unknown) {
    console.error("Error in verifying token:", error);
    return false;
  }
};

export const decodeToken = (authToken: string): JwtPayload => {
  try {
    if (!authToken || typeof authToken !== "string") {
      throw new Error("Token is not available or is not a string.");
    }

    if (tokenIsVerified(authToken)) {
      const decoded = jwtDecode(authToken);
      return decoded as JwtPayload;
    }
    else{
      throw new Error("Token is not valid");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in decodeToken:", error);
    }

    return {} as JwtPayload;
  }
};