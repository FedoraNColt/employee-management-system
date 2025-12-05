import type React from "react";
import "./Table.css";

interface TableRowProps {
  key?: number | string;
  id: string;
  hover: boolean;
  handleClick?: (e: React.MouseEvent<HTMLTableRowElement>) => void;
  children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({
  key,
  id,
  hover,
  handleClick,
  children,
}) => {
  const rowClicked = (e: React.MouseEvent<HTMLTableRowElement>) => {
    if (handleClick) {
      handleClick(e);
    }
  };
  return (
    <tr
      onClick={rowClicked}
      className={hover ? "employee-management-table-row" : ""}
      id={id}
      key={key}
    >
      {children}
    </tr>
  );
};
