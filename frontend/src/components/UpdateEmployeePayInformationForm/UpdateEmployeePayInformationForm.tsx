import { useState } from "react";
import useGlobalContext, {
  type GlobalContextType,
} from "../../services/GlobalContext";
import type { Employee, PayInformation } from "../../types";
import { Loading } from "../Loading/Loading";
import { Form } from "../Form/Form";
import { FormSelect } from "../Form/FormSelect";
import { FormInput } from "../Form/FormInput";

interface UpdateEmployeePayInformationFormProps {
  employee: Employee;
}

export const UpdateEmployeePayInformationForm: React.FC<
  UpdateEmployeePayInformationFormProps
> = ({ employee }) => {
  const { employeeService, employees } =
    useGlobalContext() as GlobalContextType;

  const initialPayInformation: PayInformation = {
    id: "",
    payType: employee.payInformation.payType,
    payAmount: employee.payInformation.payAmount,
  };

  const [editPayInfo, setEditPayInfo] = useState<PayInformation>(
    () => initialPayInformation
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditPayInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    employeeService.submitUpdatePayInformation(
      editPayInfo,
      employee.email,
      employees
    );
  };
  return (
    <>
      {employeeService.employeeUpdating ? (
        <Loading />
      ) : (
        <Form
          buttonText="Update Employee Pay"
          width="50%"
          action={handleSubmitUpdate}
          error={employeeService.employeeUpdateError}
          errorMessage="Unable to update employee's pay"
        >
          <h2>Update {employee.firstName}'s Pay</h2>
          <FormSelect
            name="payType"
            label="Pay Type"
            value={editPayInfo.payType}
            values={["HOURLY", "SALARY"]}
            handleInput={handleInputChange}
          />
          <FormInput
            name="payAmount"
            label="Pay Amount"
            type="number"
            handleInput={handleInputChange}
            content={editPayInfo.payAmount}
            placeholder={`${employee.payInformation.payAmount}`}
          />
        </Form>
      )}
    </>
  );
};
