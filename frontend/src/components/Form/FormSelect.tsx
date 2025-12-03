import "./Form.css";
interface FormSelectProps {
  label: string;
  name: string;
  values: string[];
  value: string;
  handleInput: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  values,
  value,
  handleInput,
}) => {
  return (
    <div>
      <label htmlFor={name} className="employee-management-form-label">
        {label}
      </label>
      <select
        className="employee-management-form-input"
        id={name}
        name={name}
        onChange={handleInput}
        value={value}
      >
        {values.map((val, idx) => (
          <option key={idx} value={val}>
            {val}
          </option>
        ))}
      </select>
    </div>
  );
};
