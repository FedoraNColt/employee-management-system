import { useState } from "react";
import useGlobalContext, {
  type GlobalContextType,
} from "../../services/GlobalContext";
import type { TimeSheet } from "../../types";
import { InformationCard } from "../InformationCard/InformationCard";
import "./TimeSheetCard.css";
import { Table } from "../Table/Table";
import { TableHeader } from "../Table/TableHeader";
import { TableRow } from "../Table/TableRow";
import { FormInput } from "../Form/FormInput";
import { Button } from "../Button/Button";

interface TimeSheetCardProps {
  timeSheet: TimeSheet;
}

export const TimeSheetCard: React.FC<TimeSheetCardProps> = ({ timeSheet }) => {
  const { payService } = useGlobalContext() as GlobalContextType;
  const [timeSheetHours, setTimeSheetHours] = useState<number[]>(() =>
    timeSheet.hours.map((hour) => hour.hours)
  );

  const handleHoursChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dayOfWeek = e.currentTarget.name;
    const value = Number(e.currentTarget.value);

    const index = timeSheet.hours.findIndex((h) => h.dayOfWeek === dayOfWeek);
    if (index === -1) return;

    setTimeSheetHours((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    payService.updateTimeSheetHours(timeSheet, dayOfWeek, value);
  };

  const handleSubmitHoursUpdated = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    payService.submitUpdateTimeSheetHours(timeSheet);
  };

  const handleSubmitTimeSheetForApproval = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    payService.submitTimeSheetForApproval(timeSheet.id);
  };

  const headerColumns = () => {
    const columns = [];
    timeSheet.hours.forEach((hour) => {
      const data = new Date(hour.date).toDateString();
      columns.push({ id: data, title: hour.dayOfWeek });
    });
    columns.push({ id: "totalHours", title: "Total Hours" });
    return columns;
  };

  const statusClass = () => {
    if (!timeSheet) return;

    switch (timeSheet.status) {
      case "CREATED":
      case "SAVED":
      case "SUBMITTED":
        return "var(--text-primary)";
      case "APPROVED":
      case "DENIED":
        return "var(--secondary)";
      case "PAID":
        return "var(--error-red)";
    }
  };

  return (
    <InformationCard>
      <h3>Update Your Timesheet</h3>
      <h4>
        Current Timesheet Status{" - "}
        <span style={{ color: statusClass() }}>{timeSheet.status}</span>
      </h4>
      {timeSheet.message && (
        <div className="time-sheet-card-message">
          <h6>Reasoning For Time Sheet Denial</h6>
          <p>{timeSheet.message}</p>
        </div>
      )}

      <Table>
        <TableHeader columns={headerColumns()} />
        <tbody>
          <TableRow id={`timesheet-${timeSheet.id}`} hover={false}>
            {timeSheet.hours.map((hour, idx) => {
              const day = new Date(hour.date);
              day.setDate(day.getDate());
              return (
                <td key={hour.id}>
                  <FormInput
                    type="number"
                    label={day.toLocaleDateString()}
                    name={hour.dayOfWeek}
                    placeholder=""
                    content={timeSheetHours[idx]}
                    handleInput={handleHoursChanged}
                  />
                </td>
              );
            })}
            <td>
              <div className="center">
                {timeSheet.overtimeHours + timeSheet.regularHours}
              </div>
            </td>
          </TableRow>
        </tbody>
      </Table>
      <div className="column time-sheet-card-button-area">
        <p>
          Bu submitting your timesheet for approval, you verify that you have
          reviewed your timesheet for accuracy and completness.
        </p>
        <div className="space-between">
          <Button
            type="secondary"
            handleClick={handleSubmitHoursUpdated}
            width="33%"
          >
            Save Changes
          </Button>
          <Button
            type="primary"
            handleClick={handleSubmitTimeSheetForApproval}
            width="33%"
          >
            Submit for Approval
          </Button>
        </div>
      </div>
    </InformationCard>
  );
};
