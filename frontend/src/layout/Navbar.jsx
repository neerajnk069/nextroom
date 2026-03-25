import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchAdminProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/adminProfile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin(res.data.body);
    } catch (err) {
      console.log("Admin profile error:", err);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/getNotification", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.body);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
    setLoading(false);
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/markRead",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };
  const clearNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8000/api/clearNotification",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications([]);
    } catch (err) {
      console.error("Clear notification error:", err);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center" id="nav-first">
            <button
              type="button"
              className="btn btn-sm vertical-menu-btn"
              onClick={toggleSidebar}
            >
              <i className="fe-menu" />
            </button>
            <Link to="/" className="new-logo">
              <img src="assets/images/logo-new.png" alt="Logo" />
            </Link>
          </div>
        </div>

        <div className="d-flex align-items-center">
          {/* Notifications */}
          <div className="d-inline-block ms-1 position-relative">
            <button
              type="button"
              className="btn header-item noti-icon"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fe-bell" />
              {unreadCount > 0 && (
                <span
                  className="badge rounded-pill"
                  style={{
                    background: "#EB5757",
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            <ul className="dropdown-menu py-0 mobcdrop dropdown-menu-end">
              {/* Notification Header */}
              <div className="noti-head py-3 px-3 d-flex justify-content-between align-items-center">
                <div className="fw-medium fs-5">Notifications</div>
                <Link
                  to="#"
                  className="text-decoration-none"
                  onClick={clearNotifications}
                >
                  Clear All
                </Link>
              </div>

              {/* Notification List */}
              <div className="noti-body">
                {loading ? (
                  <p className="text-center my-2">Loading...</p>
                ) : notifications.length === 0 ? (
                  <p className="text-center my-2">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <li
                      key={n._id}
                      className={`dropdown-item ${!n.isRead ? "bg-light" : ""}`}
                    >
                      <b>{n.title}</b>
                      <p className="mb-0">{n.message}</p>
                      <small className="text-muted">
                        {new Date(n.createdAt).toLocaleString()}
                      </small>
                    </li>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="noti-bottom py-2 px-3 text-center">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={markAllAsRead}
                >
                  View All Notifications{" "}
                  <i className="ri-arrow-right-line align-middle ms-2" />
                </button>
              </div>
            </ul>
          </div>

          {/* Profile Dropdown */}
          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item waves-effect d-flex align-items-center"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <img
                className="header-profile-user"
                src={
                  admin.image
                    ? `http://localhost:8000/uploads/${admin.image}`
                    : "assets/images/users/avatar-4.jpg"
                }
                alt="Header Avatar"
              />
              <div className="text-start d-none d-xl-inline-block ms-2 me-2">
                <span className="fw-medium font-size-15 nsuser">
                  {admin?.firstName} {admin?.lastName}
                  <i className="uil-angle-down namearr" />
                </span>
                <small className="text-muted d-block">
                  {admin?.role === 0 ? "Admin" : ""}
                </small>
              </div>
            </button>

            <div className="dropdown-menu pt-3 pb-2 dropdown-menu-end dropdown-profile">
              <div className="innerdrop">
                <div className="px-3 pb-1">
                  <div className="font-size-14 text-muted mb-2">
                    <span className="fw-medium me-1">Welcome</span>{" "}
                    <small className="font-size-13">(Admin)</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        admin.image
                          ? `http://localhost:8000/uploads/${admin.image}`
                          : "assets/images/users/avatar-4.jpg"
                      }
                      width={70}
                      height={70}
                      style={{ borderRadius: "100px" }}
                      alt=""
                    />
                    <div className="ms-3">
                      <div
                        className="fw-semibold usprname"
                        style={{ lineHeight: "1.3" }}
                      >
                        {admin?.firstName} {admin?.lastName}
                      </div>
                      <div className="text-lowdark pb-1 usprmail">
                        {admin?.email}
                      </div>
                      <Link to="/editAdminProfile">Edit Profile</Link>
                    </div>
                  </div>
                </div>

                <div className="dropplink font-size-15 mt-2">
                  <Link
                    className="d-block text-lowdark pb-2 ps-3 pt-2"
                    onClick={async () => {
                      try {
                        await axios.post(
                          "http://localhost:8000/api/logout",
                          {},
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                      } catch (error) {
                        console.error("Logout API Error:", error);
                      }
                      localStorage.clear();
                      navigate("/login", { replace: true });
                    }}
                    style={{ borderTop: "1px solid #e9ecf0" }}
                  >
                    <i className="ri-shut-down-line align-middle me-1 font-size-17" />
                    <span className="font-size-15">Logout</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
