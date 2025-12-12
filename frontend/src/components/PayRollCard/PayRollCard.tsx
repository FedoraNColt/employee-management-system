import React, { useState } from "react";
import useGlobalContext, {
  type GlobalContextType,
} from "../../services/GlobalContext";
import { InformationCard } from "../InformationCard/InformationCard";
import "./PayRollCard.css";
import { Button } from "../Button/Button";
import { Loading } from "../Loading/Loading";
import { PayRollTable } from "../PayRollTable/PayRollTable";

export const PayRollCard: React.FC = () => {
  const { payRoll, payRollPreview, payService } =
    useGlobalContext() as GlobalContextType;
  const [previwing, setPreviewing] = useState<boolean>(false);

  const handleSubmitPreviewPayRoll = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    payService.previewPayRoll();
    setPreviewing(true);
  };

  const handleSubmitPayRoll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    payService.runPayRoll();
    setPreviewing(false);
  };

  return (
    <InformationCard>
      <div className="space-between">
        <h5>Payroll</h5>
        <Button
          type="secondary"
          width="25%"
          handleClick={handleSubmitPreviewPayRoll}
        >
          Preview PayRoll
        </Button>
        <Button type="primary" width="25%" handleClick={handleSubmitPayRoll}>
          Run PayRoll
        </Button>
      </div>
      <div className="pay-roll-card-scroll-container">
        {payService.loadingPayRoll ? (
          <Loading />
        ) : (
          <PayRollTable
            displayEmployee={true}
            preview={previwing}
            previewStubs={payRollPreview}
            payStubs={payRoll}
          />
        )}
      </div>
    </InformationCard>
  );
};
