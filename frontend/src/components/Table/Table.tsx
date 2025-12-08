import "./Table.css";

interface TableProps {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children }) => {
  return (
    <div className="width-full flex">
      <table className="employee-management-table">{children}</table>
    </div>
  );
};
