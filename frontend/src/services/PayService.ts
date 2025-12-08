import type { Axios } from "axios";
import type { Employee, TimeSheet } from "../types";
import type { GlobalContextReducers } from "./GlobalContext";
import { useState } from "react";

export type PayServiceType = {
  loadingTimeSheetData: boolean;
  timeSheetError: boolean;
  fetchCurrentTimeSheet: (employee: Employee) => void;
  updateTimeSheetHours: (
    timeSheet: TimeSheet,
    dayOfWeek: string,
    amount: number
  ) => void;
  submitUpdateTimeSheetHours: (timeSheet: TimeSheet) => void;
  submitTimeSheetForApproval: (timeSheetId: string) => void;
};

export default function usePayService(
  request: Axios,
  reducers: GlobalContextReducers
): PayServiceType {
  const { updateTimeSheet } = reducers;

  const [loadingTimeSheetData, setLoadingTimeSheetData] =
    useState<boolean>(false);
  const [timeSheetError, setTimeSheetError] = useState<boolean>(false);

  const fetchCurrentTimeSheet = async (employee: Employee) => {
    try {
      setLoadingTimeSheetData(true);
      setTimeSheetError(false);
      const res = await request.post("/timesheet/", employee);
      console.log(res.data);
      updateTimeSheet(res.data);
    } catch (e) {
      console.log(e);
      setTimeSheetError(true);
    } finally {
      setLoadingTimeSheetData(false);
    }
  };

  const updateTimeSheetHours = (
    timeSheet: TimeSheet,
    dayOfWeek: string,
    amount: number
  ) => {
    if (!timeSheet) return;
    let timeSheetHours = timeSheet.hours;
    timeSheetHours = timeSheetHours.map((hour) =>
      dayOfWeek === hour.dayOfWeek
        ? {
            ...hour,
            hours: amount,
          }
        : hour
    );

    const total = timeSheetHours.reduce(
      (acc, cur) => acc + (cur.hours ?? 0),
      0
    );
    const regular = Math.min(total, 40);
    const overtime = total - regular;

    updateTimeSheet({
      ...timeSheet,
      hours: timeSheetHours,
      regularHours: regular,
      overtimeHours: overtime,
    });
  };

  const submitUpdateTimeSheetHours = async (timeSheet: TimeSheet) => {
    try {
      setLoadingTimeSheetData(true);
      setTimeSheetError(false);
      const updatedTimeSheet = {
        ...timeSheet,
        message: null,
      };
      const res = await request.put("/timesheet/hours", updatedTimeSheet);
      updateTimeSheet(res.data);
    } catch (e) {
      console.log(e);
      setTimeSheetError(true);
    } finally {
      setLoadingTimeSheetData(false);
    }
  };

  const submitTimeSheetForApproval = async (timeSheetId: string) => {
    try {
      setLoadingTimeSheetData(true);
      setTimeSheetError(false);
      const res = await request.put(`/timesheet/submit/${timeSheetId}`);
      updateTimeSheet(res.data);
    } catch (e) {
      console.log(e);
      setTimeSheetError(true);
    } finally {
      setLoadingTimeSheetData(false);
    }
  };

  return {
    loadingTimeSheetData,
    timeSheetError,
    fetchCurrentTimeSheet,
    updateTimeSheetHours,
    submitUpdateTimeSheetHours,
    submitTimeSheetForApproval,
  };
}
