import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./Firebase";
import { toastErr } from "../utils/toast";
import catchErr from "../utils/catchErr";
import { authDataType, setloadingType, userType } from "./type";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NavigateFunction } from "react-router-dom";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { defaultUser, setUser } from "../Redux/userSlice";
import { AppDispatch } from "../Redux/store";
import convertTime from "../utils/convertTime";
import AvatarGenerator from "../utils/AvatarGenerator";

// Collection names...!
const usersColl = "users";
const tasksColl = "tasks";
const taskListColl = "taskList";
const chatsColl = "chats";
const messagesColl = "message";

//  Registor or SignUp Authetication...!
export const BE_signup = (
  data: authDataType,
  setLoading: setloadingType,
  reset: () => void,
  goTo: NavigateFunction,
  dispatch: AppDispatch
) => {
  const { email, password, confirmPassword } = data;
  // loading Start...!
  setLoading(true);
  if (email && password) {
    if (password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async ({ user }) => {
          // TODO: create user Img
          const imgLink = AvatarGenerator(user.email?.split("@")[0]);

          const userInfo = await addUserToCollection(
            user.uid,
            user.email || "",
            user.email?.split("@")[0] || "",
            imgLink
          );

          //TODO: Set userinfo into store and in Local Storage
          dispatch(setUser(userInfo));
          setLoading(false);
          reset();
          goTo("/dashboard");
        })
        .catch((err) => {
          catchErr(err);
          setLoading(false);
        });
    } else toastErr("Passwords must match", setLoading);
  } else toastErr("Fields shouldn't be left empty", setLoading);
};

export const BE_signin = (
  data: authDataType,
  setLoading: setloadingType,
  reset: () => void,
  goTo: NavigateFunction,
  dispatch: AppDispatch
) => {
  const { email, password } = data;
  setLoading(true);

  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then(async ({ user }) => {
      //  update User is Online..!
      await updateUserInfo({ id: user.uid, isOnline: true });

      // Get user info..!
      const userInfo = await getUserInfo(user.uid);

      //  set user in store and in local Storage..!
      dispatch(setUser(userInfo));

      setLoading(false);
      reset();
      goTo("/dashboard");
    })
    .catch((err) => {
      catchErr(err);
      setLoading(false);
    });
};

// Add user to Collection...!
const addUserToCollection = async (
  id: string,
  email: string,
  username: string,
  img: string
) => {
  // Create User with userId...!
  await setDoc(doc(db, usersColl, id), {
    isOnline: true,
    img,
    username,
    email,
    creationTime: serverTimestamp(),
    lastSeen: serverTimestamp(),
    bio: `Hi, my name is ${username}, Let's Connect`,
  });

  return getUserInfo(id);
};

//  get user information...!
const getUserInfo = async (id: string): Promise<userType> => {
  const userRef = doc(db, usersColl, id);
  const user = await getDoc(userRef);

  if (user.exists()) {
    const { isOnline, img, username, email, creationTime, lastSeen, bio } =
      user.data();
    return {
      id: user.id,
      isOnline,
      img,
      username,
      email,
      bio,
      creationTime: creationTime
        ? convertTime(creationTime.toDate())
        : "no date yet: user info",
      lastSeen: lastSeen
        ? convertTime(lastSeen.toDate())
        : "no date yet: user info",
    };
  } else {
    toastErr("getUserInfo: user not found");
    return defaultUser;
  }
};

// update user information...!
const updateUserInfo = async ({
  id,
  username,
  img,
  isOnline,
  isOffline,
}: {
  id?: string;
  username?: string;
  img?: string;
  isOnline?: boolean;
  isOffline?: boolean;
}) => {
  if (!id) id = getStorageUser().id;
  if (id) {
    await updateDoc(doc(db, usersColl, id), {
      ...(username && { username }),
      ...(isOnline && { isOnline }),
      ...(isOffline && { isOnline: false }),
      ...(img && { img }),
      lastSeen: serverTimestamp(),
    });
  }
};

const getStorageUser = () => {
  const usr = localStorage.getItem("zeus_user");
  if (usr) return JSON.parse(usr);
  else return null;
};
