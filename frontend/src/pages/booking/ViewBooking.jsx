import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const ViewBooking = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/viewBooking/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBooking(res.data.body));
  }, [id]);

  if (!booking) return <p>Loading...</p>;

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h5>Booking Details</h5>
          <Link to="/bookingList" className="btn btn-sm btn-primary">
            Back
          </Link>
        </div>

        <div className="card-body">
          <p>
            <b>User:</b> {booking.userId?.firstName}
          </p>
          <p>
            <b>Driver:</b> {booking.driverId?.firstName || "Not Assigned"}
          </p>
          <p>
            <b>Vehicle:</b> {booking.vehicleId?.vehicleNumber}
          </p>
          <p>
            <b>Pickup:</b> {booking.pickupLocation}
          </p>
          <p>
            <b>Drop:</b> {booking.dropLocation}
          </p>
          <p>
            <b>Status:</b> {booking.status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewBooking;
