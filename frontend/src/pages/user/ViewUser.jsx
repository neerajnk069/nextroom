import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    if (!token) {
      setError("Unauthorized! Please login.");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8000/api/viewUser/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setUser(res.data.body);
      } else {
        setError("User not found");
      }
    } catch (err) {
      console.log("Fetch User Error:", err);
      setError("API Error");
    }
  };

  useEffect(() => {
    if (!id) {
      setError("User ID missing");
      return;
    }
    fetchUser();
  }, [id]);

  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;
  if (!user) return <h3>Loading user...</h3>;

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>View User</h5>
          <Link to="/userList" className="btn btn-primary btn-sm text-white">
            Back
          </Link>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <label className="fw-bold">Image:</label>
            <br />
            <img
              src={
                user.image
                  ? `http://localhost:8000/uploads/${user.image}`
                  : "https://via.placeholder.com/50"
              }
              alt="user"
              width="80"
              height="80"
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          </div>

          <p>
            <strong>Name:</strong> {user.firstName + " " + user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phoneNumber}
          </p>
          <p>
            <strong>Status:</strong> {user.status ? "Active" : "Inactive"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
