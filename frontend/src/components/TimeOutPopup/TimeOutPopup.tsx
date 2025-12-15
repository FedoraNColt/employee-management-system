import useGlobalContext, {
  type GlobalContextType,
} from "../../services/GlobalContext";
import { Button } from "../Button/Button";
import "./TimeOutPopup.css";

interface TimeOutPopupProps {
  handleClosePopup: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const TimeOutPopup: React.FC<TimeOutPopupProps> = ({
  handleClosePopup,
}) => {
  const { refresh, employee, authenticationService } =
    useGlobalContext() as GlobalContextType;

  const handleReAuth = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    authenticationService.refreshEmployee(refresh || "");
    handleClosePopup(e);
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    authenticationService.submitLogout(employee);
    handleClosePopup(e);
  };

  return (
    <div className="column time-out-popup-container">
      <div className="time-out-popup">
        <h3>Your session has timed out</h3>
        <p>Please re-authenticate or logout</p>
        <div className="center time-out-popup-button-group">
          <Button type="primary" handleClick={handleReAuth}>
            Re-Authenticate
          </Button>
          <Button type="secondary" handleClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
