import React, { useState } from "react";
import useGlobalContext, {
  type GlobalContextType,
} from "../../services/GlobalContext";
import { Form } from "../Form/Form";
import { Loading } from "../Loading/Loading";
import { FormInput } from "../Form/FormInput";

export const ResetPasswordForm: React.FC = () => {
  const { refresh, authenticationService } =
    useGlobalContext() as GlobalContextType;
  interface ResetPassword {
    password: string;
    confirm: string;
  }

  const [resetPasswordState, setResetPasswordState] = useState<ResetPassword>({
    password: "",
    confirm: "",
  });

  const [passwordError, setPasswordError] = useState<boolean>(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetPasswordState((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmitPasswordReset = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (
      resetPasswordState.password.length === 0 ||
      resetPasswordState.confirm.length === 0 ||
      resetPasswordState.password !== resetPasswordState.confirm
    ) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
      authenticationService.submitUpdateEmployeePassword(
        resetPasswordState.password,
        refresh || ""
      );
    }
  };

  return (
    <Form
      buttonText="Reset Password"
      error={passwordError}
      errorMessage="Password must match"
      action={handleSubmitPasswordReset}
      width="25rem"
      height={passwordError ? "20rem" : "17rem"}
    >
      {authenticationService.loadingEmployeeInformation ? (
        <Loading />
      ) : (
        <>
          <FormInput
            type="password"
            label="New Password"
            name="password"
            placeholder="New Password"
            content={resetPasswordState.password}
            handleInput={handlePasswordChange}
          />
          <FormInput
            type="password"
            label="Confirm Password"
            name="confirm"
            placeholder="Confirm Password"
            content={resetPasswordState.confirm}
            handleInput={handlePasswordChange}
          />
        </>
      )}
    </Form>
  );
};
