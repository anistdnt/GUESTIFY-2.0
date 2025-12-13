import { removeWishlistData, setWishlistData } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { API } from "@/lib/api_const";
import { api_caller } from "@/lib/api_caller";
import toast from "react-hot-toast";

export function useWishlist() {
  const dispatch = useDispatch();
  const profile_info = useSelector(
    (state: RootState) => state.user_slice.userData
  );

  // Handling Add/Remove Wishlist
  const addToWishlist = async (pgId: string) => {
    const isNotAddToWishlistPg = profile_info?.wishlist?.includes(pgId);

    if (isNotAddToWishlistPg) {
      dispatch(removeWishlistData(pgId));
    } else {
      dispatch(setWishlistData(pgId));
    }

    try {
      // Determine endpoint and payload
      const endpoint = !isNotAddToWishlistPg
        ? API.WISHLIST.ADD
        : `${API.WISHLIST.DELETE}/${pgId}`;
      const method = !isNotAddToWishlistPg ? "POST" : "DELETE";

      const payload = !isNotAddToWishlistPg ? { pg_id: pgId } : undefined;

      const response = await api_caller(method, endpoint, payload);

      if (!response.success) {
        if (isNotAddToWishlistPg) {
          dispatch(setWishlistData(pgId));
        } else {
          dispatch(removeWishlistData(pgId));
        }
        toast.error(
          response.error || "Something went wrong. Please try again."
        );
      } else {
        toast.success(response.message);
      }
    } catch (err) {
      toast.error("Unable to update wishlist. Try again later.");
    }
  };

  // wishlist
  const wishlistArray = profile_info?.wishlist || [];

  // is user logged in
  const isUserLoggedIn = Boolean(profile_info?._id);  

  return { addToWishlist, wishlistArray, isUserLoggedIn };
}
