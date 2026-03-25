import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/bookingList", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.body);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, status) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/updateBookingStatus",
        { bookingId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
        );
      }
    } catch (err) {
      console.log("Status Update Error", err);
    }
  };

  const deleteBooking = async (_id, firstName, lastName) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `Do you want to delete "${firstName} ${lastName}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            "http://localhost:8000/api/deleteBooking",
            { _id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setBookings(bookings.filter((u) => u._id !== _id));

          Swal.fire(
            "Deleted!",
            `${firstName} ${lastName} has been deleted.`,
            "success"
          );
        } catch (error) {
          console.log("Delete Error:", error);
          Swal.fire("Error!", "Failed to delete user.", "error");
        }
      }
    });
  };

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header">
          <h5>Booking List</h5>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>User</th>
              <th>Pickup</th>
              <th>Drop</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{index + 1}</td>
                <td>
                  {booking.userId?.firstName + " " + booking.userId?.lastName}
                </td>
                <td>{booking.pickupLocation}</td>
                <td>{booking.dropLocation}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={booking.status}
                    onChange={(e) =>
                      handleStatusChange(booking._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="on_the_way">On The Way</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <i
                    className="ri-eye-line text-info fs-5 cursor-pointer"
                    onClick={() => navigate(`/viewBooking/${booking._id}`)}
                  ></i>
                  <i
                    className="ri-delete-bin-line text-danger fs-5 cursor-pointer"
                    onClick={() =>
                      deleteBooking(
                        booking._id,
                        booking.firstName + " " + booking.lastName
                      )
                    }
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList;
