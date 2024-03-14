import { toastErr, toastInfo } from "./toast";

export const catchErr = (err: { code?: string }) => {
  const { code } = err;
  if (code === "auth/invalid-email") toastErr("Invalid Email");
  else if (code === "auth/wrong-password") toastErr("Invalid Password");
  else if (code === "auth/weak-password")
    toastErr("Password must be at least 6 characters");
  else if (code === "auth/user-not-found") toastErr("User not found");
  else if (code === "auth/email-already-in-use")
    toastErr("Email Already Exists");
  else if (code === "auth/requires-recent-login")
    toastInfo("Logout and login before updating your profile");
  else if (code === "unavailable") toastErr("Firebase is Offline");
  else if (code === "auth/invalid-login-credentials")
    toastErr("Invalid Credentials");
  else toastErr("An Error Occured");
};

export default catchErr;
