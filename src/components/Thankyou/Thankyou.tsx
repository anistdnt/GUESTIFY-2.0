"use client";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import Link from "next/link";
const Map = dynamic(() => import("../Map/Map"), { ssr: false });

interface ThankYouPageProps {
    checkoutInfo?: any;
    latitude?: number;
    longitude?: number;
}

interface checkoutInfoType {
    id: string;
    amount_total: number;
    currency: string;
    customer_details: {
        email: string;
        name: string;
        phone?: string;
        address?: {
            line1?: string;
            line2?: string;
            city?: string;
            state?: string;
            postal_code?: string;
            country?: string;
        };
    };
    payment_intent: {
        id: string;
        status: string;
    };
}

export default function ThankYouPage({checkoutInfo , latitude , longitude}: ThankYouPageProps) {
    
    const pgInfo: { position: [number, number] } = {
        position: [latitude, longitude],
    }
    return (
        <div className="min-h-screen w-full bg-gray-50 flex justify-center py-10 px-4">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* LEFT SECTION */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <h1 className="text-2xl font-semibold text-gray-800">Thank you for your booking!</h1>
                    </div>

                    <p className="text-gray-600 mb-6">
                        Congratulations! Your booking has been confirmed.
                    </p>

                    <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                        <Map pgInfo={pgInfo} showAdditionalSettings={false}/>
                    </div>

                    {/* USER DETAILS */}
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Customer Details</h2>
                        <div className="space-y-2 text-gray-700 text-sm">
                            <p><span className="font-medium">Name:</span> {checkoutInfo?.customer_details?.name}</p>
                            <p><span className="font-medium">Email:</span> {checkoutInfo?.customer_details?.email}</p>
                            {/* <p><span className="font-medium">Address:</span> 123 Street, City, Country</p> */}
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex flex-col gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-8 h-fit">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Room Details</h2>

                    <div className="space-y-4">
                        {/* ITEM */}
                        <div className="flex items-center gap-3 border rounded-xl p-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                            <div className="flex-grow">
                                <p className="font-medium text-gray-800">Room A</p>
                                <p className="text-gray-500 text-sm">1 night</p>
                            </div>
                            <p className="font-medium text-gray-800">$120</p>
                        </div>

                        {/* Summary */}
                        <div className="pt-4 border-t text-sm text-gray-700 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>$120</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>$0</span>
                            </div>
                            <div className="flex justify-between font-semibold text-base pt-2 border-t">
                                <span>Total</span>
                                <span>$120</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Link href="/" className="text-blue-600 underline flex flex-row items-center justify-center gap-2 transition-all transform duration-200 hover:text-blue-700 hover:scale-105 hover:gap-3"><span>Go to Home Page</span><ArrowRight/></Link>
                </div>

            </div>
        </div>
    );
}