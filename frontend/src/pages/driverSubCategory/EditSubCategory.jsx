import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const EditDriverSubCategory = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const id = state?.id;

  const [preview, setPreview] = useState("");
  const [driverCategory, setDriverCategory] = useState([]);

  const [driverSubCategory, setDriverSubCategory] = useState({
    driverCategoryId: "",
    name: "",
    description: "",
    status: "",
    image: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const fetchDriverCategory = async () => {
    const res = await axios.get(
      "http://localhost:8000/api/getAllDriverCategory"
    );
    if (res.data.success) setDriverCategory(res.data.body);
  };

  const fetchDriverSubCategory = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/viewDriverSubCategory",
        { id }
      );

      if (response.data.success && response.data.body) {
        const data = response.data.body;

        setDriverSubCategory({
          driverCategoryId: data.driverCategoryId?._id,
          name: data.name,
          description: data.description,
          status: String(data.status),
          image: data.image,
        });

        setPreview(`http://localhost:8000/uploads/${data.image}`);
      }
    } catch (err) {
      console.log("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDriverCategory();
      fetchDriverSubCategory();
    }
  }, [id]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setDriverSubCategory({
      ...driverSubCategory,
      [e.target.name]: e.target.value,
    });

    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!driverSubCategory.driverCategoryId)
      newErrors.driverCategoryId = "DriverCategory is required";

    if (!driverSubCategory.name.trim())
      newErrors.name = "DriverSubCategory Name is required";
    if (!driverSubCategory.description)
      newErrors.description = "Description is required";

    if (!driverSubCategory.status === "")
      newErrors.status = "Status is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("driverCategoryId", driverSubCategory.driverCategoryId);
      formData.append("name", driverSubCategory.name);
      formData.append("description", driverSubCategory.description);
      formData.append("status", Number(driverSubCategory.status));

      if (image) formData.append("image", image);

      const res = await axios.post(
        "http://localhost:8000/api/updateDriverSubCategory",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        setSuccess("DriverSubCategory Updated Successfully!");
        setTimeout(() => navigate("/driverSubCategory"), 1200);
      }
    } catch (err) {
      console.log("Update Error:", err);
    }
  };

  const handleReset = () => {
    setDriverSubCategory({
      driverCategoryId: "",
      name: "",
      description: "",
      status: "",
      image: "",
    });
    setPreview("");
    setErrors({});
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h5>Edit DriverSubCategory</h5>
          <Link
            to="/driverSubCategory"
            className="btn btn-primary btn-sm text-white"
          >
            Back
          </Link>
        </div>

        <div className="card-body">
          {success && <p style={{ color: "green" }}>{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label htmlFor="image" className="mb-2">
                Image
              </label>
              <input
                type="file"
                id="image"
                className={`form-control ${errors.image ? "is-invalid" : ""}`}
                onChange={handleImage}
              />
              {errors.image && (
                <small className="text-danger">{errors.image}</small>
              )}
            </div>

            {preview && (
              <div className="mb-3">
                <p>
                  <strong>Image Preview:</strong>
                </p>
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
            <div className="form-group mb-3">
              <label>DriverCategory Name</label>
              <select
                name="driverCategoryId"
                value={driverSubCategory.driverCategoryId}
                onChange={handleChange}
                className={`form-control ${
                  errors.driverCategoryId ? "border-danger" : ""
                }`}
              >
                <option value="">Select DriverCategory</option>
                {driverCategory.map((driverCategory) => (
                  <option key={driverCategory._id} value={driverCategory._id}>
                    {driverCategory.name}
                  </option>
                ))}
              </select>
              {errors.driverCategoryId && (
                <small className="text-danger">{errors.driverCategoryId}</small>
              )}
            </div>

            <div className="form-group mb-3">
              <label>DriverSubCategory Name</label>
              <input
                type="text"
                name="name"
                value={driverSubCategory.name}
                onChange={handleChange}
                className={`form-control ${errors.name ? "border-danger" : ""}`}
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </div>
            <div className="form-group mb-3">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={driverSubCategory.description}
                onChange={handleChange}
                className={`form-control ${
                  errors.description ? "border-danger" : ""
                }`}
              />
              {errors.description && (
                <small className="text-danger">{errors.description}</small>
              )}
            </div>
            <div className="form-group mb-3">
              <label>Status</label>
              <select
                name="status"
                value={driverSubCategory.status}
                onChange={handleChange}
                className={`form-control ${
                  errors.status ? "border-danger" : ""
                }`}
              >
                <option value="">Select Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
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

export default EditDriverSubCategory;
