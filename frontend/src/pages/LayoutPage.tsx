import { Outlet } from "react-router-dom";
import "./LayoutPage.css";

function LayoutPage() {
  return (
    <div className="layout-page page">
      Layout Page
      <Outlet />
    </div>
  );
}

export default LayoutPage;
