import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ContactInformation } from "../../types";
import "./EmployeeContactInformation.css";
import {
  faEnvelope,
  faHouse,
  faLandmark,
  faPhone,
  faRoad,
  faRoute,
  faTreeCity,
} from "@fortawesome/free-solid-svg-icons";

interface EmployeeContactInformationProps {
  email: string;
  contactInfo: ContactInformation;
  displayHeader: boolean;
}

export const EmployeeContactInformation: React.FC<
  EmployeeContactInformationProps
> = ({
  email,
  contactInfo: {
    phoneNumber,
    addressLineOne,
    addressLineTwo,
    city,
    state,
    zipCode,
  },
  displayHeader = true,
}) => {
  const employeeContactMap = [
    {
      title: "Email",
      content: email,
      icon: faEnvelope,
    },
    {
      title: "Phone Number",
      content: phoneNumber,
      icon: faPhone,
    },
    {
      title: "Address Line One",
      content: addressLineOne,
      icon: faRoad,
    },
    {
      title: "Address Line Two",
      content: addressLineTwo,
      icon: faHouse,
    },
    {
      title: "State",
      content: state,
      icon: faLandmark,
    },
    {
      title: "City",
      content: city,
      icon: faTreeCity,
    },
    {
      title: "Zip Code",
      content: zipCode,
      icon: faRoute,
    },
  ];

  return (
    <div>
      {displayHeader && <h4>Employee Contact Information</h4>}
      <div className="employee-contact-info">
        {employeeContactMap.map((prop) => (
          <div key={prop.title} className="width-half">
            <h6>
              <FontAwesomeIcon icon={prop.icon} /> {prop.title}
              <p>{prop.content}</p>
            </h6>
          </div>
        ))}
      </div>
    </div>
  );
};
