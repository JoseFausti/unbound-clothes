import { Link } from "react-router-dom";
import type { IUser } from "../../../../types/schemas.db"
import CreateUser from "./actions/CreateUser";
import EditUser from "./actions/EditUser";
import Styles from "./AdminManageUsers.module.css"
import { Edit, Delete, PersonAdd } from "@mui/icons-material"
import { useState } from "react";
import { deleteUserBanner, errorBanner, successBanner } from "../../../../utils/functions";
import axiosInstance from "../../../../config/axios";
import { useAppDispatch } from "../../../../hooks/redux";
import { removeUser } from "../../../../store/slices/userSlice";
import AdminSellerProducts from "./actions/AdminSellerProducts";
import useAuth from "../../../../hooks/useAuth";

interface AdminManageUsersProps {
  users: Omit<IUser, "password">[];
}

const AdminManageUsers: React.FC<AdminManageUsersProps> = ({ users }) => {
    const { user } = useAuth();
    const dispatch = useAppDispatch();

    const [openModal, setOpenModal] = useState({
        create: false,
        edit: false,
        manageProducts: false
    });
    const [selectedUser, setSelectedUser] = useState<Omit<IUser, "password"> | null>(null);

    const handleCreate = () => setOpenModal({ ...openModal, create: true });
    const handleEdit = () => setOpenModal({ ...openModal, edit: true });
    const handleManageProducts = () => setOpenModal({ ...openModal, manageProducts: true });
    const handleCloseModal = () => setOpenModal({ create: false, edit: false, manageProducts: false });
    
    const handleDelete = async (user: Omit<IUser, "password">) => {
        try {
            await deleteUserBanner()
                .then(async (res) => {
                    if (res) {
                       await axiosInstance.delete(`/users/${user.id}`)
                            .then((res) => {
                                if (res.data){
                                    successBanner();
                                    dispatch(removeUser(user));
                                }
                            });
                    }
                });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            errorBanner();
        }
    }

    return (
        <>
            <div className={Styles.adminManageUsersContainer}>
                <div className={Styles.backLinkContainer}>
                    <Link to="/admin" className={Styles.backLink}> Go Back </Link>
                </div>
                { openModal.create || openModal.edit || openModal.manageProducts
                ? (
                    <div className={Styles.usersListWrapper}>
                        {openModal.create && <CreateUser closeModal={handleCloseModal} />}
                        {(openModal.edit && selectedUser) && <EditUser user={selectedUser} closeModal={handleCloseModal} />}
                        {(openModal.manageProducts && selectedUser) && <AdminSellerProducts userId={selectedUser.id} closeModal={handleCloseModal} />}
                    </div>
                )
                :
                    <div className={Styles.usersListWrapper}>
                        <div className={Styles.header}>
                            <h2 className={Styles.title}>Manage Users</h2>
                            <button className={Styles.createButton} onClick={handleCreate}>
                                <PersonAdd fontSize="small" />
                                New User / Seller {user?.role === "SUPER_ADMIN" && "/ Admin"}
                            </button>
                        </div>

                        <div className={Styles.usersListContainer}>
                            {users
                                .filter(user => !user.deleted)
                                .map((user) => (
                                <div key={user.id} className={Styles.userCard}>
                                    <div className={Styles.imageContainer}>
                                        <img
                                            className={Styles.image}
                                            src={user.imageUrl}
                                            alt={user.name}
                                        />
                                    </div>

                                    <div className={Styles.userInfo}>
                                        <h3 className={Styles.userName}>{user.name}</h3>
                                        <p className={Styles.userEmail}>{user.email}</p>
                                        {user.role === "SELLER" && 
                                            <p 
                                                className={Styles.manageProducts}
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    handleManageProducts();
                                                }}
                                            >
                                                See Products
                                            </p>
                                        }
                                        <span
                                            className={`${Styles.roleBadge} ${
                                            user.role === "ADMIN"
                                                ? Styles.admin
                                                : user.role === "SELLER"
                                                ? Styles.seller
                                                : Styles.client
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </div>

                                    <div className={Styles.actions}>
                                    <Edit
                                        className={`${Styles.iconButton} ${Styles.edit}`}
                                        onClick={() => {
                                            setSelectedUser(user);
                                            handleEdit();
                                        }}
                                    />
                                    <Delete
                                        className={`${Styles.iconButton} ${Styles.delete}`}
                                        onClick={() => {
                                            handleDelete(user);
                                        }}
                                    />
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default AdminManageUsers
