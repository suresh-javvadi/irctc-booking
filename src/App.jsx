import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminTrains from "./admin/AdminTrains";
import AdminUsers from "./admin/AdminUsers";
import Bookings from "./bookings/Bookings";
import Login from "./login/Login";
import NotFound from "./NotFound";
import PassengerDetails from "./passengers/PassengerDetails";
import Passengers from "./passengers/Passengers";
import Payment from "./payment/Payment";
import Profile from "./profile/Profile";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./register/Register";
import CheckAvailability from "./trains/CheckAvailability";
import store from "./store/store";
import SearchTrains from "./trains/SearchTrains";
import Unauthorized from "./Unauthorized";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/passengers" element={<Passengers />} />
            <Route path="/trains" element={<SearchTrains />} />
            <Route path="/availability" element={<CheckAvailability />} />
            <Route path="/passenger-details" element={<PassengerDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin/trains" element={<AdminTrains />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
