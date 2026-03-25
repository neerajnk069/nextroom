import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ViewFaq = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFaq = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:8000/api/viewFaq/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setFaq(res.data.body);
        }
      } catch (err) {
        console.error("Fetch FAQ Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaq();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  if (!faq) {
    return <p className="text-center mt-4 text-danger">FAQ not found</p>;
  }

  return (
    <div className="main-content">
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4>View FAQ</h4>
          <button className="btn btn-light btn-sm" onClick={() => navigate(-1)}>
            <i className="ri-arrow-left-line me-1"></i> Back
          </button>
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <div className="mb-3">
              <strong>Question</strong>
              <p className="mt-1">{faq.question}</p>
            </div>

            <div className="mb-3">
              <strong>Answer</strong>
              <p className="mt-1">{faq.answer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFaq;
