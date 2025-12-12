import useFormatDollars from "../../services/useFormatDollars";
import type { PayRollPreview, PayStub } from "../../types";
import { Table } from "../Table/Table";
import { TableHeader } from "../Table/TableHeader";
import { TableRow } from "../Table/TableRow";

interface PayRollTableProps {
  preview: boolean;
  displayEmployee: boolean;
  previewStubs: PayRollPreview[];
  payStubs: PayStub[];
}

export const PayRollTable: React.FC<PayRollTableProps> = ({
  preview,
  displayEmployee,
  previewStubs,
  payStubs,
}) => {
  const PREVIEW_COLUMNS = [
    { id: "pay-date", title: "Pay Date" },
    { id: "employee", title: "Employee" },
    { id: "gross-pay", title: "Gross Pay" },
  ];
  const EMPLOYEE_PAYROLL_COLUMNS = [
    { id: "pay-date", title: "Pay Date" },
    { id: "gross-hours", title: "Total Working Hours" },
    { id: "regular-hours", title: "Regular Pay Hours" },
    { id: "regular-pay", title: "Regular Pay" },
    { id: "over-time-hours", title: "Overtime Paid Hours" },
    { id: "over-time-pay", title: "Overtime pay" },
    { id: "gross-pay", title: "Gross Pay" },
  ];
  const ADMIN_PAYROLL_COLUMNS = [
    { id: "employee", title: "Employee" },
    ...EMPLOYEE_PAYROLL_COLUMNS,
  ];

  const determineColumns = () => {
    if (preview) return PREVIEW_COLUMNS;
    if (!preview && displayEmployee) return ADMIN_PAYROLL_COLUMNS;
    return EMPLOYEE_PAYROLL_COLUMNS;
  };

  const getPayDate = (date: string | Date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const { format } = useFormatDollars("en-US", "currency", "USD");

  const renderTableBody = () => {
    if (preview) {
      return (
        <tbody>
          {previewStubs.map((paystub, idx) => {
            const payDate = getPayDate(paystub.paymentDate);
            return (
              <TableRow id={`preview-${idx}`} hover={false}>
                <td>{payDate}</td>
                <td>{paystub.employee}</td>
                <td>{format(paystub.grossPay)}</td>
              </TableRow>
            );
          })}
        </tbody>
      );
    }

    return (
      <tbody>
        {payStubs.map((paystub) => {
          const payDate = getPayDate(paystub.payDate);
          return (
            <TableRow id={`paystub-${paystub.id}`} hover={false}>
              {displayEmployee && <td>{paystub.employee.email}</td>}
              <td>{payDate}</td>
              <td>{paystub.grossHours}</td>
              <td>{paystub.regularHours}</td>
              <td>{format(paystub.regularPay)}</td>
              <td>{paystub.overtimeHours}</td>
              <td>{format(paystub.overtimePay)}</td>
              <td>{format(paystub.grossPay)}</td>
            </TableRow>
          );
        })}
      </tbody>
    );
  };

  return (
    <Table>
      <TableHeader columns={determineColumns()} />
      {renderTableBody()}
    </Table>
  );
};
