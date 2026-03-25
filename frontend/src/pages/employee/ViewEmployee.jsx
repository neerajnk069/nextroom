import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchEmployee = async () => {
    if (!token) {
      setError("Unauthorized! Please login.");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8000/api/viewEmployee/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setEmployee(res.data.body);
      } else {
        setError("Employee not found");
      }
    } catch (err) {
      console.log("Fetch Employee Error:", err);
      setError("API Error");
    }
  };

  useEffect(() => {
    if (!id) {
      setError("employee ID missing");
      return;
    }
    fetchEmployee();
  }, [id]);

  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;
  if (!employee) return <h3>Loading employee...</h3>;

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>View employee</h5>
          <Link
            to="/employeeList"
            className="btn btn-primary btn-sm text-white"
          >
            Back
          </Link>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <label className="fw-bold">Image:</label>
            <br />
            <img
              src={
                employee.image
                  ? `http://localhost:8000/uploads/${employee.image}`
                  : "https://via.placeholder.com/50"
              }
              alt="employee"
              width="80"
              height="80"
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          </div>

          <p>
            <strong>Name:</strong>{" "}
            {employee.firstName + " " + employee.lastName}
          </p>
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Phone:</strong> {employee.phoneNumber}
          </p>
          <p>
            <strong>Status:</strong> {employee.status ? "Active" : "Inactive"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
