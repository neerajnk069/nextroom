import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [error, setError] = useState("");
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/userList?time=" + new Date().getTime(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.success && Array.isArray(response.data.body)) {
        setUsers(response.data.body);
        setError("");
      } else {
        setUsers([]);
        setError("No users found");
      }
    } catch (err) {
      console.log("Fetch Error:", err);
      if (err.response && err.response.status === 401) {
        setError("Unauthorized! Please login again.");
      } else {
        setError("API Error");
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((item) => {
    if (!item) return false;
    const term = searchTerm.trim().toLowerCase();

    const fullName = `${item?.firstName || ""} ${
      item?.lastName || ""
    }`.toLowerCase();
    const email = (item?.email || "").toLowerCase();
    const phone = String(item?.phoneNumber || "");

    return (
      fullName.includes(term) || email.includes(term) || phone.includes(term)
    );
  });

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentUsers = filteredUsers.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const deleteUser = async (_id, firstName, lastName) => {
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
            "http://localhost:8000/api/deleteUser",
            { _id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUsers(users.filter((u) => u._id !== _id));

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

  const viewUser = (id) => {
    navigate(`/viewUser/${id}`);
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = Number(currentStatus) === 1 ? 0 : 1;

    try {
      const res = await axios.post(
        "http://localhost:8000/api/toggleStatusUser",
        { id, status: newStatus }
      );

      if (res.data.success) {
        fetchUsers();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.log("Toggle Error:", err);
    }
  };

  if (loading) return <h3>Loading Users...</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Users</h5>
          <div className="d-flex justify-content-between align-items-center px-3 mb-2">
            {/* Search */}
            <input
              type="text"
              className="form-control-sm"
              style={{ width: "250px" }}
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>PhoneNumber</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No Users Found
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td>{firstIndex + index + 1}</td>
                      <td>
                        <img
                          src={
                            user.image
                              ? `http://localhost:8000/uploads/${user.image}`
                              : "https://via.placeholder.com/50"
                          }
                          alt="user"
                          width="50"
                          height="50"
                          style={{ borderRadius: "5px", objectFit: "cover" }}
                        />
                      </td>
                      <td>{user.firstName + " " + user.lastName}</td>
                      <td>{user.email}</td>

                      <td>{user.phoneNumber}</td>
                      <td>
                        <i
                          className={`fs-2 cursor-pointer ${
                            user.status === 1
                              ? "ri-toggle-fill text-success"
                              : "ri-toggle-line text-secondary"
                          }`}
                          title={
                            user.status === 1 ? "Active (ON)" : "Inactive (OFF)"
                          }
                          onClick={() => handleToggle(user._id, user.status)}
                        ></i>
                      </td>
                      <td className="align-middle">
                        <i
                          className="ri-eye-line text-info fs-5 mx-2 cursor-pointer"
                          title="View"
                          onClick={() => viewUser(user._id)}
                        />
                        <i
                          className="ri-delete-bin-6-line text-danger fs-5 mx-2 cursor-pointer"
                          title="Delete"
                          onClick={() =>
                            deleteUser(
                              user._id,
                              user.firstName + " " + user.lastName
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-sm btn-secondary mx-1"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm mx-1 ${
                    currentPage === i + 1
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="btn btn-sm btn-secondary mx-1"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
