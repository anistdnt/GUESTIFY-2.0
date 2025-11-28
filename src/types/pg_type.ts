export interface PGInfo {
  charge_duration?: string;
  wifi_speed?: string;
  additional_wifi_charges?: number;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  _id: string;
  user_id: string;
  pg_name: string;
  district: string;
  street_name: string;
  house_no: number;
  state: string;
  pincode: number;
  pg_type?: string;
  address: string;
  wifi_available: "yes" | "no";
  food_available: "yes" | "no";
  rules: string;
  pg_images: { pg_image_url: string; pg_image_id: string }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  minRent?: number;
  averageRating?: number | string | null;
  linearDistance?: number | string;
}

export interface Room {
  aminities: string[];
  booked_by?: string | null;
  booking_status?: string;
  _id: string;
  room_type: "single" | "double" | string;
  room_images: { room_image_url: string; room_image_id: string }[];
  room_rent: number;
  ac_available: "yes" | "no";
  attached_bathroom: "yes" | "no";
  deposit_duration: "monthly" | "halfyearly" | string;
  pg_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PGData {
  pginfo: PGInfo;
  rooms: Room[];
}
