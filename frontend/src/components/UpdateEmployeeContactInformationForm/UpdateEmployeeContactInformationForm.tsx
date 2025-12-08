import { useState } from "react";
import useGlobalContext, {
  type GlobalContextType,
} from "../../services/GlobalContext";
import { US_STATE_LIST, type ContactInformation } from "../../types";
import { Form } from "../Form/Form";
import { FormInput } from "../Form/FormInput";
import { FormSelect } from "../Form/FormSelect";

interface UpdateEmployeeContactInformationFormProps {
  contactInfo: ContactInformation;
  email: string;
}

export const UpdateEmployeeContactInformationForm: React.FC<
  UpdateEmployeeContactInformationFormProps
> = ({ contactInfo, email }) => {
  const { employeeService } = useGlobalContext() as GlobalContextType;
  const initialContactInfo: ContactInformation = JSON.parse(
    JSON.stringify(contactInfo)
  );
  const [updatedContactInfo, setUpdatedContactInfo] =
    useState<ContactInformation>(initialContactInfo);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUpdatedContactInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    employeeService.submitUpdateContactInformation(updatedContactInfo, email);
  };

  return (
    <Form
      buttonText="Update Contact Information"
      error={employeeService.employeeUpdateError}
      errorMessage="Unable to update contact information"
      action={handleSubmitUpdate}
    >
      <h2>Update Contact Information</h2>
      <FormInput
        type="text"
        label="Phone Number"
        name="phoneNumber"
        placeholder={contactInfo.phoneNumber || ""}
        content={updatedContactInfo.phoneNumber || ""}
        handleInput={handleInputChange}
      />
      <div className="space-between">
        <div className="width-half">
          <FormInput
            type="text"
            label="Address Line One"
            name="addressLineOne"
            placeholder={contactInfo.addressLineOne || ""}
            content={updatedContactInfo.addressLineOne || ""}
            handleInput={handleInputChange}
          />
        </div>
        <div className="width-half">
          <FormInput
            type="text"
            label="Address Line Two"
            name="addressLineTwo"
            placeholder={contactInfo.addressLineTwo || ""}
            content={updatedContactInfo.addressLineTwo || ""}
            handleInput={handleInputChange}
          />
        </div>
      </div>
      <div className="space-between">
        <div className="width-half">
          <FormInput
            type="text"
            label="City"
            name="city"
            placeholder={contactInfo.city || ""}
            content={updatedContactInfo.city || ""}
            handleInput={handleInputChange}
          />
        </div>
        <div className="width-half">
          <FormSelect
            label="State"
            name="state"
            values={US_STATE_LIST}
            value={updatedContactInfo.state || ""}
            handleInput={handleInputChange}
          />
        </div>
      </div>
      <FormInput
        type="text"
        label="Zip Code"
        name="zipCode"
        placeholder={contactInfo.zipCode || ""}
        content={updatedContactInfo.zipCode || ""}
        handleInput={handleInputChange}
      />
    </Form>
  );
};
