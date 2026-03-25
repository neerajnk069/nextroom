import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/adminDashBoard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.body);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;
  return (
    <>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="title-box mb-3 pb-1">
              <h4 className="mb-0 page-title">Dashboard</h4>
              <nav aria-label="breadcrumb" className="mt-1">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard">
                      <i className="ri-home-4-fill me-1" /> Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <i className="ri-pie-chart-2-fill me-1" /> Dashboard
                  </li>
                </ol>
              </nav>
            </div>

            <div className="row mb-4">
              <div className="col">
                <Link
                  to="/userList"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="card p-3">
                    <i className="ri-group-2-line"></i>
                    <h5>Users</h5>
                    <p>{stats.totalUsers}</p>
                  </div>
                </Link>
              </div>
              <div className="col">
                <Link
                  to="/driverList"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="card p-3">
                    <i className="ri-taxi-line"></i>
                    <h5>Drivers</h5>
                    <p>{stats.totalDrivers}</p>
                  </div>
                </Link>
              </div>
              <div className="col">
                <Link
                  to="/employeeList"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="card p-3">
                    <i className="ri-team-line"></i>
                    <h5>Staffs</h5>
                    <p>{stats.totalEmployees}</p>
                  </div>
                </Link>
              </div>
              <div className="col">
                <div className="card p-3">
                  <i className="ri-roadster-line"></i>

                  <h5>Vehicles</h5>
                  <p>{stats.totalVehicles}</p>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col">
                <Link
                  to="/bookingList"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="card p-3">
                    <i className="ri-file-list-3-line"></i>
                    <h5>Bookings</h5>
                    <p>{stats.totalBookings}</p>
                  </div>
                </Link>
              </div>
              <div className="col">
                <div className="card p-3">
                  <i className="ri-time-line"></i>
                  <h5>Active Bookings</h5>
                  <p>{stats.activeBookings}</p>
                </div>
              </div>
              <div className="col">
                <div className="card p-3">
                  <i className="ri-checkbox-circle-line"></i>
                  <h5>Completed Bookings</h5>
                  <p>{stats.completedBookings}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h5>Recent Bookings</h5>
              </div>
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Driver</th>
                      <th>Pickup</th>
                      <th>Drop</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBookings.map((b) => (
                      <tr key={b._id}>
                        <td>
                          {b.userId?.firstName} {b.userId?.lastName}
                        </td>
                        <td>
                          {b.driverId?.firstName} {b.driverId?.lastName}
                        </td>
                        <td>{b.pickupLocation}</td>
                        <td>{b.dropLocation}</td>
                        <td>{b.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-body">
                    <div className="card-head mb-3">
                      <div>
                        <div className="card-title mb-0">Map View</div>
                      </div>
                    </div>
                    <div id="map" />
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body pb-2 pe-2">
                    <div className="card-head mb-3">
                      <div>
                        <div className="card-title mb-0">
                          <span id="hide-collapse">Total </span>Users by State
                        </div>
                        <div className="top-key">10,423</div>
                      </div>
                    </div>
                    <div
                      data-simplebar
                      style={{ height: "304px" }}
                      className="cus-scroll pe-2"
                    >
                      <div className="state-visitors-container">
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Alabama</div>
                            <div>423</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Alabama visitors"
                            aria-valuenow={423}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "4.3%", background: "#FF6633" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Alaska</div>
                            <div>187</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Alaska visitors"
                            aria-valuenow={187}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "1.9%", background: "#FFB399" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Arizona</div>
                            <div>645</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Arizona visitors"
                            aria-valuenow={645}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "6.6%", background: "#FF33FF" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Arkansas</div>
                            <div>312</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Arkansas visitors"
                            aria-valuenow={312}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "3.2%", background: "#FFFF99" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>California</div>
                            <div>6,800</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="California visitors"
                            aria-valuenow={6800}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "69.4%", background: "#00e096" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Colorado</div>
                            <div>8,500</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Colorado visitors"
                            aria-valuenow={8500}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "86.7%", background: "#ffa412" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Connecticut</div>
                            <div>529</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Connecticut visitors"
                            aria-valuenow={529}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "5.4%", background: "#00B3E6" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Delaware</div>
                            <div>276</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Delaware visitors"
                            aria-valuenow={276}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "2.8%", background: "#E6B333" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Florida</div>
                            <div>731</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Florida visitors"
                            aria-valuenow={731}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "7.5%", background: "#3366E6" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Georgia</div>
                            <div>598</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Georgia visitors"
                            aria-valuenow={598}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "6.1%", background: "#999966" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Hawaii</div>
                            <div>384</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Hawaii visitors"
                            aria-valuenow={384}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "3.9%", background: "#99FF99" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Idaho</div>
                            <div>217</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Idaho visitors"
                            aria-valuenow={217}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "2.2%", background: "#B34D4D" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Illinois</div>
                            <div>653</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Illinois visitors"
                            aria-valuenow={653}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "6.7%", background: "#80B300" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Indiana</div>
                            <div>492</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Indiana visitors"
                            aria-valuenow={492}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "5.0%", background: "#809900" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Iowa</div>
                            <div>341</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Iowa visitors"
                            aria-valuenow={341}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "3.5%", background: "#E6B3B3" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Kansas</div>
                            <div>275</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Kansas visitors"
                            aria-valuenow={275}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "2.8%", background: "#6680B3" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Kentucky</div>
                            <div>419</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Kentucky visitors"
                            aria-valuenow={419}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "4.3%", background: "#66991A" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Louisiana</div>
                            <div>503</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Louisiana visitors"
                            aria-valuenow={503}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "5.1%", background: "#FF99E6" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Maine</div>
                            <div>198</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Maine visitors"
                            aria-valuenow={198}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "2.0%", background: "#CCFF1A" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Maryland</div>
                            <div>567</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Maryland visitors"
                            aria-valuenow={567}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "5.8%", background: "#FF1A66" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Massachusetts</div>
                            <div>612</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Massachusetts visitors"
                            aria-valuenow={612}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "6.2%", background: "#E6331A" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Michigan</div>
                            <div>587</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Michigan visitors"
                            aria-valuenow={587}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "6.0%", background: "#33FFCC" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Minnesota</div>
                            <div>436</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Minnesota visitors"
                            aria-valuenow={436}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "4.4%", background: "#66994D" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Mississippi</div>
                            <div>329</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Mississippi visitors"
                            aria-valuenow={329}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "3.4%", background: "#B366CC" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Missouri</div>
                            <div>478</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Missouri visitors"
                            aria-valuenow={478}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "4.9%", background: "#4D8000" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Montana</div>
                            <div>254</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Montana visitors"
                            aria-valuenow={254}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "2.6%", background: "#B33300" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Nebraska</div>
                            <div>291</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Nebraska visitors"
                            aria-valuenow={291}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "3.0%", background: "#CC80CC" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Nevada</div>
                            <div>367</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Nevada visitors"
                            aria-valuenow={367}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "3.7%", background: "#66664D" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>New Hampshire</div>
                            <div>225</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="New Hampshire visitors"
                            aria-valuenow={225}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "2.3%", background: "#991AFF" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>New Jersey</div>
                            <div>543</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="New Jersey visitors"
                            aria-valuenow={543}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "5.5%", background: "#E666FF" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>New Mexico</div>
                            <div>318</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="New Mexico visitors"
                            aria-valuenow={318}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "3.2%", background: "#4DB3FF" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>New York</div>
                            <div>9,800</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="New York visitors"
                            aria-valuenow={9800}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "100%", background: "#5d5fef" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>North Carolina</div>
                            <div>672</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="North Carolina visitors"
                            aria-valuenow={672}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "6.9%", background: "#1AB399" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>North Dakota</div>
                            <div>203</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="North Dakota visitors"
                            aria-valuenow={203}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "2.1%", background: "#E666B3" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Ohio</div>
                            <div>621</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Ohio visitors"
                            aria-valuenow={621}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "6.3%", background: "#33991A" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Oklahoma</div>
                            <div>387</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Oklahoma visitors"
                            aria-valuenow={387}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "3.9%", background: "#CC9999" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Oregon</div>
                            <div>429</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Oregon visitors"
                            aria-valuenow={429}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "4.4%", background: "#B3B31A" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Pennsylvania</div>
                            <div>578</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Pennsylvania visitors"
                            aria-valuenow={578}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "5.9%", background: "#00E680" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Rhode Island</div>
                            <div>246</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Rhode Island visitors"
                            aria-valuenow={246}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "2.5%", background: "#4D8066" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>South Carolina</div>
                            <div>512</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="South Carolina visitors"
                            aria-valuenow={512}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "5.2%", background: "#809980" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>South Dakota</div>
                            <div>239</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="South Dakota visitors"
                            aria-valuenow={239}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "2.4%", background: "#E6FF80" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Tennessee</div>
                            <div>497</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Tennessee visitors"
                            aria-valuenow={497}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "5.1%", background: "#1AFF33" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Texas</div>
                            <div>7,200</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Texas visitors"
                            aria-valuenow={7200}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "73.5%", background: "#0095ff" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Utah</div>
                            <div>356</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Utah visitors"
                            aria-valuenow={356}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "3.6%", background: "#FF3380" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Vermont</div>
                            <div>211</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Vermont visitors"
                            aria-valuenow={211}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "2.2%", background: "#CCCC00" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Virginia</div>
                            <div>534</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Virginia visitors"
                            aria-valuenow={534}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "5.4%", background: "#66E64D" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Washington</div>
                            <div>482</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Washington visitors"
                            aria-valuenow={482}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "4.9%", background: "#4D80CC" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>West Virginia</div>
                            <div>267</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="West Virginia visitors"
                            aria-valuenow={267}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "2.7%", background: "#9900B3" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Wisconsin</div>
                            <div>403</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Wisconsin visitors"
                            aria-valuenow={403}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "4.1%", background: "#E64D66" }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex mb-1 justify-content-between">
                            <div>Wyoming</div>
                            <div>228</div>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label="Wyoming visitors"
                            aria-valuenow={228}
                            aria-valuemin={0}
                            aria-valuemax={9800}
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: "2.3%", background: "#4DB380" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
