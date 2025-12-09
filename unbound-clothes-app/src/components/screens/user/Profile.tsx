import useAuth from "../../../hooks/useAuth";
import Error from "../../ui/error/Error";
import Loader from "../../ui/loader/Loader";
import ProfileUser from "../../ui/user/profile/ProfileUser";

const Profile = () => {

  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!loading && !user) return <Error />;

  return (
    <>
      <ProfileUser />
    </>
  )
}

export default Profile
