import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const [setRememberme] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("user"));
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const navi = async () => {
    if (auth) {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    navi();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        phoneNumber,
        password,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.body.token);
        localStorage.setItem("user", JSON.stringify(response.data.body));
        navigate("/dashboard");
      }
      console.log(response, "login data");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="auth-wrapper">
      <div className="left-auth">
        <div className="bottom-soci mb-3">
          <div className="fw-medium mb-2">
            © 2026 Real-Time Real Estate Intelligence
          </div>
          <div className="soci">
            <a href="#">
              <svg
                width="20"
                height="20"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.0938 1.5625H3.90625C3.28465 1.5625 2.68851 1.80943 2.24897 2.24897C1.80943 2.68851 1.5625 3.28465 1.5625 3.90625L1.5625 21.0938C1.5625 21.7154 1.80943 22.3115 2.24897 22.751C2.68851 23.1906 3.28465 23.4375 3.90625 23.4375H10.6079V16.0005H7.53174V12.5H10.6079V9.83203C10.6079 6.79736 12.4146 5.12109 15.1816 5.12109C16.5068 5.12109 17.8926 5.35742 17.8926 5.35742V8.33594H16.3657C14.8613 8.33594 14.3921 9.26953 14.3921 10.2271V12.5H17.7505L17.2134 16.0005H14.3921V23.4375H21.0938C21.7154 23.4375 22.3115 23.1906 22.751 22.751C23.1906 22.3115 23.4375 21.7154 23.4375 21.0938V3.90625C23.4375 3.28465 23.1906 2.68851 22.751 2.24897C22.3115 1.80943 21.7154 1.5625 21.0938 1.5625Z"
                  fill="#444A6D"
                />
              </svg>
            </a>
            <a href="#" className="mx-2"></a>
            <a href="#"></a>
          </div>
        </div>
      </div>

      <div className="right-auth">
        <div className="flex-grow-1">
          <div className="authtitle mb-2">
            <img src="assets/images/logo-new.png" width="55" alt="logo" />
          </div>
          <p className="authsubtitle mb-1">
            <img src="assets/images/logo-sub2.png" width="175" alt="sub-logo" />
          </p>
          <div
            className="text-center mb-5 fw-medium font-size-17 text-black"
            style={{ marginTop: "-4px" }}
          >
            Admin Panel
          </div>
          <div className="font-size-18 fw-medium text-black">Login</div>

          <div className="mb-3 pt-2">
            <label className="form-label" htmlFor="phoneNumber">
              PhoneNumber
            </label>
            <input
              type="phoneNumber"
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="form-control logform"
              placeholder="PhoneNumber"
            />
          </div>

          <div className="mb-3">
            <div className="position-relative">
              <label className="form-label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control logform"
                placeholder="Password"
              />
              <i
                className={`ri ${
                  showPassword ? "ri-eye-line" : "ri-eye-off-line"
                } position-absolute`}
                style={{
                  top: "50%",
                  fontSize: "18px",
                  right: "14px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={togglePassword}
              ></i>
            </div>
          </div>

          <div className="d-flex justify-content-between mb-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                onChange={(e) => setRememberme(e.target.checked)}
                id="rememberme"
                style={{ width: "1.1em", height: "1.1em", marginTop: ".2em" }}
              />
              <label className="form-check-label" htmlFor="employee">
                Remember me
              </label>
            </div>
            <Link to="/register">Can't access your account?</Link>
          </div>

          <button
            onClick={handleLogin}
            type="button"
            className="btn btn-primary w-100"
          >
            LOG IN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
