import { useEffect } from "react"
import AdminManageUsers from "../../../ui/admin/users/AdminManageUsers"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { getAllUsers } from "../../../../store/slices/userSlice";
import useAuth from "../../../../hooks/useAuth";
import Loader from "../../../ui/loader/Loader";
import { Navigate } from "react-router-dom";
import { isSuperAdmin } from "../../../../utils/functions";

const ManageUsers = () => {

  const {user, loading} = useAuth();

  const {users} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  if (loading) return <Loader />;
  if (!loading && !user) return <Navigate to="/" replace />;

  const manageableUsers = users.filter(u => {
    if (u.id === user!.id) return false;
    
    if (isSuperAdmin(user!.role)) return true;
    else return u.role !== 'ADMIN' && u.role !== 'SUPER_ADMIN';
  });

  return (
    <AdminManageUsers users={manageableUsers} />
  )
}

export default ManageUsers
