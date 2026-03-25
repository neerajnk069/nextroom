import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddFaq = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    question: "",
    answer: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/addFaq",
        {
          question: form.question.trim(),
          answer: form.answer.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("FAQ Added Successfully");
        navigate("/faq");
      }
    } catch (err) {
      console.error("Add FAQ Error:", err);
      alert("Error adding FAQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="container mt-4">
        <h3>Add FAQ</h3>

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

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFaq;
