export interface ProfileType {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  mother_tongue: string | null;
  gender: string | null;
  address: string | null;
  district: string | null;
  pincode: number | null;
  image_url: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  is_admin?: boolean;
  wishlist?: String[];
}
