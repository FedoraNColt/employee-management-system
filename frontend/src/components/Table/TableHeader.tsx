import "./Table.css";

interface TableHeaderProps {
  columns: Array<{ id: string; title: string }>;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columns }) => {
  return (
    <thead className="employee-management-table-header">
      <tr>
        {columns.map((col) => (
          <th key={col.id} className="table-management-table-th" scope="col">
            {col.title}
          </th>
        ))}
      </tr>
    </thead>
  );
};
