import { Navigate, Outlet } from "react-router-dom"
import { isAdmin } from "../../../utils/functions";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../ui/loader/Loader";

const AdminLayout = () => {
    const { user, loading } = useAuth();

    if (loading) return <Loader />
    if ((!loading && !user) || (!loading && !isAdmin(user!.role))) return <Navigate to="/" replace />
    return <Outlet />
}

export default AdminLayout
