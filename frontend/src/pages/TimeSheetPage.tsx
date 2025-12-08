import { Loading } from "../components/Loading/Loading";
import { TimeSheetCard } from "../components/TimeSheetCard/TimeSheetCard";
import useGlobalContext, {
  type GlobalContextType,
} from "../services/GlobalContext";

export default function TimeSheetPage() {
  const { timeSheet } = useGlobalContext() as GlobalContextType;
  return (
    <div className="page-container">
      {timeSheet ? (
        <TimeSheetCard timeSheet={timeSheet} />
      ) : (
        <div>
          <h3>Loading your current timesheet</h3>
          <Loading />
        </div>
      )}
    </div>
  );
}
