import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthContext } from "../user/Authcontext";

function Template(props) {
  const { user, profile, logoutUser } = useAuthContext();

  const handleChangeNav = () => {
    // Define navigation change logic if needed
    console.log("Navigation changed");
  };

  return (
    <>
      <Header
        user={user}
        profile={profile}
        changeNav={handleChangeNav}
        logoutUser={logoutUser}
      />
      <main>
        {/* If you’re using react-router-dom’s Outlet, props.children might not be necessary */}
        <Outlet />
      
      </main>
      <Content>{props.children}</Content>
      <Footer />
    </>
  );
}

export default Template;
