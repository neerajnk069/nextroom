import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingList from "./pages/booking/BookingList";
import ViewBooking from "./pages/booking/ViewBooking";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard";
import DriverList from "./pages/driver/DriverList";
import ViewDriver from "./pages/driver/ViewDriver";
import UserList from "./pages/user/UserList";
import ViewUser from "./pages/user/ViewUser";
import EmployeeList from "./pages/employee/EmployeeList";
import ViewEmployee from "./pages/employee/ViewEmployee";
import ProtectedRoute from "./ProtectedRoute";
import ChangePassword from "./pages/ChangePassword";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsCondition from "./pages/TermsCondition";
import ContactUs from "./pages/ContactUs";
import EditAdminProfile from "./pages/EditAdminProfile";
import Faq from "./pages/faq/Faq";
import AddFaq from "./pages/faq/AddFaq";
import EditFaq from "./pages/faq/EditFaq";
import ViewFaq from "./pages/faq/ViewFaq";
import AddDriverCategory from "./pages/driverCategory/AddDriverCategory";
import DriverCategory from "./pages/driverCategory/DriverCategory";
import EditDriverCategory from "./pages/driverCategory/EditDriverCategory";
import ViewDriverCategory from "./pages/driverCategory/ViewDriverCategory";
import AddDriverSubCategory from "./pages/driverSubCategory/AddSubCategory";
import EditDriverSubCategory from "./pages/driverSubCategory/EditSubCategory";
import DriverSubCategory from "./pages/driverSubCategory/DriverSubCategory";
import ViewDriverSubCategory from "./pages/driverSubCategory/ViewSubCategory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/termsCondition" element={<TermsCondition />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/faq/addFaq" element={<AddFaq />} />
          <Route path="/faq/editFaq/:id" element={<EditFaq />} />
          <Route path="/faq/viewFaq/:id" element={<ViewFaq />} />

          <Route
            path="/editAdminProfile"
            element={
              <ProtectedRoute>
                <EditAdminProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/driverList"
            element={
              <ProtectedRoute>
                <DriverList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewDriver/:id"
            element={
              <ProtectedRoute>
                <ViewDriver />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userList"
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewUser/:id"
            element={
              <ProtectedRoute>
                <ViewUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employeeList"
            element={
              <ProtectedRoute>
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewEmployee/:id"
            element={
              <ProtectedRoute>
                <ViewEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookingList"
            element={
              <ProtectedRoute>
                <BookingList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewBooking/:id"
            element={
              <ProtectedRoute>
                <ViewBooking />
              </ProtectedRoute>
            }
          />
          <Route path="/driverCategory" element={<DriverCategory />} />
          <Route
            path="/driverCategory/addDriverCategory"
            element={<AddDriverCategory />}
          />
          <Route
            path="/driverCategory/editDriverCategory"
            element={<EditDriverCategory />}
          />
          <Route
            path="/driverCategory/viewDriverCategory"
            element={<ViewDriverCategory />}
          />

          <Route path="/driverSubCategory" element={<DriverSubCategory />} />
          <Route
            path="/driverSubCategory/addDriverSubCategory"
            element={<AddDriverSubCategory />}
          />
          <Route
            path="/driverSubCategory/editDriverSubCategory"
            element={<EditDriverSubCategory />}
          />
          <Route
            path="/driverSubCategory/viewDriverSubCategory"
            element={<ViewDriverSubCategory />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
