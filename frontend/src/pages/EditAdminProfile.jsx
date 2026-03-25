import React, { useState, useEffect } from "react";
import axios from "axios";

const EditAdminProfile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    country: "",
    state: "",
    city: "",
    bio: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:8000/api/adminProfile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setProfile(res.data.body);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleCancel = async () => {
    setEditMode(false);
    setErrors({});

    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8000/api/adminProfile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      setProfile(res.data.body);
    }
    setLoading(false);
  };

  const validate = () => {
    let err = {};

    if (!profile.firstName || profile.firstName.length < 2)
      err.firstName = "First name is required (min 2 characters)";

    if (!profile.lastName || profile.lastName.length < 2)
      err.lastName = "Last name is required (min 2 characters)";

    if (!profile.phoneNumber) err.phoneNumber = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(profile.phoneNumber))
      err.phoneNumber = "Phone number must be 10 digits";

    if (!profile.country) err.country = "Country is required";
    if (!profile.state) err.state = "State is required";
    if (!profile.city) err.city = "City is required";

    if (profile.bio && profile.bio.length < 10)
      err.bio = "Bio must be at least 10 characters";

    if (profile.image instanceof File) {
      const allowed = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowed.includes(profile.image.type)) {
        err.image = "Only JPG / PNG images allowed";
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    const token = localStorage.getItem("token");
    const fd = new FormData();

    Object.keys(profile).forEach((key) => {
      if (key !== "image") fd.append(key, profile[key]);
    });

    if (profile.image instanceof File) {
      fd.append("image", profile.image);
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/editAdminProfile",
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        alert("Profile updated successfully");
        setProfile(res.data.body);
        setEditMode(false);
        setErrors({});
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="main-content">
      <div className="container mt-5">
        <h2>Admin Profile</h2>
        <div className="card p-4">
          <div className="text-center mb-3">
            <img
              src={
                profile.image instanceof File
                  ? URL.createObjectURL(profile.image)
                  : profile.image
                  ? `http://localhost:8000/uploads/${profile.image}`
                  : "https://via.placeholder.com/120"
              }
              width={120}
              height={120}
              className="rounded-circle"
              alt=""
            />
            {editMode && (
              <>
                <input
                  type="file"
                  name="image"
                  className="form-control mt-2"
                  onChange={handleChange}
                />
                {errors.image && (
                  <small className="text-danger">{errors.image}</small>
                )}
              </>
            )}
          </div>

          {[
            ["firstName", "First Name"],
            ["lastName", "Last Name"],
            ["phoneNumber", "Phone"],
            ["country", "Country"],
            ["state", "State"],
            ["city", "City"],
          ].map(([key, label]) => (
            <div className="mb-2" key={key}>
              <label>{label}</label>
              {editMode ? (
                <>
                  <input
                    className="form-control"
                    name={key}
                    value={profile[key] || ""}
                    onChange={handleChange}
                  />
                  {errors[key] && (
                    <small className="text-danger">{errors[key]}</small>
                  )}
                </>
              ) : (
                <p>{profile[key]}</p>
              )}
            </div>
          ))}

          <div className="mb-2">
            <label>Bio</label>
            {editMode ? (
              <>
                <textarea
                  className="form-control"
                  name="bio"
                  value={profile.bio || ""}
                  onChange={handleChange}
                />
                {errors.bio && (
                  <small className="text-danger">{errors.bio}</small>
                )}
              </>
            ) : (
              <p>{profile.bio}</p>
            )}
          </div>

          {!editMode ? (
            <button
              className="btn btn-primary"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button className="btn btn-success w-100" onClick={handleUpdate}>
                Save
              </button>

              <button
                className="btn btn-secondary w-100"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditAdminProfile;
