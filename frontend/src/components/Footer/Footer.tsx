import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Footer.css";
import { faHouse, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";

export const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="center text-hover">
        <FontAwesomeIcon icon={faHouse} size="1x" />{" "}
        <p>123 Business Ln, ST 55555</p>
      </div>
      <div className="center text-hover">
        <FontAwesomeIcon icon={faPhone} size="1x" />
        <p>+1-111-111-1111</p>
      </div>
      <div className="center text-hover">Company Info</div>
      <div className="center text-hover">Reviews</div>
      <div className="center text-hover">
        <p>Follow Us</p>
        <FontAwesomeIcon icon={faTwitter} size="2x" />
        <FontAwesomeIcon icon={faFacebook} size="2x" />
      </div>
    </div>
  );
};
