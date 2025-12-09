import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import Styles from "./Footer.module.css";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";

const Footer = () => {
  const {user} = useAuth();
  return (
    <footer className={Styles.footer}>
      <div className={Styles.footerContainer}>
        {/* === Brand === */}
        <div className={Styles.footerBrand}>
          <h2 className={Styles.brandName}>Unbound</h2>
          <p className={Styles.brandDescription}>
            Redefining modern style with timeless design and unbound creativity.
          </p>
        </div>

        {/* === Navigation === */}
        <div className={Styles.footerLinks}>
          <h4 className={Styles.linksTitle}>Explore</h4>
          <ul>
            <li><Link to="/products">Collections</Link></li>
            <li><Link to="/info?q=about">About us</Link></li>
            <li><Link to="/info?q=contact">Contact</Link></li>
            <li><Link to="/info?q=faq">FAQ</Link></li>
          </ul>
        </div>

        {/* === Social === */}
        {user?.role === "USER" && (
          <div className={Styles.footerSocial}>
            <h4 className={Styles.linksTitle}>Follow us</h4>
            <div className={Styles.socialIcons}>
              <Link to="/" aria-label="Instagram"><FaInstagram /></Link>
              <Link to="/" aria-label="Twitter"><FaTwitter /></Link>
              <Link to="/" aria-label="Facebook"><FaFacebookF /></Link>
              <Link to="/" aria-label="LinkedIn"><FaLinkedinIn /></Link>
            </div>
          </div>
        )}
      </div>

      <div className={Styles.footerBottom}>
        <p>© {new Date().getFullYear()} Unbound Collection. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
