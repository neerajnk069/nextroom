import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const isExact = (path) => location.pathname === path;
  const isStarts = (path) => location.pathname.startsWith(path);

  const isDriverManagement = () => isExact("/driverList");
  const isDriverCategory = () => isExact("/driverCategory");
  const isDriverSubCategory = () => isExact("/driverSubCategory");

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  useEffect(() => {
    if (isDriverManagement()) setOpenMenu("drivers");
    else if (isDriverCategory()) setOpenMenu("category");
    else if (isDriverSubCategory()) setOpenMenu("subCategory");
    else if (isStarts("/user")) setOpenMenu("users");
    else if (isStarts("/employee")) setOpenMenu("staff");
    else if (isStarts("/booking")) setOpenMenu("booking");
    else if (
      ["/aboutUs", "/privacyPolicy", "/termsCondition", "/contactUs"].includes(
        location.pathname
      )
    )
      setOpenMenu("cms");
    else if (isStarts("/faq")) setOpenMenu("faq");
    else if (isStarts("/changePassword")) setOpenMenu("settings");
    else setOpenMenu(null);
  }, [location.pathname]);

  return (
    <div className="vertical-menu">
      <div className="navbar-brand-box">
        <Link to="/dashboard" className="logo">
          <span className="logo-lg">
            <img src="/assets/images/logo.png" alt="" height="20" />
          </span>
        </Link>
      </div>

      <div className="sidebar-menu-scroll mt-1">
        <div id="sidebar-menu">
          <ul className="list-unstyled" id="side-menu">
            {/* Dashboard */}
            <li>
              <Link
                to="/dashboard"
                className={isExact("/dashboard") ? "active" : ""}
              >
                <i className="ri-pie-chart-2-fill"></i>
                <span>Dashboard</span>
              </Link>
            </li>

            {/* Driver Management */}
            <li>
              <a
                className={`has-arrow ${isDriverManagement() ? "active" : ""}`}
                onClick={() => toggleMenu("drivers")}
                style={{ cursor: "pointer" }}
              >
                <i className="ri-taxi-line"></i>
                <span>Driver Management</span>
              </a>

              {openMenu === "drivers" && (
                <ul className="sub-menu">
                  <li>
                    <Link
                      to="/driverList"
                      className={isExact("/driverList") ? "active" : ""}
                    >
                      Driver List
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Driver Category */}
            <li>
              <a
                className={`has-arrow ${isDriverCategory() ? "active" : ""}`}
                onClick={() => toggleMenu("category")}
                style={{ cursor: "pointer" }}
              >
                <i className="ri-steering-2-line"></i>
                <span>Driver Category</span>
              </a>

              {openMenu === "category" && (
                <ul className="sub-menu">
                  <li>
                    <Link
                      to="/driverCategory"
                      className={isExact("/driverCategory") ? "active" : ""}
                    >
                      Driver Category
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Driver SubCategory */}
            <li>
              <a
                className={`has-arrow ${isDriverSubCategory() ? "active" : ""}`}
                onClick={() => toggleMenu("subCategory")}
                style={{ cursor: "pointer" }}
              >
                <i className="ri-layout-grid-line"></i>
                <span>Driver SubCategory</span>
              </a>

              {openMenu === "subCategory" && (
                <ul className="sub-menu">
                  <li>
                    <Link
                      to="/driverSubCategory"
                      className={isExact("/driverSubCategory") ? "active" : ""}
                    >
                      Driver SubCategory
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Users */}
            <li>
              <a
                className={`has-arrow ${isStarts("/user") ? "active" : ""}`}
                onClick={() => toggleMenu("users")}
                style={{ cursor: "pointer" }}
              >
                <i className="ri-group-2-line"></i>
                <span>User Management</span>
              </a>

              {openMenu === "users" && (
                <ul className="sub-menu">
                  <li>
                    <Link
                      to="/userList"
                      className={isExact("/userList") ? "active" : ""}
                    >
                      User List
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Staff */}
            <li>
              <a
                className={`has-arrow ${isStarts("/employee") ? "active" : ""}`}
                onClick={() => toggleMenu("staff")}
                style={{ cursor: "pointer" }}
              >
                <i className="ri-team-line"></i>
                <span>Staff Management</span>
              </a>

              {openMenu === "staff" && (
                <ul className="sub-menu">
                  <li>
                    <Link
                      to="/employeeList"
                      className={isExact("/employeeList") ? "active" : ""}
                    >
                      Staff List
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Booking */}
            <li>
              <a
                className={`has-arrow waves-effect ${
                  isStarts("/booking") ? "active" : ""
                }`}
                onClick={() => toggleMenu("booking")}
                style={{ cursor: "pointer" }}
              >
                <i className="ri-file-list-3-line"></i>
                <span>Booking Details</span>
              </a>

              {openMenu === "booking" && (
                <ul className="sub-menu">
                  <li>
                    <Link
                      to="/bookingList"
                      className={isStarts("/bookingList") ? "active" : ""}
                    >
                      Booking List
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {/* CMS */}
            <li>
              <a
                className={`has-arrow waves-effect ${
                  isStarts("/aboutUs") ||
                  isStarts("/privacy") ||
                  isStarts("/terms")
                    ? "active"
                    : ""
                }`}
                onClick={() => toggleMenu("cms")}
                style={{ cursor: "pointer" }}
              >
                <i className="ri-file-text-line"></i>
                <span>CMS</span>
              </a>

              {openMenu === "cms" && (
                <ul className="sub-menu">
                  <li>
                    <Link to="/aboutUs">About Us</Link>
                  </li>
                  <li>
                    <Link to="/privacyPolicy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/termsCondition">Terms & Conditions</Link>
                  </li>
                </ul>
              )}
            </li>

            {/* faq */}
            <li>
              <a
                className={`has-arrow ${isStarts("/faq") ? "active" : ""}`}
                onClick={() => toggleMenu("faq")}
                style={{ cursor: "pointer" }}
              >
                <i className="ri-information-line"></i>
                <span>FAQs</span>
              </a>

              {openMenu === "faq" && (
                <ul className="sub-menu">
                  <li>
                    <Link
                      to="/faq"
                      className={isStarts("/faq") ? "active" : ""}
                    >
                      Faq
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {/* Settings */}
            <li>
              <a
                className={`has-arrow ${
                  isStarts("/changePassword") ? "active" : ""
                }`}
                onClick={() => toggleMenu("settings")}
                style={{ cursor: "pointer" }}
              >
                <i className="ri-settings-3-line"></i>
                <span>Settings</span>
              </a>

              {openMenu === "settings" && (
                <ul className="sub-menu">
                  <li>
                    <Link
                      to="/changePassword"
                      className={isExact("/changePassword") ? "active" : ""}
                    >
                      Change Password
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
