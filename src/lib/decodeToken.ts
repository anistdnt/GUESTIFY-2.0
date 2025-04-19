import { getCookie } from "cookies-next/client";
import { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

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
        localStorage.removeItem("loginjwt");
        toast.error("Token is expired!! Please login again");
        return false;
      }
    } else {
      return false;
    }

    return true;
  } catch (error) {
    toast.error("Invalid Token");
    return false;
  }
};

export const decodeToken = (cookieName: string): JwtPayload => {
  try {
    const authToken = getCookie(cookieName);
    // console.log("Raw authToken:", authToken);

    if (!authToken || typeof authToken !== "string") {
      throw new Error("Token is not available or is not a string.");
    }
    // const decoded = jwt.verify(authToken, "GKeyForAll");

    if (tokenIsVerified(authToken)) {
      const decoded = jwtDecode(authToken);
      // console.log("✅ Decoded token:", decoded);
      return decoded as JwtPayload;
    }
    else{
      throw new Error("Token is not valid");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error in decodeToken:", error);
      toast.error(`Error while parsing the Token : ${error.message}`);
    }

    return {} as JwtPayload;
  }
};
