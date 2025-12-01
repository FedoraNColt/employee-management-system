import "./Button.css";
interface ButtonProps {
  type: "primary" | "secondary" | "error" | "transparent";
  children: React.ReactNode;
  height?: string;
  width?: string;
  id?: string;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  type,
  children,
  height = "fit-content",
  width = "100%",
  id = "",
  handleClick,
}) => {
  return (
    <button
      id={id}
      className={`employee-management-button employee-management-button-${type}`}
      style={{ height, width }}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
