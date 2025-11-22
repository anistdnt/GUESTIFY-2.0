import ThankYouPage from "@/components/Thankyou/Thankyou"
import { api_caller, ApiReturn } from "@/lib/api_caller";

interface Iprops {
    searchParams: {
        session_id?: string;
        lat?: string;
        long?: string;
    };
}

const page = async ({ searchParams: { session_id, lat, long } }: Iprops) => {
    // const resData:ApiReturn<any> = await api_caller<any>("GET", `/api/get-checkout-info?session_id=${session_id}`);
    const resData = await fetch(`http://localhost:3001/api/get-checkout-info?session_id=${session_id}`).then(res => res.json());
    console.log("Checkout Info:", resData);
    return (
        <ThankYouPage checkoutInfo={resData} latitude={Number(lat)} longitude={Number(long)} />
    )
}

export default page