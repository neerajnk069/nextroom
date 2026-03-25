import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchEmployee = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/employeeList?time=" + new Date().getTime(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.success && Array.isArray(response.data.body)) {
        setEmployee(response.data.body);
        setError("");
      } else {
        setEmployee([]);
        setError("No employee found");
      }
    } catch (err) {
      console.log("Fetch Error:", err);
      if (err.response && err.response.status === 401) {
        setError("Unauthorized! Please login again.");
      } else {
        setError("API Error");
      }
      setEmployee([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const filteredEmployees = employee.filter((item) => {
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
  const currentEmployees = filteredEmployees.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const deleteEmployee = async (_id, firstName, lastName) => {
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
            "http://localhost:8000/api/deleteEmployee",
            { _id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setEmployee(employee.filter((u) => u._id !== _id));

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

  const viewEmployee = (id) => {
    navigate(`/viewEmployee/${id}`);
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = Number(currentStatus) === 1 ? 0 : 1;

    try {
      const res = await axios.post(
        "http://localhost:8000/api/toggleStatusEmployee",
        { id, status: newStatus }
      );

      if (res.data.success) {
        fetchEmployee();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.log("Toggle Error:", err);
    }
  };

  if (loading) return <h3>Loading Employee...</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Employees</h5>
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
                {currentEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No Employeess Found
                    </td>
                  </tr>
                ) : (
                  currentEmployees.map((employee, index) => (
                    <tr key={employee._id}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={
                            employee.image
                              ? `http://localhost:8000/uploads/${employee.image}`
                              : "https://via.placeholder.com/50"
                          }
                          alt="user"
                          width="50"
                          height="50"
                          style={{ borderRadius: "5px", objectFit: "cover" }}
                        />
                      </td>
                      <td>{employee.firstName + " " + employee.lastName}</td>
                      <td>{employee.email}</td>

                      <td>{employee.phoneNumber}</td>
                      <td>
                        <i
                          className={`fs-3 cursor-pointer ${
                            employee.status === 1
                              ? "ri-toggle-fill text-success"
                              : "ri-toggle-line text-secondary"
                          }`}
                          title={
                            employee.status === 1
                              ? "Active (ON)"
                              : "Inactive (OFF)"
                          }
                          onClick={() =>
                            handleToggle(employee._id, employee.status)
                          }
                        ></i>
                      </td>
                      <td>
                        <i
                          className="ri-eye-line text-info fs-5 mx-2 cursor-pointer"
                          title="View"
                          onClick={() => viewEmployee(employee._id)}
                        />
                        <i
                          className="ri-delete-bin-6-line text-danger fs-5 mx-2 cursor-pointer"
                          title="Delete"
                          onClick={() =>
                            deleteEmployee(
                              employee._id,
                              employee.firstName + " " + employee.lastName
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
