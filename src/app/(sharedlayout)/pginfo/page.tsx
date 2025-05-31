"use client"

import Feedback from '@/components/Feedback/Feedback';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { Swiper, SwiperSlide } from 'swiper/react';
import { ForkKnife, WifiHigh, ThermometerCold, ArrowLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';

// import 'swiper/css';

const PGDetails = () => {
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

    const router = useRouter()
    return (
        <div className=" mx-auto">
            <ArrowLeft size={32} onClick={()=>router.back()} className='mb-4 cursor-pointer'/>
            <div className='flex flex-col sm:flex-row gap-6'>

                <img src="/assets/sample1.jpg"
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
                    <h1 className="text-3xl font-bold mb-6">PG Name</h1>

                    <p className="text-xl font-semibold mb-4">Rent: <span className='text-3xl text-red-500'>₹12000</span></p>
                    <p className='flex flex-row gap-3 items-center mb-3'><WifiHigh size={20} /> <span className='font-semibold'>Wifi :</span> Available</p> {/* {pgDetails.wifi ? 'Available' : 'Not Available'} */}
                    <p className='flex flex-row gap-3 items-center mb-3'><ThermometerCold size={20} /><span className='font-semibold'>AC :</span>  Available</p>
                    <p className='flex flex-row gap-3 items-center'><ForkKnife size={20} /> <span className='font-semibold'>Food :</span> Provided</p> {/* {pgDetails.food ? 'Provided' : 'Not Provided'} */}
                    <p className="mt-4 text-gray-600 mb-8">Address: Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, optio.</p>
                    <button className="bg-buttons hover:bg-buttonsHover text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300">
                        Get Contact Details
                    </button>

                </div>
            </div>
            <div className="mt-6 p-4 bg-gray-100 border-l-4 border-yellow-500 rounded-lg shadow-sm">
                <p className="text-lg font-semibold text-gray-800"><strong>Rules:</strong></p>
                <p className="mt-2 text-gray-700 leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa nobis dolorum facere dolore velit, laudantium nisi. Magni dolorum quas quam debitis tenetur laboriosam officiis sit accusantium eligendi, doloribus inventore ut corrupti esse nemo placeat fugiat adipisci! Architecto sit obcaecati quia vero eveniet repellat delectus consectetur voluptas molestias sunt? Rem repellat maiores nesciunt mollitia accusantium dolorem recusandae adipisci sapiente non dolorum, quos sit debitis alias esse ipsam corrupti in dolor. Velit, perferendis libero dolorum, quis, iusto fugiat nostrum deserunt ducimus possimus optio quidem. Dignissimos, voluptas totam assumenda voluptates voluptatibus cum et impedit nemo commodi accusantium architecto, quod corporis expedita dolorem. Voluptas.
                </p>
            </div>

            <Feedback />

        </div>
    );
};

export default PGDetails;
