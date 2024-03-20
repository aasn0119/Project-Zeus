import { BsChatFill } from "react-icons/bs";
import logo from "../assets/logo.png";
import AddListBoard from "./AddListBoard";
import Icon from "./Icon";
import { FiList } from "react-icons/fi";
import UserHeaderProfile from "./UserHeaderProfile";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { Link, useNavigate } from "react-router-dom";
import { BE_signOut } from "../Backend/Queries";
import Spinner from "./Spinner";
import { useState } from "react";

type Props = {};

function Header({}: Props) {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const goTo = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const handlerSignOut = async () => {
    BE_signOut(dispatch, goTo, setLogoutLoading);
  };

  return (
    <div className="drop-shadow-md flex flex-wrap sm:flex-row gap-5 items-center justify-between bg-gradient-to-r from-myBlue to-myPink px-5 py-5 md:py-2 text-white">
      <img
        src={logo}
        alt="Logo"
        className="w-[70px] drop-shadow-md cursor-pointer"
      />
      <div className="flex flex-row-reverse md:flex-row items-center justify-center flex-wrap gap-5">
        <AddListBoard />
        <Icon IconName={BsChatFill} ping={true} />
        <Icon IconName={FiList} />
        <div className="group relative">
          <UserHeaderProfile user={currentUser} />
          <div className="hidden group-hover:block absolute p-5 w-full min-w-max">
            <ul className="w-full bg-white overflow-hidden rounded-md text-gray-700 shadow-md">
              <Link
                to="/dashboard/profile"
                className="hover:bg-gray-200 block px-4 py-2"
              >
                Profile
              </Link>
              <p
                onClick={() => !logoutLoading && handlerSignOut()}
                className={`hover:bg-gray-200 flex items-center gap-4 px-4 py-2 `}
              >
                Logout
                {logoutLoading && <Spinner />}
              </p>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
