import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditFaq = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    question: "",
    answer: "",
    status: "1",
  });

  const [errors, setErrors] = useState({});

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
          setForm({
            question: res.data.body.question || "",
            answer: res.data.body.answer || "",
            status: res.data.body.status || "1",
          });
          setErrors({});
        }
      } catch (err) {
        console.error("Fetch FAQ Error:", err);
        setError("Failed to fetch FAQ");
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let temp = {};

    if (!form.question.trim()) {
      temp.question = "Question is required";
    }

    if (!form.answer.trim()) {
      temp.answer = "Answer is required";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8000/api/updateFaq/${id}`,
        {
          question: form.question.trim(),
          answer: form.answer.trim(),
          status: form.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("FAQ Updated Successfully");
        navigate("/faq");
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Update failed");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="main-content">
      <div className="container mt-4">
        <h3>Edit FAQ</h3>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label>Question</label>
            <input
              type="text"
              name="question"
              className={`form-control ${errors.question ? "is-invalid" : ""}`}
              value={form.question}
              onChange={handleChange}
            />
            {errors.question && (
              <small className="text-danger">{errors.question}</small>
            )}
          </div>

          <div className="mb-3">
            <label>Answer</label>
            <textarea
              name="answer"
              rows="4"
              className={`form-control ${errors.answer ? "is-invalid" : ""}`}
              value={form.answer}
              onChange={handleChange}
            />
            {errors.answer && (
              <small className="text-danger">{errors.answer}</small>
            )}
          </div>

          <button className="btn btn-success">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditFaq;
