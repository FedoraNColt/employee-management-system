import { useState } from "react";
import useGlobalContext, {
  type GlobalContextType,
} from "../../services/GlobalContext";
import { Loading } from "../Loading/Loading";
import { Form } from "../Form/Form";
import { FormInput } from "../Form/FormInput";

interface EmployeeLogin {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const {
    authenticationService: {
      submitLogin,
      loadingEmployeeInformation,
      employeeAuthenticationError,
    },
  } = useGlobalContext() as GlobalContextType;

  const [employeeLogin, setEmployeeLogin] = useState<EmployeeLogin>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeLogin({
      ...employeeLogin,
      [e.target.id]: e.target.value,
    });
  };

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    submitLogin(employeeLogin.email, employeeLogin.password);
  };

  if (loadingEmployeeInformation) return <Loading />;

  return (
    <Form
      buttonText="Log in"
      error={employeeAuthenticationError}
      errorMessage="Invalid email or password"
      action={handleLogin}
      width="25rem"
      height={employeeAuthenticationError ? "20rem" : "17rem"}
    >
      <FormInput
        label="Email"
        type="email"
        name="email"
        placeholder="Employee Email"
        content={employeeLogin.email}
        handleInput={handleInputChange}
      />
      <FormInput
        label="Password"
        type="password"
        name="password"
        placeholder="Employee Password"
        content={employeeLogin.password}
        handleInput={handleInputChange}
      />
    </Form>
  );
};
