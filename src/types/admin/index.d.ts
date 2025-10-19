export interface NavItemsType {
    title: string;
    path: string;
    icon: string;
    disabled?: boolean; 
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