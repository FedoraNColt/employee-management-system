import React, { useEffect, useState } from "react";
import useGlobalContext, {
  type GlobalContextType,
} from "../../services/GlobalContext";
import type { RegisterEmployeePayload } from "../../types";
import "./CreateEmployeeForm.css";
import { Form } from "../Form/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { Loading } from "../Loading/Loading";
import { FormInput } from "../Form/FormInput";
import { FormSelect } from "../Form/FormSelect";

const initialState: RegisterEmployeePayload = {
  employeeType: "EMPLOYEE",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  payType: "HOURLY",
  payAmount: 0.0,
  reportsTo: null,
};

export const CreateEmployeeForm: React.FC = () => {
  const { employees, authenticationService } =
    useGlobalContext() as GlobalContextType;

  const [createEmployee, setCreateEmployee] =
    useState<RegisterEmployeePayload>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "payAmount") {
      setCreateEmployee({
        ...createEmployee,
        payAmount: Number(value),
      });
      return;
    }

    if (name === "reportsTo") {
      setCreateEmployee({
        ...createEmployee,
        reportsTo: value === "" ? null : value,
      });
      return;
    }

    setCreateEmployee({
      ...createEmployee,
      [name]: value,
    });
  };

  const handleCreateEmployee = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    authenticationService.submitRegister(createEmployee, employees);
  };

  useEffect(() => {
    return () => {
      setCreateEmployee(initialState);
    };
  }, []);

  return (
    <div className="center create-employee-form-background">
      <div className="create-employee-form-modal">
        <div className="create-employee-form-modal-top">
          <div
            className="center create-employee-form-modal-close"
            onClick={() => authenticationService.updateCreatingEmployee(false)}
          >
            <FontAwesomeIcon icon={faX} />
          </div>
        </div>
        {authenticationService.newEmployeeCredentials ? (
          <div className="column" style={{ width: "34rem" }}>
            <div>
              <h3>New Employee's Email</h3>
              <p>{authenticationService.newEmployeeCredentials.email}</p>
            </div>
            <div>
              <h3>Temporary Password</h3>
              <p>
                {authenticationService.newEmployeeCredentials.temporaryPassword}
              </p>
            </div>
            <p>Please share this information with the new hire.</p>
          </div>
        ) : (
          <>
            <h3>Create New Employee</h3>
            <Form
              buttonText="Create New Employee"
              error={authenticationService.employeeCreationError}
              errorMessage={"Unable to create employee"}
              action={handleCreateEmployee}
              width={"34rem"}
              height={
                authenticationService.employeeCreationError
                  ? "31.25rem"
                  : "29rem"
              }
            >
              {authenticationService.savingNewEmployee ? (
                <Loading />
              ) : (
                <>
                  <div className="space-between">
                    <FormInput
                      type="string"
                      label="First Name"
                      name="firstName"
                      placeholder="Employee's First Name"
                      content={createEmployee.firstName}
                      handleInput={handleChange}
                    />
                    <FormInput
                      type="string"
                      label="Last Name"
                      name="lastName"
                      placeholder="Employee's Last Name"
                      content={createEmployee.lastName}
                      handleInput={handleChange}
                    />
                  </div>
                  <FormInput
                    type="string"
                    label="Contact Number"
                    name="phoneNumber"
                    placeholder="Employee Contact"
                    content={createEmployee.phoneNumber}
                    handleInput={handleChange}
                  />
                  <div className="space-between">
                    <FormSelect
                      label="Employee Type"
                      name="employeeType"
                      values={["EMPLOYEE", "MANAGER", "ADMIN"]}
                      value={createEmployee.employeeType}
                      handleInput={handleChange}
                    />
                    <FormInput
                      type="string"
                      label="Reports To"
                      name="reportsTo"
                      placeholder="Employee Manager"
                      content={createEmployee.reportsTo || ""}
                      handleInput={handleChange}
                    />
                  </div>
                  <div className="space-between">
                    <FormSelect
                      label="Pay Type"
                      name="payType"
                      values={["HOURLY", "SALARY"]}
                      value={createEmployee.payType}
                      handleInput={handleChange}
                    />
                    <FormInput
                      type="number"
                      label="Pay Amount"
                      name="payAmount"
                      placeholder="0.0"
                      content={createEmployee.payAmount}
                      handleInput={handleChange}
                    />
                  </div>
                </>
              )}
            </Form>
          </>
        )}
      </div>
    </div>
  );
};
