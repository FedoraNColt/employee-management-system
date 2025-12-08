import { ContactInformationCard } from "../components/ContactInformationCard/ContactInformationCard";
import { Loading } from "../components/Loading/Loading";
import { PayInformationCard } from "../components/PayInformationCard/PayInformationCard";
import { PersonalInformationCard } from "../components/PersonalInformationCard/PersonalInformationCard";
import useGlobalContext, {
  type GlobalContextType,
} from "../services/GlobalContext";
import "./ManageSelfPage.css";

export default function ManageSelfPage() {
  const { employee } = useGlobalContext() as GlobalContextType;
  return (
    <div className="page-container-center">
      {employee ? (
        <div className="column" style={{ gap: "2rem" }}>
          <h3>Manage Yourself</h3>
          <div className="manage-self-page-information row">
            <PersonalInformationCard employee={employee} />
            <ContactInformationCard employee={employee} />
          </div>
          <PayInformationCard
            payInfo={employee.payInformation}
            location="manage"
          />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
