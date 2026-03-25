import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1199.98) {
        document.body.classList.remove("sidebar-enable");
      }
    };

    const handleMenuClick = (e) => {
      e.preventDefault();
      document.body.classList.toggle("sidebar-enable");

      if (window.innerWidth >= 1200) {
        document.body.classList.toggle("vertical-collpsed");
      } else {
        document.body.classList.remove("vertical-collpsed");
      }
    };

    const handleHideMenu = () => {
      document.body.classList.remove("sidebar-enable");
    };

    const handleHoverIn = () => {
      if (window.innerWidth >= 1200) {
        document.body.classList.add("hovered");
      }
    };

    const handleHoverOut = () => {
      document.body.classList.remove("hovered");
    };

    const menuBtn = document.querySelector(".vertical-menu-btn");
    const hideBtns = document.querySelectorAll(
      ".hide-menu-btn, .sidebar-overlay"
    );
    const verticalMenu = document.querySelector(".vertical-menu");

    window.addEventListener("resize", handleResize);
    if (menuBtn) menuBtn.addEventListener("click", handleMenuClick);
    hideBtns.forEach((btn) => btn.addEventListener("click", handleHideMenu));

    if (verticalMenu && window.innerWidth >= 1200) {
      verticalMenu.addEventListener("mouseenter", handleHoverIn);
      verticalMenu.addEventListener("mouseleave", handleHoverOut);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (menuBtn) menuBtn.removeEventListener("click", handleMenuClick);
      hideBtns.forEach((btn) =>
        btn.removeEventListener("click", handleHideMenu)
      );
      if (verticalMenu) {
        verticalMenu.removeEventListener("mouseenter", handleHoverIn);
        verticalMenu.removeEventListener("mouseleave", handleHoverOut);
      }
    };
  }, []);

  return (
    <div id="layout-wrapper">
      <Navbar />
      <Sidebar />
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
