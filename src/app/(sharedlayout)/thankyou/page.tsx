import ThankYouPage from "@/components/Thankyou/Thankyou";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";

interface Iprops {
  searchParams: {
    session_id?: string;
    lat?: string;
    long?: string;
  };
}

const page = async ({ searchParams: { session_id, lat, long } }: Iprops) => {
  const resData: ApiReturn<any> = await api_caller<any>(
    "GET",
    `${API.CHECKOUT.CHECKOUT_INFO}?session_id=${session_id}`
  );
  if (resData?.success) {
    return (
      <ThankYouPage
        checkoutInfo={resData?.data}
        latitude={Number(lat)}
        longitude={Number(long)}
      />
    );
  } else {
    return <div>Something Went Wrong</div>
  }
};

export default page;
