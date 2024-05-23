import React from "react";
import { Outlet } from "react-router";

type Props = {};

function Layout({}: Props) {
  return (
    <div className="h-[100vh] flex flex-col">
      {/* <Header /> */}
      Header
      <div className="bg-pattern flex-1 max-h-[90%] overflow-y-scroll">
        <Outlet />
      </div>
      {/* <Alert /> */}
    </div>
  );
}

export default Layout;
