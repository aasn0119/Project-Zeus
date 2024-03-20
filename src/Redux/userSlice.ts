import { createSlice } from "@reduxjs/toolkit";
import { userType } from "../Backend/type";

export const userStorageName: string = "zeus_user";
export const defaultUser: userType = {
  id: "",
  username: "",
  email: "",
  isOnline: false,
  img: "",
  bio: "",
  creationTime: "",
  lastSeen: "",
};

// Define the initial state for the user slice
const initialState = {
  // user: [],
  currentUser: defaultUser,
  // currentSelectedUser: null,
};

// Define the reducers for the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;

      // Store user in Localstorage...!
      localStorage.setItem(userStorageName, JSON.stringify(user));

      //   set loggedIn User
      state.currentUser = user;
    },
    setUsers: (state, action) => {
      // Set all Users
    },
  },
});

// Export the reducers and the state for the user slice
export const { setUser, setUsers } = userSlice.actions;
export default userSlice.reducer;
