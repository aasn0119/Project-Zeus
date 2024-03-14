export type setloadingType = React.Dispatch<React.SetStateAction<boolean>>;
export type authDataType = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export type userType = {
  id: string;
  isOnline: boolean;
  username: string;
  email: string;
  img: string;
  bio?: string;
  creationTime?: string;
  lastSeen?: string;
};
