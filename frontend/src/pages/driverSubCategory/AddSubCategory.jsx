import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const AddDriverSubCategory = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [driverCategory, setDriverCategory] = useState([]); 

  const [form, setForm] = useState({
    driverCategoryId: "",
    name: "",
    description: "",
    status: "",
  });

  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");

  const fetchDriverCategory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/getAllDriverCategory"
      );
      if (res.data.success) {
        setDriverCategory(res.data.body);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDriverCategory();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (error[id]) {
      setError((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (error.image) {
      setError((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!image) newErrors.image = "Image is required";
    if (!form.driverCategoryId)
      newErrors.driverCategoryId = "DriverCategory is required";
    if (!form.name.trim())
      newErrors.name = "DriverSubCategory name is required";
    if (!form.description) newErrors.description = "Description is required";
    if (!form.status) newErrors.status = "Status is required";

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("driverCategoryId", form.driverCategoryId);
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("status", form.status);
    formData.append("image", image);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/addDriverSubCategory",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        setSuccess("DriverSubCategory added successfully!");
        setForm({
          driverCategoryId: "",
          name: "",
          description: "",
          status: "",
        });
        setImage(null);
        setError({});
        setTimeout(() => navigate("/driverSubCategory"), 1500);
      } else {
        setSuccess("");
        setError({ form: "Failed to add driverSubCategory" });
      }
    } catch (err) {
      setError({ form: "API Error: " + err.message });
      setSuccess("");
    }
  };

  const handleReset = () => {
    setForm({ driverCategoryId: "", name: "", description: "", status: "" });
    setImage(null);
    setError({});
    setSuccess("");
    document.getElementById("imageInput").value = "";
  };

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h5>Add DriverSubCategory</h5>
          <Link
            to="/driverSubCategory"
            className="btn btn-primary btn-sm text-white"
          >
            Back
          </Link>
        </div>

        <div className="card-body">
          {error.form && <p style={{ color: "red" }}>{error.form}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label htmlFor="image" className="mb-2">
                Image
              </label>
              <input
                type="file"
                id="imageInput"
                className={`form-control ${error.image ? "is-invalid" : ""}`}
                onChange={handleImageChange}
              />
              {error.image && (
                <small className="text-danger">{error.image}</small>
              )}
            </div>

            <div className="form-group mb-4">
              <label>Select DriverCategory</label>
              <select
                id="driverCategoryId"
                value={form.driverCategoryId}
                className={`form-control ${
                  error.driverCategoryId ? "border-danger" : ""
                }`}
                onChange={handleChange}
              >
                <option value="">Select DriverCategory</option>
                {driverCategory.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {error.driverCategoryId && (
                <small className="text-danger">{error.driverCategoryId}</small>
              )}
            </div>

            <div className="form-group mb-4">
              <label>DriverSubCategory Name</label>
              <input
                type="text"
                id="name"
                value={form.name}
                className={`form-control ${error.name ? "border-danger" : ""}`}
                onChange={handleChange}
              />
              {error.name && (
                <small className="text-danger">{error.name}</small>
              )}
            </div>

            <div className="form-group mb-4">
              <label>Description</label>
              <input
                type="text"
                id="description"
                value={form.description}
                className={`form-control ${
                  error.description ? "border-danger" : ""
                }`}
                onChange={handleChange}
              />
              {error.description && (
                <small className="text-danger">{error.description}</small>
              )}
            </div>

            <div className="form-group mb-4">
              <label>Status</label>
              <select
                id="status"
                value={form.status}
                className={`form-control ${
                  error.status ? "border-danger" : ""
                }`}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="0">Inactive</option>
                <option value="1">Active</option>
              </select>
              {error.status && (
                <small className="text-danger">{error.status}</small>
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
                  onClick={handleReset}
                  className="btn btn-warning text-white"
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

export default AddDriverSubCategory;
