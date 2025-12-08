import { useEffect, useState } from "react";
import useGlobalContext, {
  type GlobalContextType,
} from "../../services/GlobalContext";
import type { Employee } from "../../types";
import { InformationCard } from "../InformationCard/InformationCard";
import { Button } from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { UpdateEmployeeContactInformationForm } from "../UpdateEmployeeContactInformationForm/UpdateEmployeeContactInformationForm";
import { EmployeeContactInformation } from "../EmployeeContactInformation/EmployeeContactInformation";

interface ContactInformationCardProps {
  employee: Employee;
}

export const ContactInformationCard: React.FC<ContactInformationCardProps> = ({
  employee,
}) => {
  const { employee: logedInEmployee, employeeService } =
    useGlobalContext() as GlobalContextType;
  const { employeeUpdateCompleted } = employeeService;
  const [editingContactInfo, setEditingContactInfo] = useState<boolean>(false);

  const toggleUpdateInfo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditingContactInfo((editing) => !editing);
  };

  useEffect(() => {
    if (employeeUpdateCompleted) setEditingContactInfo(false);
  }, [employeeUpdateCompleted]);

  return (
    <InformationCard>
      <div className="space-between">
        <h5>Contact Information</h5>
        {employee?.id === logedInEmployee?.id && (
          <Button type={"primary"} width={"20%"} handleClick={toggleUpdateInfo}>
            <div className="center" style={{ gap: "1rem" }}>
              <FontAwesomeIcon icon={faPencil} />
              Edit
            </div>
          </Button>
        )}
      </div>
      <div className="column">
        {editingContactInfo ? (
          <UpdateEmployeeContactInformationForm
            email={employee.email}
            contactInfo={employee.contactInformation}
          />
        ) : (
          <EmployeeContactInformation
            email={employee.email}
            contactInfo={employee.contactInformation}
            displayHeader={false}
          />
        )}
      </div>
    </InformationCard>
  );
};
