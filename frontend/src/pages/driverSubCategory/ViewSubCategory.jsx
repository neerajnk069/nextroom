import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewDriverSubCategory = () => {
  const location = useLocation();

  const id = location.state?.id;

  const [driverSubCategory, setDriverSubCategory] = useState(null);
  const [error, setError] = useState("");

  const fetchDriverSubCategory = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/viewDriverSubCategory",
        {
          id,
        }
      );

      if (res.data.success) {
        setDriverSubCategory(res.data.body);
      } else {
        setError("driverSubCategory not found");
      }
    } catch (err) {
      setError("API Error");
    }
  };

  useEffect(() => {
    if (!id) {
      setError("driverSubCategory ID missing");
      return;
    }
    fetchDriverSubCategory();
  }, [id]);

  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;
  if (!driverSubCategory) return <h3>Loading driverSubCategory...</h3>;

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>View driverSubCategory</h5>
          <Link
            to="/driverSubCategory"
            className="btn btn-primary btn-sm text-white"
          >
            Back
          </Link>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <label className="fw-bold">Image:</label> <br />
            <img
              src={
                driverSubCategory.image
                  ? `http://localhost:8000/uploads/${driverSubCategory.image
                      .split("/")
                      .pop()}`
                  : "https://via.placeholder.com/50"
              }
              alt="driverCategory"
              width="50"
              height="50"
              style={{ borderRadius: "5px", objectFit: "cover" }}
              onClick={() =>
                window.open(
                  `http://localhost:8000/uploads/${driverSubCategory.image}`,
                  "_blank"
                )
              }
            />
          </div>
          <p>
            <strong>Category Name:</strong>{" "}
            {driverSubCategory.driverCategoryId.name}
          </p>
          <p>
            <strong>SubCategory Name:</strong> {driverSubCategory.name}
          </p>
          <p>
            <strong>Description:</strong> {driverSubCategory.description}
          </p>
          <p>
            <strong>Status:</strong>
            {driverSubCategory.status === 1 ? "Active" : "Inactive"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewDriverSubCategory;
