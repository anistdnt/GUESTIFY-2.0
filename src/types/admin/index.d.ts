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