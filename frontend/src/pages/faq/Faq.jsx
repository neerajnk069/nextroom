import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Faq = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFaqs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("http://localhost:8000/api/faqs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setFaqs(res.data.body);
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      }
    };
    fetchFaqs();
  }, []);

  const viewFaq = (id) => {
    navigate(`/faq/viewFaq/${id}`);
  };
  const editFaq = (id) => {
    navigate(`/faq/editFaq/${id}`);
  };
  const deleteUser = async (_id) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `"Are you sure to delete this FAQ?"?`,
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
            "http://localhost:8000/api/deleteFaq",
            { _id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setFaqs(faqs.filter((u) => u._id !== _id));

          Swal.fire("Deleted!", ` has been deleted.`, "success");
        } catch (error) {
          console.log("Delete Error:", error);
          Swal.fire("Error!", "Failed to delete user.", "error");
        }
      }
    });
  };

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="page-title mb-0">FAQ's</h4>

            <Link to="/faq/addFaq" className="btn btn-primary btn-sm">
              AddFAQ
            </Link>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th width="5%">Sr No</th>
                      <th width="35%">Question</th>
                      <th width="45%">Answer</th>
                      <th width="20%" className="text-center">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {faqs.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          No FAQs found
                        </td>
                      </tr>
                    )}

                    {faqs.map((faq, index) => (
                      <tr key={faq._id || index}>
                        <td>{index + 1}</td>
                        <td>{faq.question}</td>
                        <td>{faq.answer}</td>

                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-soft-info btn-sm me-2"
                              title="ViewFaq"
                              onClick={() => viewFaq(faq._id)}
                            >
                              <i className="ri-eye-line"></i>
                            </button>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              title="EditFaq"
                              onClick={() => editFaq(faq._id)}
                            >
                              <i className="ri-edit-line text-white"></i>
                            </button>

                            <button
                              className="btn btn-soft-danger btn-sm"
                              title="Delete"
                              onClick={() => deleteUser(faq._id)}
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
