export interface SignUpFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  mother_tongue: "bengali" | "english" | "hindi";
  gender: "male" | "female" | "other";
  address: string;
  district: string;
  pincode: number;
  image_url?: string;
}

export interface LoginFormData {
  email: string;
  password: string | number | readonly string[] | undefined;
  rememberMe?: boolean;
}
