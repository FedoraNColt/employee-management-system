import "./Form.css";

interface FormInputProps {
  type: string;
  label: string;
  name: string;
  placeholder: string;
  content: string | number;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormInput: React.FC<FormInputProps> = ({
  type,
  label,
  name,
  placeholder,
  content,
  handleInput,
}) => {
  return (
    <div>
      <label htmlFor={name} className="employee-management-form-label">
        {label}:
      </label>
      <input
        type={type}
        id={name}
        className="employee-management-form-input"
        name={name}
        placeholder={placeholder}
        onInput={handleInput}
        value={content}
      />
    </div>
  );
};
