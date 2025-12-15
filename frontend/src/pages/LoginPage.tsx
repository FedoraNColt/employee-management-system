import { useNavigate } from "react-router-dom";
import useGlobalContext, {
  type GlobalContextType,
} from "../services/GlobalContext";
import { useCallback, useEffect } from "react";
import { LoginForm } from "../components/LoginForm/LoginForm";
import { ResetPasswordForm } from "../components/ResetPasswordForm/ResetPasswordForm";

function LoginPage() {
  const {
    employee,
    authenticationService: { loggingOut },
  } = useGlobalContext() as GlobalContextType;
  const navigate = useNavigate();

  const navigateToEmployeePortal = useCallback(() => {
    navigate(`/portal/${employee?.employeeType.toLowerCase()}`);
  }, [navigate, employee]);

  useEffect(() => {
    if (employee && !employee.firstTimeLogin && !loggingOut) {
      navigateToEmployeePortal();
    }
  }, [employee, navigateToEmployeePortal, loggingOut]);

  return (
    <div className="page">
      <div className="page-container-center">
        {employee?.firstTimeLogin ? (
          <h1>Reset Temporary Password</h1>
        ) : (
          <h1>Company Portal</h1>
        )}
        {!employee && <LoginForm />}
        {employee?.firstTimeLogin && <ResetPasswordForm />}
      </div>
    </div>
  );
}

export default LoginPage;
