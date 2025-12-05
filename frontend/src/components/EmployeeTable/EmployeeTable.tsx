import React, { useState } from "react";
import type { Employee } from "../../types";
import { Table } from "../Table/Table";
import { TableHeader } from "../Table/TableHeader";
import { TableRow } from "../Table/TableRow";
import { Button } from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faX } from "@fortawesome/free-solid-svg-icons";
import { ContactInformationCard } from "../ContactInformationCard/ContactInformationCard";
import { PayInformationCard } from "../PayInformationCard/PayInformationCard";
import { UpdateEmployeeInformationForm } from "../UpdateEmployeeInformationForm/UpdateEmployeeInformationForm";
import { UpdateEmployeePayInformationForm } from "../UpdateEmployeePayInformationForm/UpdateEmployeePayInformationForm";

const MANAGER_EMPLOYEE_TABLE_PROPERTIES = [
  { id: "id", title: "ID" },
  { id: "employeeType", title: "Employee Type" },
  { id: "firstName", title: "First Name" },
  { id: "lastName", title: "Last Name" },
  { id: "email", title: "Email" },
  { id: "reportsTo", title: "Manager" },
];

const ADMIN_EMPLOYEE_TABLE_PROPERTIES = [
  ...MANAGER_EMPLOYEE_TABLE_PROPERTIES,
  { id: "edit", title: "Edit" },
];

interface EmployeeTableProps {
  employees: Employee[];
  displayEditEmployee: boolean;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  displayEditEmployee,
}) => {
  const [editingEmployee, setEditingEmployee] = useState<string>("");
  const [expandedEmployee, setExpandedEmployee] = useState<string>("");

  const columnProps = displayEditEmployee
    ? ADMIN_EMPLOYEE_TABLE_PROPERTIES
    : MANAGER_EMPLOYEE_TABLE_PROPERTIES;

  const editEmployeeClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setExpandedEmployee("");
    const id = e.currentTarget.id;
    if (editingEmployee === id) {
      setEditingEmployee("");
    } else {
      setEditingEmployee(id);
    }
  };

  const expandEmployeeClicked = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.stopPropagation();
    setEditingEmployee("");
    const email = e.currentTarget.id;

    if (email === expandedEmployee) {
      setExpandedEmployee("");
    } else {
      setExpandedEmployee(email);
    }
  };

  return (
    <Table>
      <TableHeader columns={columnProps} />
      <tbody>
        {employees.map((employee) => (
          <React.Fragment key={employee.email}>
            <TableRow
              id={employee.email}
              handleClick={expandEmployeeClicked}
              hover={true}
            >
              <th scope="col">{employee.id}</th>
              {columnProps
                .slice(1, 6)
                .map((prop: { id: string; title: string }) => {
                  const value =
                    typeof employee[prop.id as keyof Employee] === "object"
                      ? employee.reportsTo?.id || "N/A"
                      : employee[prop.id as keyof Employee];

                  const data: string | number | boolean =
                    typeof value === "object"
                      ? employee.reportsTo?.id || "N/A"
                      : value;
                  return <td key={prop.id}>{data}</td>;
                })}
              {displayEditEmployee && (
                <td>
                  <Button
                    type="transparent"
                    id={`${employee.id}`}
                    handleClick={editEmployeeClicked}
                  >
                    {editingEmployee === employee.id ? (
                      <FontAwesomeIcon icon={faX} size="lg" color="black" />
                    ) : (
                      <FontAwesomeIcon icon={faPen} size="lg" color="black" />
                    )}
                  </Button>
                </td>
              )}
            </TableRow>
            {editingEmployee === employee.id && (
              <TableRow
                id="employee-management-table-expanded-row"
                hover={false}
              >
                <td colSpan={7}>
                  <div className="row" style={{ alignItems: "stretch" }}>
                    <UpdateEmployeeInformationForm employee={employee} />
                    <UpdateEmployeePayInformationForm employee={employee} />
                  </div>
                </td>
              </TableRow>
            )}

            {expandedEmployee === employee.email && (
              <TableRow
                id="employee-management-table-expanded-row"
                hover={false}
              >
                <td colSpan={7}>
                  <div className="row" style={{ alignItems: "stretch" }}>
                    <ContactInformationCard employee={employee} />
                    {displayEditEmployee && (
                      <PayInformationCard
                        payInfo={employee.payInformation}
                        location="employees"
                      />
                    )}
                  </div>
                </td>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  );
};
