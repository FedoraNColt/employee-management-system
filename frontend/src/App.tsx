import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutPage from "./pages/LayoutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<>Login Page</>} />
        <Route path="" element={<LayoutPage />}>
          <Route path="portal/admin" element={<>Manage Employees Page</>} />
          <Route path="portal/admin/self" element={<>Manage Self Page</>} />
          <Route path="portal/manager" element={<>Manage Reports Page</>} />
          <Route
            path="portal/manager/timesheets"
            element={<>Review Time Sheets Page</>}
          />
          <Route path="portal/manager/self" element={<>Manage Self Page</>} />
          <Route path="portal/employee" element={<>Manage Self Page</>} />
          <Route
            path="portal/employee/timesheets"
            element={<>Time Sheets Page</>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
