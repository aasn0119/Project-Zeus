import logo from "../assets/logo.png";
import Button from "./Button";

type Props = {};

function Header({}: Props) {
  return (
    <div className="drop-shadow-md flex flex-wrap sm:flex-row gap-5 items-center justify-between bg-gradient-to-r from-myBlue to-myPink px-5 py-5 md:py-2 text-white">
      <img
        src={logo}
        alt="Logo"
        className="w-[70px] drop-shadow-md cursor-pointer"
      />
      <Button text="Add new ListBoard" />
    </div>
  );
}

export default Header;
