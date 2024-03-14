// Create various toasts for error, success, warn and info using react-toastify library

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setloadingType } from "../Backend/type";

export const toastErr = (msg: string, setLoading?: setloadingType) => {
  toast.error(msg);
  if (setLoading) setLoading(false);
};

export const toastSucc = (msg: string, setLoading?: setloadingType) => {
  toast.success(msg);
  if (setLoading) setLoading(false);
};

export const toastWarn = (msg: string, setLoading?: setloadingType) => {
  toast.warn(msg);
  if (setLoading) setLoading(false);
};

export const toastInfo = (msg: string, setLoading?: setloadingType) => {
  toast.info(msg);
  if (setLoading) setLoading(false);
};
