import useFormatDollars from "../../services/useFormatDollars";
import type { PayInformation } from "../../types";
import { InformationCard } from "../InformationCard/InformationCard";

interface PayInformationCardProps {
  payInfo: PayInformation;
  location: string;
}

export const PayInformationCard: React.FC<PayInformationCardProps> = ({
  payInfo,
  location,
}) => {
  const { format } = useFormatDollars("en-US", "currency", "USD");
  const estimatedYearlyPay = (payInfo: PayInformation): string => {
    if (payInfo.payType === "SALARY") {
      return `${format(payInfo.payAmount)}`;
    } else {
      return `${format(payInfo.payAmount * 40 * 52)}`;
    }
  };

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
      </div>
    </InformationCard>
  );
};
