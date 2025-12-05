export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  employeeType: EmployeeType;
  contactInformation: ContactInformation;
  payInformation: PayInformation;
  firstTimeLogin: boolean;
  reportsTo: Employee | null;
  reports: Employee[];
}

export interface ContactInformation {
  id: string;
  phoneNumber: string;
  addressLineOne: string;
  addressLineTwo: string;
  state: US_STATES;
  city: string;
  zipCode: string;
}

export interface PayInformation {
  id: string;
  payType: PayType;
  payAmount: number;
}

export type EmployeeType = "ADMIN" | "MANAGER" | "EMPLOYEE";

export type PayType = "SALARY" | "HOURLY";

export type US_STATES =
  | "AL" // Alabama
  | "AK" // Alaska
  | "AZ" // Arizona
  | "AR" // Arkansas
  | "CA" // California
  | "CO" // Colorado
  | "CT" // Connecticut
  | "DE" // Delaware
  | "FL" // Florida
  | "GA" // Georgia
  | "HI" // Hawaii
  | "ID" // Idaho
  | "IL" // Illinois
  | "IN" // Indiana
  | "IA" // Iowa
  | "KS" // Kansas
  | "KY" // Kentucky
  | "LA" // Louisiana
  | "ME" // Maine
  | "MD" // Maryland
  | "MA" // Massachusetts
  | "MI" // Michigan
  | "MN" // Minnesota
  | "MS" // Mississippi
  | "MO" // Missouri
  | "MT" // Montana
  | "NE" // Nebraska
  | "NV" // Nevada
  | "NH" // New Hampshire
  | "NJ" // New Jersey
  | "NM" // New Mexico
  | "NY" // New York
  | "NC" // North Carolina
  | "ND" // North Dakota
  | "OH" // Ohio
  | "OK" // Oklahoma
  | "OR" // Oregon
  | "PA" // Pennsylvania
  | "RI" // Rhode Island
  | "SC" // South Carolina
  | "SD" // South Dakota
  | "TN" // Tennessee
  | "TX" // Texas
  | "UT" // Utah
  | "VT" // Vermont
  | "VA" // Virginia
  | "WA" // Washington
  | "WV" // West Virginia
  | "WI" // Wisconsin
  | "WY"; // Wyoming

export interface RegisterEmployeePayload {
  employeeType: EmployeeType;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  payType: PayType;
  payAmount: number;
  reportsTo: string | null;
}

export interface NewEmployeeLogin {
  email: string;
  temporaryPassword: string;
}

export interface EditEmployeePayload {
  email: string;
  firstName: string | null;
  lastName: string | null;
  employeeType: EmployeeType;
  reportsTo: string | null;
}
