import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useGlobalContext, {
  type GlobalContextType,
} from "../../services/GlobalContext";
import type { Employee } from "../../types";
import { Button } from "../Button/Button";
import { InformationCard } from "../InformationCard/InformationCard";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { EmployeeTable } from "../EmployeeTable/EmployeeTable";

interface EmployeesCardProps {
  header: string;
  employees: Employee[];
  displayEditEmployee: boolean;
}

export const EmployeesCard: React.FC<EmployeesCardProps> = ({
  header,
  employees,
  displayEditEmployee,
}) => {
  const {
    authenticationService: { updateCreatingEmployee },
  } = useGlobalContext() as GlobalContextType;

  return (
    <InformationCard>
      <div className="space-between">
        <h3>{header}</h3>
        {displayEditEmployee && (
          <Button
            type={"primary"}
            width={"20%"}
            handleClick={() => updateCreatingEmployee(true)}
          >
            <div className="center" style={{ gap: "0.5rem" }}>
              <FontAwesomeIcon icon={faPlus} />
              Add Employee
            </div>
          </Button>
        )}
      </div>
      <EmployeeTable
        employees={employees}
        displayEditEmployee={displayEditEmployee}
      />
    </InformationCard>
  );
};
