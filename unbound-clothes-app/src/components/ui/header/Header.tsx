import { Link } from "react-router-dom";
import { ShoppingCart, Person, Menu, ArrowDropDown } from "@mui/icons-material";
import Styles from "./Header.module.css";
import { useEffect, useState } from "react";
import { categories } from "../../../types/schemas.db";
import ThemeButton from "./theme/ThemeButton";
import SearchBar from "./search/SearchBar";
import useTheme from "../../../hooks/useTheme";
import useAuth from "../../../hooks/useAuth";
import UserImage from "../user/UserImage";
import { useLocation } from "react-router-dom";


const Header = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const location = useLocation();
  const isLanding = location.pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [showHeader, setShowHeader] = useState(false);
  const [isTransparent, setIsTransparent] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  // === SCROLL LOGIC ===

  useEffect(()=>{
    setShowHeader(false);
    setIsTransparent(true);
  },[isLanding])

  useEffect(() => {
    if (!isLanding) {
      // En otras páginas, siempre mostrar el header
      setShowHeader(true);
      setIsTransparent(false); // fondo normal
      return;
    }

    const handleScroll = () => {

      const current = window.scrollY;
      const videoHeight = window.innerHeight * 0.85; // No mostrar header si el video todavía está en pantalla

      if (current < videoHeight) {
        setIsTransparent(true);
        setShowHeader(false);
        setLastScroll(current);
        return;
      }

      setIsTransparent(false); // Cuando salís del video → header sólido

      // Si baja, ocultar. Si sube, mostrar
      if (current < lastScroll) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }

      setLastScroll(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

  }, [lastScroll, isLanding]);


  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <header
      className={`
        ${Styles.header} 
        ${showHeader || !isLanding ? Styles.show : ""}
        ${isLanding && isTransparent ? Styles.transparent : ""}
      `}
    >
      <div className={`${Styles.menuContainer}`}>
        {/* Categories Menu */}
        <div
          className={`${searchOpen ? Styles.hideOnTablet : ""}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent close menu click from propagating to overlay
            toggleMenu();
          }}
          aria-label="Categories Menu"
          title="Categories"
        >
          <div className={Styles.menuTextContainer}>
            <span className={Styles.menuText}>Categories</span>
            <ArrowDropDown fontSize="large" className={Styles.dropDownIcon} />
          </div>
          
          <div className={Styles.menuIcon}>
            <Menu fontSize="large" />
          </div>
        </div>

        {menuOpen && (
          <>
            <div className={Styles.menuOverlay} onClick={() => setMenuOpen(false)} />

            <div className={Styles.dropdownMenu}>
              <div className={Styles.dropdownHeader}>
                <h5 className={Styles.dropdownTitle}>Unbound`s Selection:</h5>
                <button onClick={()=> setMenuOpen(false)}>X</button>
              </div>
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/products?category=${category}`}
                  className={Styles.dropdownLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Search */}
        <SearchBar isOpen={searchOpen} setIsOpen={setSearchOpen} />
      </div>
      
      {/* Logo */}
      <div className={`${Styles.logoContainer} ${searchOpen ? Styles.hideOnMobile : ""}`}>
        <Link to="/"><img src={`/logo ${theme === "dark" ? "light" : "dark"}.png`} alt="Unbound logo" className={Styles.logo} /></Link>
      </div>
      
      {/* Icons */}
      <div className={`${Styles.navContainer}`}>
        <ThemeButton />
        {user?.role === "USER" && 
          <Link to="/cart" className={Styles.navLink} aria-label="Cart" title="Cart">
            <ShoppingCart className={Styles.cartIcon} />
          </Link>
        }
        {
          user ? (
            <Link to="/profile" className={`${Styles.navLink}`} aria-label="Profile" title="Profile">
              {user.imageUrl 
                ? 
                <>
                  <span className={Styles.profileText}>Profile</span>
                  <UserImage imageUrl={user.imageUrl} /> 
                </>
                : 
                <>
                  <span className={Styles.profileText}>Profile</span>
                  <Person className={Styles.profileIcon} />
                </>
              }
            </Link>
          ) : (
            <Link to="/login" className={`${Styles.navLink} ${Styles.firstIcon}`} aria-label="Sign In" title="Sign In">
              <span className={Styles.profileText}>Sign In</span>
              <div className={Styles.profileImage}>
                <Person className={Styles.profileIcon} />
              </div>
            </Link>
          )
        }
      </div>
    </header>
  )
}

export default Header
