import "./InformationCard.css";

interface InformationCardProps {
  children: React.ReactNode;
}

export const InformationCard: React.FC<InformationCardProps> = ({
  children,
}) => {
  return <div className="column information-card">{children}</div>;
};
