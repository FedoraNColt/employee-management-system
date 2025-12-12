import type { Axios } from "axios";
import type { Employee, ReviewTimeSheetPayload, TimeSheet } from "../types";
import type { GlobalContextReducers } from "./GlobalContext";
import { useState } from "react";

export type PayServiceType = {
  loadingTimeSheetData: boolean;
  timeSheetError: boolean;
  loadingPayRoll: boolean;
  payRollError: boolean;
  fetchCurrentTimeSheet: (employee: Employee) => void;
  updateTimeSheetHours: (
    timeSheet: TimeSheet,
    dayOfWeek: string,
    amount: number
  ) => void;
  submitUpdateTimeSheetHours: (timeSheet: TimeSheet) => void;
  submitTimeSheetForApproval: (timeSheetId: string) => void;
  fetchTimeSheetsByManager: (employees: Employee[]) => void;
  reviewTimeSheet: (
    payload: ReviewTimeSheetPayload,
    timeSheets: TimeSheet[]
  ) => void;
  previewPayRoll: () => void;
  runPayRoll: () => void;
  fetchPayStubsByEmail: (email: string) => void;
};

export default function usePayService(
  request: Axios,
  reducers: GlobalContextReducers
): PayServiceType {
  const {
    updateTimeSheet,
    updateTimeSheets,
    updatePayRollPreview,
    updatePayRoll,
    updatePayStubs,
  } = reducers;

  const [loadingTimeSheetData, setLoadingTimeSheetData] =
    useState<boolean>(false);
  const [timeSheetError, setTimeSheetError] = useState<boolean>(false);
  const [loadingPayRoll, setLoadingPayRoll] = useState<boolean>(false);
  const [payRollError, setPayRollError] = useState<boolean>(false);

  const fetchCurrentTimeSheet = async (employee: Employee) => {
    try {
      setLoadingTimeSheetData(true);
      setTimeSheetError(false);
      const res = await request.post("/timesheet/", employee);
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

  const fetchTimeSheetsByManager = async (employees: Employee[]) => {
    try {
      setTimeSheetError(false);
      setLoadingTimeSheetData(true);
      const res = await request.post("/timesheet/manager", employees);
      updateTimeSheets(res.data);
    } catch (e) {
      console.log(e);
      setTimeSheetError(true);
    } finally {
      setLoadingTimeSheetData(false);
    }
  };

  const reviewTimeSheet = async (
    payload: ReviewTimeSheetPayload,
    timeSheets: TimeSheet[]
  ) => {
    try {
      setTimeSheetError(false);
      setLoadingTimeSheetData(true);
      await request.put("/timesheet/review", payload);
      const filteredTimeSheets = timeSheets.filter(
        (timeSheet) => timeSheet.id !== payload.timeSheetId
      );
      updateTimeSheets(filteredTimeSheets);
    } catch (e) {
      console.log(e);
      setTimeSheetError(true);
    } finally {
      setLoadingTimeSheetData(false);
    }
  };

  const previewPayRoll = async () => {
    try {
      setLoadingPayRoll(true);
      setPayRollError(false);

      const res = await request.get("/payroll/preview");
      updatePayRollPreview(res.data);
    } catch (e) {
      console.log(e);
      setPayRollError(true);
    } finally {
      setLoadingPayRoll(false);
    }
  };

  const runPayRoll = async () => {
    try {
      setLoadingPayRoll(true);
      setPayRollError(false);

      const res = await request.get("/payroll/run");
      updatePayRoll(res.data);
    } catch (e) {
      console.log(e);
      setPayRollError(true);
    } finally {
      setLoadingPayRoll(false);
    }
  };

  const fetchPayStubsByEmail = async (email: string) => {
    try {
      setLoadingPayRoll(true);
      setPayRollError(false);
      const date = new Date();
      const res = await request.get(
        `/payroll/view/${email}?year=${date.getFullYear()}`
      );
      updatePayStubs(res.data);
    } catch (e) {
      console.log(e);
      setPayRollError(true);
    } finally {
      setLoadingPayRoll(false);
    }
  };

  return {
    loadingTimeSheetData,
    timeSheetError,
    loadingPayRoll,
    payRollError,
    fetchCurrentTimeSheet,
    updateTimeSheetHours,
    submitUpdateTimeSheetHours,
    submitTimeSheetForApproval,
    fetchTimeSheetsByManager,
    reviewTimeSheet,
    previewPayRoll,
    runPayRoll,
    fetchPayStubsByEmail,
  };
}
