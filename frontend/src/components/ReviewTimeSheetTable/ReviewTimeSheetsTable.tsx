import { useState } from "react";
import useGlobalContext, {
  type GlobalContextType,
} from "../../services/GlobalContext";
import type { ReviewTimeSheetPayload, TimeSheet } from "../../types";
import { Table } from "../Table/Table";
import { TableHeader } from "../Table/TableHeader";
import { TableRow } from "../Table/TableRow";
import { Button } from "../Button/Button";
import { FormTextArea } from "../Form/FormTextArea";

interface ReviewTimeSheetTableProps {
  timeSheets: TimeSheet[];
}

export const ReviewTimeSheetTable: React.FC<ReviewTimeSheetTableProps> = ({
  timeSheets,
}) => {
  const { employee, payService } = useGlobalContext() as GlobalContextType;

  const reviewTimeSheetHeaders = [
    { id: "employee", title: "Employee" },
    { id: "sunday", title: "Sun" },
    { id: "monday", title: "Mon" },
    { id: "tuesday", title: "Tue" },
    { id: "wednesday", title: "Wed" },
    { id: "thursday", title: "Thu" },
    { id: "friday", title: "Fri" },
    { id: "saturday", title: "Sat" },
    { id: "approve", title: "Approve" },
    { id: "deny", title: "Deny" },
  ];

  const [deniedTimeSheet, setDeniedTimeSheet] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleDenyClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = e.currentTarget.id.split(":")[1];
    if (deniedTimeSheet === id) {
      setDeniedTimeSheet("");
    } else {
      setDeniedTimeSheet(id);
    }
  };

  const handleDenialMessageChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(e.currentTarget.value);
  };

  const handleSumbitApproval = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = e.currentTarget.id.split(":")[1];
    if (employee) {
      const payload: ReviewTimeSheetPayload = {
        approver: employee,
        timeSheetId: id,
        status: "APPROVED",
        message: null,
      };

      payService.reviewTimeSheet(payload, timeSheets);
    }
  };

  const handleSumbitDenial = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = e.currentTarget.id.split(":")[1];
    if (employee) {
      const payload: ReviewTimeSheetPayload = {
        approver: employee,
        timeSheetId: id,
        status: "DENIED",
        message,
      };

      payService.reviewTimeSheet(payload, timeSheets);
    }
  };

  return (
    <Table>
      <TableHeader columns={reviewTimeSheetHeaders} />
      <tbody>
        {timeSheets.map((timesheet) => (
          <>
            <TableRow id={`timesheet:${timesheet.id}`} hover={false}>
              <td>{`${timesheet.employee.firstName} ${timesheet.employee.lastName}`}</td>
              {timesheet.hours.map((hour) => (
                <td key={hour.id}>{hour.hours} hours</td>
              ))}
              <td>
                <Button
                  id={`approve:${timesheet.id}`}
                  type="secondary"
                  handleClick={handleSumbitApproval}
                >
                  Approve
                </Button>
              </td>
              <td>
                <Button
                  id={`deny:${timesheet.id}`}
                  type="error"
                  handleClick={handleDenyClicked}
                >
                  Deny
                </Button>
              </td>
            </TableRow>
            {timesheet.id === deniedTimeSheet && (
              <TableRow id={`edit:${timesheet.id}`} hover={false}>
                <td colSpan={10} className="width-full">
                  <div className="space-between">
                    <div className="width-full">
                      <FormTextArea
                        label="Enter Denial Message"
                        name="denial"
                        placeholder="Reason for denial..."
                        content={message}
                        width="50%"
                        handleInput={handleDenialMessageChange}
                      />
                    </div>
                    <Button
                      id={`denied:${timesheet.id}`}
                      type="error"
                      handleClick={handleSumbitDenial}
                      width="33%"
                    >
                      Submit Reason For Denial
                    </Button>
                  </div>
                </td>
              </TableRow>
            )}
          </>
        ))}
      </tbody>
    </Table>
  );
};
