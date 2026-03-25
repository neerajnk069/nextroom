import React, { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    }

    if (
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async () => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/changePassword",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert(response.data.message);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(response.data.message || "Error");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Server Error");
    }
    setLoading(false);
  };
  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <div className="title-box mb-3 pb-1">
            <h4 className="mb-0 page-title">Change Password</h4>
            <nav aria-label="breadcrumb" className="mt-1">
              <ol className="breadcrumb align-items-center mb-0">
                <li className="breadcrumb-item">
                  <a href="/dashboard">
                    <i className="ri-home-4-fill me-1"></i> Home
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <span>
                    <i className="ri-settings-3-line me-1"></i> Settings
                  </span>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Change Password
                </li>
              </ol>
            </nav>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <div className="text-center mb-4">
                    <img
                      src="assets/images/keyimg.png"
                      alt="Change Password"
                      style={{ width: "200px" }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="mb-1 fw-medium">Current Password</label>
                    <div className="position-relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        name="currentPassword"
                        className="form-control"
                        placeholder="Current password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                      />
                      <i
                        className={`ri-eye${
                          showPassword.current ? "" : "-off"
                        }-fill`}
                        onClick={() => togglePassword("current")}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      ></i>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="mb-1 fw-medium">New Password</label>
                    <div className="position-relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        className="form-control"
                        placeholder="New password"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                      <i
                        className={`ri-eye${
                          showPassword.new ? "" : "-off"
                        }-fill`}
                        onClick={() => togglePassword("new")}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      ></i>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="mb-1 fw-medium">Confirm Password</label>
                    <div className="position-relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <i
                        className={`ri-eye${
                          showPassword.confirm ? "" : "-off"
                        }-fill`}
                        onClick={() => togglePassword("confirm")}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      ></i>
                    </div>
                  </div>

                  <div className="text-end mb-2">
                    <button
                      className="btn btn-primary px-4"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? "Changing..." : "Change Password"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
