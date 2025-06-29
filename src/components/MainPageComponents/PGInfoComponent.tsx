"use client"

import RoomCard from '@/components/DisplayCard/RoomCard';
import Feedback from '@/components/Feedback/Feedback';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ForkKnife, WifiHigh, ThermometerCold, ArrowLeft, ArrowRight, X } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { PGInfo, Room } from '@/types/pg_type';
import 'swiper/css';

interface Iprops {
    pginfo: PGInfo,
    rooms: Room[]
}
const PGInfoComponent = ({ pginfo, rooms }: Iprops) => {
    // const router = useRouter();
    //   const { id } = router.query;
    //   const [pgDetails, setPgDetails] = useState(null);

    //   useEffect(() => {
    //     if (id) {
    //       axios.get(`/api/pg/${id}`)
    //         .then(response => setPgDetails(response.data))
    //         .catch(error => console.error('Error fetching PG details:', error));
    //     }
    //   }, [id]);

    // if (!pgDetails) {
    //     return <p className="text-center mt-10">Loading PG details...</p>;
    // }

    // const [showReviewPanel, setShowReviewPanel] = useState<boolean>(false);
    // const [isClosing, setIsClosing] = useState(false);

    const formRef = useRef<HTMLDivElement>(null);

    // const handleCloseReviewPanel = () => {
    //     setIsClosing(true);
    //     setTimeout(() => {
    //         setShowReviewPanel(false);
    //         setIsClosing(false);
    //     }, 300);
    // };

    const router = useRouter()
    return (
        <div className=" mx-auto">
            <ArrowLeft size={32} onClick={() => router.back()} className='mb-4 cursor-pointer' />
            <div className='flex flex-col sm:flex-row gap-6'>

                <img src={pginfo.pg_image_url}
                    alt="PG Image"
                    className="sm:w-[70%] rounded-lg max-h-[480px]" />

                {/* for slider use , will use it later */}

                {/* <Swiper spaceBetween={10} slidesPerView={1} className="mb-6">
                    {pgDetails.images.map((img, index) => (
          <SwiperSlide key={index}>
          <img src={img} alt={`PG Image ${index + 1}`} className="w-full rounded-lg" />
          </SwiperSlide>
          ))}

                    <SwiperSlide key="1">
                        <img src="/assets/sample1.jpg" alt={`PG Image`} className="w-full max-sm:max-w-[600px] rounded-lg" />
                    </SwiperSlide>

                </Swiper> */}

                <div className='w-full sm:w-full sm:max-w-[300px]'>
                    <h1 className="text-3xl font-bold mb-3">{pginfo.pg_name}</h1>
                    <span
                        className={`${pginfo?.pg_type === "girls" && "bg-pink-500"
                            } ${pginfo?.pg_type === "boys" && "bg-blue-500"} ${pginfo?.pg_type === "both" && "bg-yellow-700"
                            } text-white text-xs px-2 py-1 rounded`}
                    >
                        {pginfo?.pg_type?.replace(
                            pginfo?.pg_type[0],
                            pginfo?.pg_type[0]?.toUpperCase()
                        )}
                    </span>

                    <p className="text-xl font-semibold mt-4 mb-4">Rent: <span className='text-3xl text-red-500'>₹12000</span></p>
                    <p className='flex flex-row gap-3 items-center mb-3'><WifiHigh size={20} /> <span className='font-semibold'>Wifi :</span> {pginfo.wifi_available === "yes" ? "Available" : "Not Available"}</p> {/* {pgDetails.wifi ? 'Available' : 'Not Available'} */}
                    {/* <p className='flex flex-row gap-3 items-center mb-3'><ThermometerCold size={20} /><span className='font-semibold'>AC :</span>  Available</p> */}
                    <p className='flex flex-row gap-3 items-center'><ForkKnife size={20} /> <span className='font-semibold'>Food :</span> {pginfo.food_available === "yes" ? "Provided" : "Not Provided"}</p> {/* {pgDetails.food ? 'Provided' : 'Not Provided'} */}
                    <p className="mt-4 text-gray-600"><span className='font-semibold'>Address:</span> {pginfo.address}</p>
                    <p className="mt-4 text-gray-600 mb-8"><span className='font-semibold'>Pincode:</span> {pginfo.pincode}</p>
                    <button className="bg-buttons hover:bg-buttonsHover text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300">
                        Get Contact Details
                    </button>

                </div>
            </div>
            <div className="mt-6 p-4 bg-gray-100 border-l-4 border-yellow-500 rounded-lg shadow-sm">
                <p className="text-lg font-semibold text-gray-800"><strong>Rules:</strong></p>
                <p className="mt-2 text-gray-700 leading-relaxed">{pginfo.rules}</p>
            </div>

            <div className='w-full bg-yellow-100 flex flex-col sm:flex-row items-center justify-center gap-5 py-4 mt-6 rounded-md'>
                <span>Share your thoughts about this PG</span>
                <button
                    className="text-buttonsHover flex flex-row items-center text-sm gap-1 hover:underline"
                    onClick={() => { formRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>Write a Review <ArrowRight size={16} /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                {rooms && rooms.map((room) => (
                    <RoomCard
                        key={room._id}
                        title={`${room.room_type[0].toUpperCase() + room.room_type.slice(1)} Room`}
                        rent={room.room_rent}
                        foodIncluded={true}
                        roomsAvailable={10}
                        depositDuration={room.deposit_duration}
                        imageUrls={[room.room_image_url]}
                        amenities={[
                            "AC",
                            "Washroom",
                            "Cupboard",
                            "TV",
                            "Cot",
                            "Mattress",
                            "WiFi",
                            "Geyser",
                        ]}
                    />
                ))}

            </div>


            <Feedback ref={formRef} />

            {/* review offcanvas */}
            {/* {showReviewPanel && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-30">
                    <div
                        ref={panelRef}
                        className={`bg-white w-full max-w-screen-md h-full shadow-lg p-6 overflow-y-auto relative ${isClosing ? "animate-slideOutRight" : "animate-slideInRight"
                            }`}
                    >
                        
                        <button
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                            onClick={handleCloseReviewPanel}
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>

                        
                        <form className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium">Your Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Rating</label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2">
                                    <option>5 - Excellent</option>
                                    <option>4 - Good</option>
                                    <option>3 - Average</option>
                                    <option>2 - Poor</option>
                                    <option>1 - Terrible</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Review</label>
                                <textarea
                                    rows={4}
                                    className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Write your feedback..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            )} */}

        </div>
    );
};

export default PGInfoComponent;
