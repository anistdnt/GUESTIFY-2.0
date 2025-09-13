import { getCookie, deleteCookie} from "cookies-next/client";
import { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { API } from "./api_const";

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
        deleteCookie("authToken");
        toast.error("Token is expired!! Please login again");
        return false;
      }
    } else {
      return false;
    }

    return true;
  } catch (error:unknown) {
    console.error("Error in verifying token:", error);
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
      // console.log("Decoded token:", decoded);
      return decoded as JwtPayload;
    }
    else{
      throw new Error("Token is not valid");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in decodeToken:", error);
      toast.error(`Error while parsing the Token : ${error.message}`);
    }

    return {} as JwtPayload;
  }
};

export function shouldSkipAuthCheck(url: string): boolean {
  const exemptedUrls = [
    API.USER.LOGIN,
    API.USER.REGISTER,
    API.USER.FORGET_PASSWORD,
    API.USER.CHANGE_PASSWORD,
    API.NOTIFICATION.ALL_NOTIFICATIONS,
    API.COLLEGE.LIST,
    API.COLLEGE.GET_BY_ID,
    API.PG.ALL,
    API.PG.GET_PG_BY_ID,
    API.PG.FOR_MAP,
    API.PG.GET_PG_NEAR_ME,
    API.PG.GET_PG_NEAR_PG,
    API.REVIEW.GET_REVIWS_OF_PG,
    API.REVIEW.ADD_REVIEW,
    API.OWNER.GET_OWNER_BY_ID,
  ];
  return exemptedUrls.some(exempted => url.includes(exempted));
}