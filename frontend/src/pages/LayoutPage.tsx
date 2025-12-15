import { Navigate, Outlet, replace, useLocation } from "react-router-dom";
import "./LayoutPage.css";
import useGlobalContext, {
  type GlobalContextType,
} from "../services/GlobalContext";
import { Navbar } from "../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading/Loading";
import { Footer } from "../components/Footer/Footer";
import { TimeOutPopup } from "../components/TimeOutPopup/TimeOutPopup";

type LoadingState =
  | "NAVIGATE_LOGIN"
  | "NAVIGATE_PROPER"
  | "LOADING_DATA"
  | "COMPLETED";

function LayoutPage() {
  const {
    token,
    refresh,
    employee,
    payService,
    authenticationService: {
      loggingOut,
      employeeAuthenticationError,
      submitLogout,
      refreshEmployee,
    },
  } = useGlobalContext() as GlobalContextType;
  const { pathname } = useLocation();

  const [loadingState, setLoadingState] =
    useState<LoadingState>("LOADING_DATA");
  const [authTimeOut, setAuthTimeOut] = useState<boolean>(false);

  useEffect(() => {
    // 1. check if logging out
    if (loggingOut) {
      setLoadingState("NAVIGATE_LOGIN");
      return;
    }

    if (employee) {
      const properUri = employee.employeeType.toLowerCase();
      if (!pathname.includes(properUri)) {
        setLoadingState("NAVIGATE_PROPER");
        return;
      } else {
        setLoadingState("COMPLETED");
        setTimeout(() => {
          setAuthTimeOut(true);
        }, 1000 * 60 * 5);
        if (pathname === "/portal/employee/timesheets") {
          payService.fetchCurrentTimeSheet(employee);
        }
        return;
      }
    }

    if (token === null && refresh === null) {
      setLoadingState("LOADING_DATA");
      return;
    }

    if (token === "") {
      setLoadingState("NAVIGATE_LOGIN");
      return;
    }

    if (employeeAuthenticationError) {
      setLoadingState("NAVIGATE_LOGIN");
      submitLogout(employee);
      return;
    }

    if (token && refresh) {
      setLoadingState("LOADING_DATA");
      refreshEmployee(refresh);
      return;
    }
  }, [
    employee,
    token,
    refresh,
    loggingOut,
    employeeAuthenticationError,
    pathname,
  ]);

  const authenticate = () => {
    switch (loadingState) {
      case "NAVIGATE_LOGIN":
        return <Navigate to="/" replace />;
      case "NAVIGATE_PROPER":
        return (
          <Navigate
            to={`/portal/${employee?.employeeType.toLowerCase()}`}
            replace
          />
        );
      case "LOADING_DATA":
        return <Loading />;
      default:
        return (
          <div className="layout-page page">
            {authTimeOut && (
              <TimeOutPopup handleClosePopup={() => setAuthTimeOut(false)} />
            )}
            {employee && (
              <Navbar type={employee.employeeType.toLocaleLowerCase()} />
            )}
            {employee && (
              <h1 style={{ marginTop: "1px" }}>
                {employee.firstName} {employee.lastName}
              </h1>
            )}
            <Outlet />
            <Footer />
          </div>
        );
    }
  };

  return <>{authenticate()}</>;
}

export default LayoutPage;
