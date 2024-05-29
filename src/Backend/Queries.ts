import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
} from "@firebase/auth";
import { auth, db } from "./Firebase";
import { toastErr, toastSucc } from "../utils/toast";
import CatchErr from "../utils/catchErr";
import {
  authDataType,
  chatType,
  messageType,
  setLoadingType,
  taskListType,
  taskType,
  userType,
} from "../Types";
import { NavigateFunction } from "react-router";
import {
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  or,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "@firebase/firestore";
import {
  defaultUser,
  setAlertProps,
  setUser,
  setUsers,
  userStorageName,
} from "../Redux/userSlice";
import { AppDispatch } from "../Redux/store";
import ConvertTime from "../utils/ConvertTime";
import AvatarGenerator from "../utils/avatarGenerator";

// collection names
const usersColl = "users";

// register or signup a user
export const BE_signUp = (
  data: authDataType,
  setLoading: setLoadingType,
  reset: () => void,
  goTo: NavigateFunction,
  dispatch: AppDispatch
) => {
  const { email, password, confirmPassword } = data;

  // loading true
  setLoading(true);

  if (email && password) {
    if (password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async ({ user }) => {
          // generate user avatar with username
          const imgLink = AvatarGenerator(user.email?.split("@")[0]);

          const userInfo = await addUserToCollection(
            user.uid,
            user.email || "",
            user.email?.split("@")[0] || "",
            imgLink
          );

          // set user in store
          dispatch(setUser(userInfo));

          setLoading(false);
          reset();
          goTo("/dashboard");
        })
        .catch((err) => {
          CatchErr(err);
          setLoading(false);
        });
    } else toastErr("Passwords must match!", setLoading);
  } else toastErr("Fields shouldn't be left empty!", setLoading);
};

// sign in a user
export const BE_signIn = (
  data: authDataType,
  setLoading: setLoadingType,
  reset: () => void,
  goTo: NavigateFunction,
  dispatch: AppDispatch
) => {
  const { email, password } = data;

  // loading true
  setLoading(true);

  signInWithEmailAndPassword(auth, email, password)
    .then(async ({ user }) => {
      //update user isOnline to true
      await updateUserInfo({ id: user.uid, isOnline: true });

      // get user info
      const userInfo = await getUserInfo(user.uid);

      // set user in store
      dispatch(setUser(userInfo));

      setLoading(false);
      reset();
      goTo("/dashboard");
    })
    .catch((err) => {
      CatchErr(err);
      setLoading(false);
    });
};

// signout
export const BE_signOut = (
  dispatch: AppDispatch,
  goTo: NavigateFunction,
  setLoading: setLoadingType,
  deleteAcc?: boolean
) => {
  setLoading(true);
  // logout in firebase
  signOut(auth)
    .then(async () => {
      // set user offline
      if (!deleteAcc) await updateUserInfo({ isOffline: true });

      // set currentSelected user to empty user
      dispatch(setUser(defaultUser));

      // remove from local storage
      localStorage.removeItem(userStorageName);

      // route to auth page
      goTo("/auth");

      setLoading(false);
    })
    .catch((err) => CatchErr(err));
};

// get user from local storage
export const getStorageUser = () => {
  const usr = localStorage.getItem(userStorageName);
  if (usr) return JSON.parse(usr);
  else return "";
};

// save user profile
export const BE_saveProfile = async (
  dispatch: AppDispatch,
  data: { email: string; username: string; password: string; img: string },
  setLoading: setLoadingType
) => {
  setLoading(true);

  const { email, username, password, img } = data;
  const id = getStorageUser().id;

  if (id) {
    // update email if present
    if (email && auth.currentUser) {
      updateEmail(auth.currentUser, email)
        .then(() => {
          toastSucc("Email updated successfully!");
        })
        .catch((err) => CatchErr(err));
    }

    // update passsword if present
    if (password && auth.currentUser) {
      updatePassword(auth.currentUser, password)
        .then(() => {
          toastSucc("Password updated successfully!");
        })
        .catch((err) => CatchErr(err));
    }

    // update user collection only if username or img is present
    if (username || img) {
      await updateUserInfo({ username, img });
      toastSucc("Updated profile successfully!");
    }

    // get user latest info
    const userInfo = await getUserInfo(id);

    // update user in state or store
    dispatch(setUser(userInfo));
    setLoading(false);
  } else toastErr("BE_saveProfile: id not found");
};

// delete account

// get all users
export const BE_getAllUsers = async (
  dispatch: AppDispatch,
  setLoading: setLoadingType
) => {
  setLoading(true);

  // get all users except the current signin one, those online ontop
  const q = query(collection(db, usersColl), orderBy("isOnline", "desc"));
  onSnapshot(q, (usersSnapshot) => {
    let users: userType[] = [];

    usersSnapshot.forEach((user) => {
      const { img, isOnline, username, email, bio, creationTime, lastSeen } = user.data();
      users.push({
        id: user.id,
        img,
        isOnline,
        username,
        email,
        bio,
        creationTime: creationTime
          ? ConvertTime(creationTime.toDate())
          : "no date yet: all users creation time",
        lastSeen: lastSeen
          ? ConvertTime(lastSeen.toDate())
          : "no date yet: all users lastseen",
      });
    });

    // take out the current user
    const id = getStorageUser().id;
    if (id) {
      dispatch(setUsers(users.filter((u) => u.id !== id)));
    }
    setLoading(false);
  });
};

// get user information
export const getUserInfo = async (
  id: string,
  setLoading?: setLoadingType
): Promise<userType> => {
  if (setLoading) setLoading(true);
  const userRef = doc(db, usersColl, id);
  const user = await getDoc(userRef);

  if (user.exists()) {
    const { img, isOnline, username, email, bio, creationTime, lastSeen } = user.data();

    if (setLoading) setLoading(false);

    return {
      id: user.id,
      img,
      isOnline,
      username,
      email,
      bio,
      creationTime: creationTime
        ? ConvertTime(creationTime.toDate())
        : "no date yet: userinfo",
      lastSeen: lastSeen ? ConvertTime(lastSeen.toDate()) : "no date yet: userinfo",
    };
  } else {
    if (setLoading) setLoading(false);
    toastErr("getUserInfo: user not found");
    return defaultUser;
  }
};

// add user to collection
const addUserToCollection = async (
  id: string,
  email: string,
  username: string,
  img: string
) => {
  // create user with userId
  await setDoc(doc(db, usersColl, id), {
    isOnline: true,
    img,
    username,
    email,
    creationTime: serverTimestamp(),
    lastSeen: serverTimestamp(),
    bio: `Hi! my name is ${username}, thanks to Desmond I understand React and Typescript now, and I'm confortable working with them. I can also build beautiful user interfaces`,
  });

  return getUserInfo(id);
};

// update user info
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
  if (!id) {
    id = getStorageUser().id;
  }

  // {username} // ...{username} = username
  // username ? {username} : null
  // username && {username}

  if (id) {
    await updateDoc(doc(db, usersColl, id), {
      ...(username && { username }),
      ...(isOnline && { isOnline }),
      ...(isOffline && { isOnline: false }),
      ...(img && { img }), // img:"someimage"
      lastSeen: serverTimestamp(),
    });
  }
};
