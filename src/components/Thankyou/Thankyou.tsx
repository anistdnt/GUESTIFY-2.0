"use client";
import { ArrowRight, Calendar, CheckCircle, Clock, Download, Mailbox, MapPin, User } from "@phosphor-icons/react";
import { CurrencyInr } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function ThankYouPage({ checkoutInfo, latitude, longitude }: ThankYouPageProps) {

  const router = useRouter();

  const pgInfo: { position: [number, number] } = {
    position: [latitude, longitude],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg">
                <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={2.5} />
              </div>

              <h1 className="text-4xl font-bold mb-3">Booking Confirmed!</h1>
              <p className="text-green-50 text-lg max-w-md mx-auto">
                Your reservation has been successfully confirmed. Get ready for an amazing experience!
              </p>

              {checkoutInfo?.id && (
                <div className="mt-6 inline-block bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20">
                  <span className="text-sm font-medium">Booking ID: {checkoutInfo.id.slice(-8).toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Guest Information
                  </h2>
                  <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Full Name</p>
                        <p className="text-gray-900 font-medium">{checkoutInfo?.customer_details?.name || 'Guest'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mailbox className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Email Address</p>
                        <p className="text-gray-900 font-medium">{checkoutInfo?.customer_details?.email || 'email@example.com'}</p>
                      </div>
                    </div>

                    {checkoutInfo?.customer_details?.phone && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Phone</p>
                          <p className="text-gray-900 font-medium">{checkoutInfo.customer_details.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Booking Details
                  </h2>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 space-y-3 border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        <Image
                          src={checkoutInfo?.room_info?.image}
                          alt="Room"
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Room Type</p>
                        <p className="font-semibold text-gray-900 text-lg">{checkoutInfo?.room_info?.room_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Duration</span>
                      </div>
                      <span className="font-medium text-gray-900">1 Year</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Location
                  </h2>
                  <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center overflow-hidden">
                    <Map pgInfo={pgInfo} showAdditionalSettings={false} />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Room Charges</span>
                    <span className="flex items-center gap-1 font-medium text-gray-900">
                      <CurrencyInr className="w-4 h-4" />
                      {((checkoutInfo?.amount_total || 0) / 100).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Taxes & Fees</span>
                    <span className="flex items-center gap-1 font-medium text-gray-900">
                      <CurrencyInr className="w-4 h-4" />
                      0
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Paid</span>
                      <span className="text-2xl font-bold text-green-600 flex items-center gap-1">
                        <CurrencyInr className="w-6 h-6" />
                        {((checkoutInfo?.amount_total || 0) / 100).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {checkoutInfo?.payment_intent?.status && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Payment Status</span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          {checkoutInfo.payment_intent.status}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 group">
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Download Receipt
              </button>

              <button onClick={()=>{router.push("/")}} className="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-xl border-2 border-gray-200 transition-all duration-200 flex items-center justify-center gap-2 group">
                <span>Return to Home</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mt-6">
              <p className="text-center text-gray-700">
                <span className="font-semibold text-gray-900">Confirmation email sent!</span>
                <br />
                <span className="text-sm text-gray-600">
                  We&apos;ve sent a confirmation email to {checkoutInfo?.customer_details?.email || 'your email'} with all the details.
                </span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Need help? Contact our support team at support@example.com
        </p>
      </div>
    </div>
  );
}