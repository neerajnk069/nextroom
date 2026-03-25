import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewDriver = () => {
  const { id } = useParams();
  console.log("Driver ID:", id);

  const [driver, setDriver] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchVehicle = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/viewVehicleByDriver/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVehicle(res.data.body);
    } catch (err) {
      console.error("Vehicle fetch error", err);
    }
  };

  const fetchDriver = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/viewDriver/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setDriver(res.data.body);
      } else {
        setError("Driver not found");
      }
    } catch (err) {
      console.log("Fetch Driver Error:", err);
      setError("API Error");
    }
  };

  useEffect(() => {
    if (!id) {
      setError("ID missing");
      return;
    }
    fetchDriver();
    fetchVehicle();
  }, [id]);

  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;
  if (!driver) return <h3>Loading driver...</h3>;

  return (
    <div className="main-content">
      {/* DRIVER CARD */}
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between">
          <h5>View Driver</h5>
          <Link to="/driverList" className="btn btn-primary btn-sm text-white">
            Back
          </Link>
        </div>

        <div className="card-body">
          <img
            src={
              driver.image
                ? `http://localhost:8000/uploads/${driver.image}`
                : "https://via.placeholder.com/80"
            }
            alt="driver"
            width="80"
            height="80"
            style={{ borderRadius: "8px", objectFit: "cover" }}
          />

          <p>
            <strong>Name:</strong> {driver.firstName} {driver.lastName}
          </p>
          <p>
            <strong>Email:</strong> {driver.email}
          </p>
          <p>
            <strong>Phone:</strong> {driver.phoneNumber}
          </p>
          <p>
            <strong>Status:</strong> {driver.status ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      {/* VEHICLE CARD */}
      <div className="card">
        <div className="card-header">
          <h5>Vehicle Details</h5>
        </div>

        <div className="card-body">
          {vehicle ? (
            <>
              <p>
                <strong>Brand:</strong> {vehicle.vehicleBrand}
              </p>
              <p>
                <strong>Model:</strong> {vehicle.vehicleModel}
              </p>
              <p>
                <strong>Year:</strong> {vehicle.vehicleYear}
              </p>
              <p>
                <strong>Vehicle No:</strong> {vehicle.vehicleNumber}
              </p>
              <p>
                <strong>Color:</strong> {vehicle.vehicleColor}
              </p>

              <hr />

              {vehicle.vehicleRegistrationDocument && (
                <>
                  <strong>RC Document:</strong>
                  <br />
                  <img
                    src={`http://localhost:8000/uploads/${vehicle.vehicleRegistrationDocument}`}
                    width="200"
                    alt="RC"
                  />
                </>
              )}

              {vehicle.drivingLicence && (
                <>
                  <br />
                  <strong>Driving Licence:</strong>
                  <br />
                  <img
                    src={`http://localhost:8000/uploads/${vehicle.drivingLicence}`}
                    width="200"
                    alt="Licence"
                  />
                </>
              )}
            </>
          ) : (
            <p className="text-danger">No vehicle assigned</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDriver;
