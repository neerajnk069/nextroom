import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const DriverCategory = () => {
  const navigate = useNavigate();
  const [driverCategory, setDriverCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageButtonCount = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDriverCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/getAllDriverCategory?time=" +
          new Date().getTime()
      );

      console.log("API Response:", response.data);

      if (response.data.success && Array.isArray(response.data.body)) {
        setDriverCategory(response.data.body);
        setError("");
      } else {
        setDriverCategory([]);
        setError("No driverCategory found");
      }
    } catch (err) {
      console.log("Fetch Error:", err);
      setError("API Error");
      setDriverCategory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverCategory();
  }, []);

  const filteredDriverCategory = (driverCategory || []).filter((item) => {
    if (!item) return false;

    const term = searchTerm.trim().toLowerCase();
    const name = (item.name || "").toLowerCase();

    return name.includes(term);
  });

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentDriverCategory = filteredDriverCategory.slice(
    firstIndex,
    lastIndex
  );
  const totalPages = Math.ceil(filteredDriverCategory.length / itemsPerPage);
  const startPage =
    Math.floor((currentPage - 1) / pageButtonCount) * pageButtonCount + 1;

  const endPage = Math.min(startPage + pageButtonCount - 1, totalPages);

  const goToEdit = (id) => {
    navigate(`/driverCategory/editDriverCategory/${id}`);
  };

  const deleteDriverCategory = async (id, name) => {
    Swal.fire({
      title: `Do you want to delete "${name}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post("http://localhost:8000/api/deleteDriverCategory", {
            id,
          });

          setDriverCategory(driverCategory.filter((u) => u._id !== id));

          Swal.fire("Deleted!", `${name} has been deleted.`, "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete categories.", "error");
        }
      }
    });
  };

  const viewDriverCategory = (id) => {
    navigate("/driverCategory/viewDriverCategory", { state: { id } });
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 2 ? 1 : 2;

    try {
      const res = await axios.post("http://localhost:8000/api/toggleStatus", {
        id,
        status: newStatus,
      });

      if (res.data.success) {
        fetchDriverCategory();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.log("Toggle Error:", err);
    }
  };

  if (loading) return <h3>Loading driverCategory...</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Driver Category</h5>
          <div className="d-flex justify-content-between align-items-center px-3 mb-2">
            <input
              type="text"
              className="form-control form-control-sm"
              style={{ width: "250px" }}
              placeholder="Search by category name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); 
              }}
            />
          </div>

          <Link
            to="/driverCategory/addDriverCategory"
            className="btn btn-primary btn-sm text-white"
          >
            Add DriverCategory
          </Link>
        </div>

        <div className="mb-2 px-3">
          Show
          <select
            id="entriesPerPage"
            className="form-control form-control-sm d-inline-block mx-2"
            style={{ width: "auto" }}
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // reset page
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          entries
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentDriverCategory.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No driverCategory Found
                    </td>
                  </tr>
                ) : (
                  currentDriverCategory.map((driverCategory, index) => (
                    <tr key={driverCategory._id}>
                      <td>{firstIndex + index + 1}</td>
                      <td>
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
                      </td>
                      <td>{driverCategory.name}</td>
                      <td>
                        <button
                          className={`btn btn-sm fs-2 ${
                            driverCategory.status === 1
                              ? "ri-toggle-line text-secondary"
                              : "ri-toggle-fill text-success"
                          }`}
                          title={
                            driverCategory.status === 1
                              ? "Inactive (OFF)"
                              : "Active (ON)"
                          }
                          onClick={() =>
                            handleToggle(
                              driverCategory._id,
                              driverCategory.status
                            )
                          }
                        ></button>
                      </td>
                      <td className="align-middle">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() =>
                            navigate("/driverCategory/editDriverCategory", {
                              state: { id: driverCategory._id },
                            })
                          }
                        >
                          <i className="ri-edit-line text-white"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger mx-2"
                          onClick={() =>
                            deleteDriverCategory(driverCategory._id)
                          }
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => viewDriverCategory(driverCategory._id)}
                        >
                          <i className="ri-eye-line"></i>
                        </button>
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

              {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
              ).map((page) => (
                <button
                  key={page}
                  className={`btn btn-sm mx-1 ${
                    currentPage === page ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
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

export default DriverCategory;
