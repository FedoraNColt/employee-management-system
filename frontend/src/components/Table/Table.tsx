import "./Table.css";

interface TableProps {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children }) => {
  return <table className="employee-management-table">{children}</table>;
};
