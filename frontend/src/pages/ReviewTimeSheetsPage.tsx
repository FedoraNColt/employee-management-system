import { useEffect } from "react";
import { InformationCard } from "../components/InformationCard/InformationCard";
import { Loading } from "../components/Loading/Loading";
import useGlobalContext, {
  type GlobalContextType,
} from "../services/GlobalContext";
import { ReviewTimeSheetTable } from "../components/ReviewTimeSheetTable/ReviewTimeSheetsTable";

export default function ReviewTimeSheetsPage() {
  const { employee, employees, timeSheets, payService } =
    useGlobalContext() as GlobalContextType;

  useEffect(() => {
    if (employee) {
      payService.fetchTimeSheetsByManager(employees);
    }
  }, [employee, employees]);

  return (
    <div className="page-container">
      {employee ? (
        <div>
          <InformationCard>
            <h3>Timesheets Ready for Review</h3>
            <ReviewTimeSheetTable timeSheets={timeSheets} />
          </InformationCard>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
