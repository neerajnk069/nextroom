import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const DriverSubCategory = () => {
  const navigate = useNavigate();

  const [driverSubCategory, setDriverSubCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const pageButtonCount = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDriverSubCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/getAllDriverSubCategory?time=" +
          new Date().getTime()
      );

      console.log("API Response:", response.data);

      if (response.data.success && Array.isArray(response.data.body)) {
        setDriverSubCategory(response.data.body);
        setError("");
      } else {
        setDriverSubCategory([]);
        setError("No driverSubCategory found");
      }
    } catch (err) {
      console.log("Fetch Error:", err);
      setError("API Error");
      setDriverSubCategory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverSubCategory();
  }, []);

  const filteredDriverSubCategory = (driverSubCategory || []).filter((item) => {
    if (!item) return false;
    const term = searchTerm.trim().toLowerCase();
    const name = (item.name || "").toLowerCase();
    const categoryName = (item?.driverCategoryId?.name || "").toLowerCase();

    return name.includes(term) || categoryName.includes(term);
  });

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentDriverSubCategory = filteredDriverSubCategory.slice(
    firstIndex,
    lastIndex
  );
  const totalPages = Math.ceil(filteredDriverSubCategory.length / itemsPerPage);
  const startPage =
    Math.floor((currentPage - 1) / pageButtonCount) * pageButtonCount + 1;

  const endPage = Math.min(startPage + pageButtonCount - 1, totalPages);

  const goToEdit = (id) => {
    navigate(`/driverSubCategory/editDriverSubCategory/${id}`);
  };

  const deleteDriverSubCategory = async (id, name) => {
    Swal.fire({
      title: `Do you want to delete this?`,
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
            "http://localhost:8000/api/deleteDriverSubCategory",
            {
              id,
            }
          );

          setDriverSubCategory(driverSubCategory.filter((u) => u.id !== id));

          Swal.fire("Deleted!", `Deleted successfully.`, "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete driverSubCategory.", "error");
        }
      }
    });
  };
  const viewDriverSubCategory = (id) => {
    navigate("/driverSubCategory/viewDriverSubCategory", { state: { id } });
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
      const res = await axios.post(
        "http://localhost:8000/api/toggleStatusSubCategory",
        {
          id,
          status: newStatus,
        }
      );

      if (res.data.success) {
        fetchDriverSubCategory();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.log("Toggle Error:", err);
    }
  };

  if (loading) return <h3>Loading DriverSubCategory...</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>DriverSubCategory</h5>
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
            to="/driverSubCategory/addDriverSubCategory"
            className="btn btn-primary btn-sm text-white"
          >
            Add driverSubCategory
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
              setCurrentPage(1); 
            }}
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="500">500</option>
          </select>
          entries
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr.no</th>
                  <th>Image</th>
                  <th>Category</th>
                  <th>SubCategory</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentDriverSubCategory.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No driverSubCategory Found
                    </td>
                  </tr>
                ) : (
                  currentDriverSubCategory.map((driverSubCategory, index) => (
                    <tr key={driverSubCategory._id}>
                      <td>{firstIndex + index + 1}</td>
                      <td>
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
                        />
                      </td>
                      <td className="align-middle">
                        {driverSubCategory.driverCategoryId?.name || "N/A"}
                      </td>
                      <td className="align-middle">{driverSubCategory.name}</td>
                      <td className="align-middle">
                        {driverSubCategory.description}
                      </td>
                      <td>
                        <button
                          className={`fs-3 btn btn-sm ${
                            driverSubCategory.status === 1
                              ? "ri-toggle-fill text-success"
                              : "ri-toggle-line text-secondary"
                          }`}
                          onClick={() =>
                            handleToggle(
                              driverSubCategory._id,
                              driverSubCategory.status
                            )
                          }
                        >
                        
                        </button>
                      </td>
                      <td className="align-middle">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() =>
                            navigate(
                              "/driverSubCategory/editDriverSubCategory",
                              {
                                state: { id: driverSubCategory._id },
                              }
                            )
                          }
                        >
                          <i className="ri-edit-line text-white"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger mx-2"
                          onClick={() =>
                            deleteDriverSubCategory(driverSubCategory._id)
                          }
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() =>
                            viewDriverSubCategory(driverSubCategory._id)
                          }
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

export default DriverSubCategory;
