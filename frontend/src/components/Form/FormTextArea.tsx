import "./Form.css";

interface FormTextAreaProps {
  label: string;
  name: string;
  placeholder: string;
  content: string;
  width?: string;
  height?: string;
  handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  name,
  placeholder,
  content,
  width = "fit-content",
  height = "fit-content",
  handleInput,
}) => {
  return (
    <div>
      <label htmlFor={name} className="employee-management-form-label">
        {label}
      </label>
      <textarea
        id={name}
        className="employee-management-form-textarea employee-management-form-border"
        name={name}
        placeholder={placeholder}
        value={content}
        onChange={handleInput}
        style={{ width, height }}
      />
    </div>
  );
};
