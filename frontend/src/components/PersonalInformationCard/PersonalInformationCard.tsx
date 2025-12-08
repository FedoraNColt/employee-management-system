import type { Employee } from "../../types";
import { InformationCard } from "../InformationCard/InformationCard";

interface PersonalInformationCardProps {
  employee: Employee;
}

export const PersonalInformationCard: React.FC<
  PersonalInformationCardProps
> = ({ employee }) => {
  return (
    <InformationCard>
      <h5>Personal Information</h5>
      <div className="row">
        <div className="width-half">
          <h6>First Name</h6>
          <p>{employee.firstName}</p>
        </div>
        <div className="width-half">
          <h6>Last Name</h6>
          <p>{employee.lastName}</p>
        </div>
      </div>
      <div className="row">
        <div className="width-half">
          <h6>Email</h6>
          <p>{employee.email}</p>
        </div>
        <div className="width-half">
          <h6>Title</h6>
          <p>{employee.employeeType}</p>
        </div>
      </div>
      <h6>Manager</h6>
      <p>{employee.reportsTo ? employee.reportsTo.email : "N/A"}</p>
    </InformationCard>
  );
};
