export interface NavItemsType {
    title: string;
    path?: string;
    icon?: string;
    iconEle?: any;
    disabled?: boolean; 
    onClick?: () => void | Promise<void>;
    class?: string;
    children?: NavItemsType[];
}

interface UserInfo {
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  image_url: string | null;
}

export interface GetNotification_Type {
  notification: string
}

export interface Duration {
  year: number;
  month: number;
}

export interface Person {
  _id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  address: string;
  type_of_identity: string;
  identity_id: string;
  image: string;
  identity_image: string;
}

export type NearbyPlaceType =
  | "museum"
  | "park"
  | "medical"
  | "market"
  | "grocery"
  | "cafe";

export interface AttractionPlace {
  _id: string;

  place_name: string;
  address: string;
  description?: string;

  image_url?: string;
  image_id?: string;

  state: string;
  country: string;

  /** Time taken to reach from PG (in minutes) */
  time_taken_minutes: number;

  type: NearbyPlaceType;

  createdBy: string | null;

  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}