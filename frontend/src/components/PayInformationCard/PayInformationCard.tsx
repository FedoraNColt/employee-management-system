import { useEffect, useState } from "react";
import useFormatDollars from "../../services/useFormatDollars";
import type { PayInformation, PayStub } from "../../types";
import { InformationCard } from "../InformationCard/InformationCard";
import { PayRollTable } from "../PayRollTable/PayRollTable";

import "./PayInformationCard.css";

interface PayInformationCardProps {
  payInfo: PayInformation;
  location: string;
  displayPayStubs: boolean;
  payStubs: PayStub[];
}

export const PayInformationCard: React.FC<PayInformationCardProps> = ({
  payInfo,
  location,
  displayPayStubs,
  payStubs,
}) => {
  const { format } = useFormatDollars("en-US", "currency", "USD");
  const [totalEarnings, setTotalEarnings] = useState<number>(0);

  const estimatedYearlyPay = (payInfo: PayInformation): string => {
    if (payInfo.payType === "SALARY") {
      return `${format(payInfo.payAmount)}`;
    } else {
      return `${format(payInfo.payAmount * 40 * 52)}`;
    }
  };

  useEffect(() => {
    setTotalEarnings(() => {
      let total = 0;
      payStubs.forEach((ps: PayStub) => {
        total += ps.grossPay;
      });
      return total;
    });
  }, [payStubs, payStubs.length]);

  return (
    <InformationCard>
      <div className="row">
        <div
          className="column"
          style={{ width: location === "employees" ? "100%" : "33%" }}
        >
          <h4>Employee Pay Information</h4>
          <div>
            <h6>Pay Type</h6>
            <p>{payInfo.payType}</p>
          </div>
          <div>
            <h6>Pay Amount</h6>
            <p>{format(payInfo.payAmount)}</p>
          </div>
          <div>
            <h6>Estimated Yearly Pay</h6>
            <p>{estimatedYearlyPay(payInfo)}</p>
          </div>
        </div>

        {displayPayStubs && (
          <div>
            <div className="row pay-information-earnings">
              <h4>Year to Date Earning</h4>
              <h6>{format(totalEarnings)}</h6>
            </div>
            <div className="pay-information-scroll-container">
              <PayRollTable
                preview={false}
                displayEmployee={false}
                payStubs={payStubs}
                previewStubs={[]}
              />
            </div>
          </div>
        )}
      </div>
    </InformationCard>
  );
};
