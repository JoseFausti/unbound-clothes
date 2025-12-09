import { Link, Navigate, Outlet } from "react-router-dom";
import Styles from "./ProfileUser.module.css";
import useAuth from "../../../../hooks/useAuth";
import Loader from "../../loader/Loader";
import { logoutBanner } from "../../../../utils/functions";

const ProfileUser = () => {
  const { user, loading, logout } = useAuth();

  if (loading) return <Loader />;
  if (!loading && !user) return <Navigate to="/" replace />;

  return (
    <div className={Styles.container}>
      <div className={Styles.card}>
        
        {/* Sidebar */}
        <aside className={Styles.sidebar}>
          <h3 className={Styles.sidebarTitle}>Profile</h3>

          {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
            <Link to="/admin" className={Styles.action}>Dashboard</Link>
          )}

          {user?.role === "SELLER" && (
            <Link to="/profile/myProducts" className={Styles.action}>My Products</Link>
          )}

          {user?.role === "USER" && (
            <>
              <Link to="/profile/favorites" className={Styles.action}>Favorite List</Link>
              <Link to="/profile/orders" className={Styles.action}>My Orders</Link>
            </>
          )}

          <button className={Styles.logout} onClick={() => logoutBanner(logout)}>
            Logout
          </button>
        </aside>

        {/* Content */}
        <main className={Styles.content}>
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default ProfileUser;
