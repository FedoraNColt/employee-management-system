import React, { useState } from "react";
import useGlobalContext, {
  type GlobalContextType,
} from "../../services/GlobalContext";
import { type EditEmployeePayload, type Employee } from "../../types";
import { Loading } from "../Loading/Loading";
import { Form } from "../Form/Form";
import { FormInput } from "../Form/FormInput";
import { FormSelect } from "../Form/FormSelect";

interface UpdateEmployeeInformationFormProps {
  employee: Employee;
}

export const UpdateEmployeeInformationForm: React.FC<
  UpdateEmployeeInformationFormProps
> = ({ employee }) => {
  const { employeeService, employees } =
    useGlobalContext() as GlobalContextType;

  const initialEditEmployee = {
    email: employee.email,
    firstName: "",
    lastName: "",
    employeeType: employee.employeeType,
    reportsTo: "",
  };

  const [editEmployee, setEditEmployee] = useState<EditEmployeePayload>(
    () => initialEditEmployee
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditEmployee((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const payload = {
      email: employee.email,
      firstName:
        editEmployee.firstName?.trim() === "" ? null : editEmployee.firstName,
      lastName:
        editEmployee.lastName?.trim() === "" ? null : editEmployee.lastName,
      employeeType: editEmployee.employeeType,
      reportsTo:
        editEmployee.reportsTo?.trim() === "" ? null : editEmployee.reportsTo,
    };

    employeeService.submitUpdateInformation(payload, employees);
  };

  return (
    <>
      {employeeService.employeeUpdating ? (
        <Loading />
      ) : (
        <Form
          buttonText="Update Employee Information"
          width="50%"
          error={employeeService.employeeUpdateError}
          errorMessage="Unable to update Employee"
          action={handleSubmitUpdate}
        >
          <h2>Update Employee Information</h2>
          <div className="space-between">
            <div className="width-half">
              <FormInput
                type="text"
                name="firstName"
                label="First Name"
                placeholder={employee.firstName}
                content={editEmployee.firstName || ""}
                handleInput={handleInputChange}
              />
            </div>
            <div className="width-half">
              <FormInput
                type="text"
                name="lastName"
                label="Last Name"
                placeholder={employee.lastName}
                content={editEmployee.lastName || ""}
                handleInput={handleInputChange}
              />
            </div>
          </div>
          <div className="space-between">
            <div className="width-half">
              <FormSelect
                label="Employee Type"
                name="employeeType"
                values={["EMPLOYEE", "MANAGER", "ADMIN"]}
                value={editEmployee.employeeType}
                handleInput={handleInputChange}
              />
            </div>
            <div className="width-half">
              <FormInput
                type="text"
                name="reportsTo"
                label="Manager"
                placeholder={employee.reportsTo?.email || ""}
                content={editEmployee.reportsTo ? editEmployee.reportsTo : ""}
                handleInput={handleInputChange}
              />
            </div>
          </div>
        </Form>
      )}
    </>
  );
};
