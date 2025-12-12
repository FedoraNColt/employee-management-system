import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutPage from "./pages/LayoutPage";
import LoginPage from "./pages/LoginPage";
import ManageEmployeesPage from "./pages/ManageEmployeesPage";
import ManageSelfPage from "./pages/ManageSelfPage";
import TimeSheetPage from "./pages/TimeSheetPage";
import ManageReportsPage from "./pages/ManageReportsPage";
import ReviewTimeSheetsPage from "./pages/ReviewTimeSheetsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="" element={<LayoutPage />}>
          <Route path="portal/admin" element={<ManageEmployeesPage />} />
          <Route path="portal/admin/self" element={<ManageSelfPage />} />
          <Route path="portal/manager" element={<ManageReportsPage />} />
          <Route
            path="portal/manager/timesheets"
            element={<ReviewTimeSheetsPage />}
          />
          <Route path="portal/manager/self" element={<ManageSelfPage />} />
          <Route path="portal/employee" element={<ManageSelfPage />} />
          <Route
            path="portal/employee/timesheets"
            element={<TimeSheetPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
