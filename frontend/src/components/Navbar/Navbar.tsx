import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import useGlobalContext, {
  type GlobalContextType,
} from "../../services/GlobalContext";

interface NavbarProps {
  type: string;
}

interface NavItem {
  text: string;
  route: string;
}

const adminItems: NavItem[] = [
  { text: "Manage Employees", route: "/portal/admin" },
  { text: "Manage Self", route: "/portal/admin/self" },
];

const managerItems: NavItem[] = [
  { text: "Managed Employees", route: "/portal/manager" },
  { text: "Employee Timesheets", route: "/portal/manager/timesheets" },
  { text: "Manage Self", route: "/portal/manager/self" },
];

const employeeItems: NavItem[] = [
  { text: "Manage Self", route: "/portal/employee" },
  { text: "Timesheets", route: "/portal/employee/timesheets" },
];

function getNavbarItems(type: string): NavItem[] {
  switch (type) {
    case "admin":
      return adminItems;
    case "manager":
      return managerItems;
    default:
      return employeeItems;
  }
}

export const Navbar: React.FC<NavbarProps> = ({ type }) => {
  const navigate = useNavigate();

  const { employee, authenticationService } =
    useGlobalContext() as GlobalContextType;

  const navbarItems = getNavbarItems(type);

  const handleLogoutClicked = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    authenticationService.submitLogout(employee);
  };

  return (
    <nav className="nav-bar space-between">
      <div className="row nav-bar-logo">
        <FontAwesomeIcon icon={faGlobe} size="3x" />
        <h2>Company</h2>
      </div>
      <div className="center nav-bar-links">
        {navbarItems.map((item) => (
          <div
            className="center nav-bar-item"
            key={item.text}
            onClick={() => navigate(item.route)}
          >
            <h6>{item.text}</h6>
          </div>
        ))}
        <div className="center nav-bar-item" onClick={handleLogoutClicked}>
          <h6>Logout</h6>
        </div>
      </div>
    </nav>
  );
};
