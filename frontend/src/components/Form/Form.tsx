import type React from "react";
import "./Form.css";
import { Button } from "../Button/Button";

interface FormProps {
  buttonText: string;
  error: boolean;
  errorMessage: string;
  action: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  height?: string;
  width?: string;
}

export const Form: React.FC<FormProps> = ({
  buttonText,
  error,
  errorMessage,
  action,
  children,
  height = "fit-content",
  width = "fit-content",
}) => {
  return (
    <form
      className={`column employee-management-form ${
        error
          ? "employee-management-form-border-error"
          : "employee-management-form-border"
      }`}
      style={{ height, width }}
    >
      {error && (
        <p className="employee-management-form-error-message">{errorMessage}</p>
      )}
      {children}
      <Button type="primary" handleClick={action}>
        {buttonText}
      </Button>
    </form>
  );
};
