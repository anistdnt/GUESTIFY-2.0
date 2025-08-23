export interface PGInfo {
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
  pg_image_url: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  minRent?: number;
  averageRating?: number | string | null;
  linearDistance?: number | string;
}

export interface Room {
  _id: string;
  room_type: "single" | "double" | string;
  room_image_url: string;
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
