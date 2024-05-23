import React from "react";
const logo = require("../Assets/logo.png");

const Header = () => {
  return (
    <div className="flex flex-wrap z-10 sm:flex-row gap-5 items-center justify-between drop-shadow-md bg-gradient-to-r from-myBlue to-myPink px-5 py-5 md:py-2 text-white">
      <img className="w-[70px] drop-shadow-md cursor-pointer" src={logo} alt="logo" />
    </div>
  );
};

export default Header;
