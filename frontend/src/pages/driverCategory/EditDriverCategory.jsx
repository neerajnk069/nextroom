import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const EditDriverCategory = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const id = state?.id;

  const [preview, setPreview] = useState("");
  const [driverCategory, setDriverCategory] = useState({
    name: "",
    status: "",
    image: "",
  });

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const fetchDriverCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/viewDriverCategory",
        { id }
      );

      if (response.data.success && response.data.body) {
        setDriverCategory(response.data.body);
        setErrors({});
      } else {
        setErrors({ api: "DriverCategory not found" });
      }
    } catch (err) {
      setErrors({ api: "API Error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDriverCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDriverCategory((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let temp = {};

    if (!driverCategory.name.trim()) temp.name = "Name is required";
    if (!driverCategory.status) temp.status = "Status is required";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", driverCategory.name);
      formData.append("status", driverCategory.status);

      if (image) formData.append("image", image);

      const res = await axios.post(
        "http://localhost:8000/api/updateDriverCategory",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        setSuccess(res.data.message);
        setErrors({});
        alert(res.data.message);
        navigate("/driverCategory");
      } else {
        setErrors({ api: res.data.message });
      }
    } catch (err) {
      setErrors({ api: "Error updating category" });
    }
  };

  const handleReset = () => {
    setDriverCategory({
      name: "",
      status: "",
      image: "",
    });
    setErrors({});
  };

  if (loading) return <h3>Loading driverCategory...</h3>;
  if (errors.api) return <h3 style={{ color: "red" }}>{errors.api}</h3>;

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Edit DriverCategory</h5>
          <Link
            to="/driverCategory"
            className="btn btn-primary btn-sm text-white"
          >
            Back
          </Link>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label>Image</label>
              <input
                type="file"
                className="form-control border-bottom"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }}
              />

              {driverCategory.image && !image && (
                <img
                  src={
                    driverCategory.image.startsWith("http")
                      ? driverCategory.image
                      : `http://localhost:8000/uploads/${driverCategory.image
                          .split("/")
                          .pop()}`
                  }
                  alt="driverCategory"
                  width="80"
                  height="80"
                  style={{
                    marginTop: "10px",
                    borderRadius: "5px",
                    objectFit: "cover",
                  }}
                />
              )}

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  width="80"
                  height="80"
                  style={{
                    marginTop: "10px",
                    borderRadius: "5px",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>

            <div className="form-group mb-4">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={driverCategory.name}
                onChange={(e) => {
                  let value = e.target.value
                    .replace(/^\s+/g, "")
                    .replace(/\s{2,}/g, " ");

                  setDriverCategory((prev) => ({
                    ...prev,
                    name: value,
                  }));

                  setErrors((prev) => ({
                    ...prev,
                    name: "",
                  }));
                }}
                className={`form-control border-bottom ${
                  errors.name ? "is-invalid" : ""
                }`}
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </div>

            <div className="form-group mb-4">
              <label>Status</label>
              <select
                className={`form-control ${errors.status ? "is-invalid" : ""}`}
                name="status"
                value={driverCategory.status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="1">Inactive</option>
                <option value="2">Active</option>
              </select>
              {errors.status && (
                <small className="text-danger">{errors.status}</small>
              )}
            </div>

            <div className="row">
              <div className="col-sm-6 d-grid">
                <button type="submit" className="btn btn-primary text-white">
                  Submit
                </button>
              </div>
              <div className="col-sm-6 d-grid">
                <button
                  type="button"
                  className="btn btn-warning text-white"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDriverCategory;
