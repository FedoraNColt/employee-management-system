import type { Employee } from "../../types";
import { EmployeeContactInformation } from "../EmployeeContactInformation/EmployeeContactInformation";
import { InformationCard } from "../InformationCard/InformationCard";

interface ContactInformationCardProps {
  employee: Employee;
}

export const ContactInformationCard: React.FC<ContactInformationCardProps> = ({
  employee,
}) => {
  return (
    <InformationCard>
      <div className="column">
        <h5>Contact Information</h5>
        <EmployeeContactInformation
          email={employee.email}
          contactInfo={employee.contactInformation}
          displayHeader={false}
        />
      </div>
    </InformationCard>
  );
};
