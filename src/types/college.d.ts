export interface LocationType {
    type: string;
    coordinates: [number, number];
}

export interface CollegeType {
  _id: string;
  college_name: string;
  address: string;
  district: string;
  pincode: number;
  location: LocationType;
  image_url: string;
  popular?: boolean;
}