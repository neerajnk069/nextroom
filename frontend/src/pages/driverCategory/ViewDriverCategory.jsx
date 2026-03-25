import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewDriverCategory = () => {
  const location = useLocation();

  const id = location.state?.id;

  const [driverCategory, setDriverCategory] = useState(null);
  const [error, setError] = useState("");

  const fetchDriverCategory = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/viewDriverCategory",
        {
          id,
        }
      );

      if (res.data.success) {
        setDriverCategory(res.data.body);
      } else {
        setError("DriverCategory not found");
      }
    } catch (err) {
      setError("API Error");
    }
  };

  useEffect(() => {
    if (!id) {
      setError("DriverCategory ID missing");
      return;
    }
    fetchDriverCategory();
  }, [id]);

  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;
  if (!driverCategory) return <h3>Loading driverCategory...</h3>;

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>View DriverCategory</h5>
          <Link
            to="/driverCategory"
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
                driverCategory.image
                  ? `http://localhost:8000/uploads/${driverCategory.image
                      .split("/")
                      .pop()}`
                  : "https://via.placeholder.com/50"
              }
              alt="driverCategory"
              width="50"
              height="50"
              style={{ borderRadius: "5px", objectFit: "cover" }}
            />
          </div>

          <p>
            <strong>Name:</strong> {driverCategory.name}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {driverCategory.status === 0 ? "Inactive" : "Active"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewDriverCategory;
