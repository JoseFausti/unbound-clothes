import express from "express";
import { isAdminMiddleware, isSuperAdminMiddleware } from "../../middleware/middleware";
import {
    getAllUsers,
    getUserById,
    deleteUser,
    restoreUser,
    createCustomer,
    updateCustomer,
    createSeller,
    updateSeller,
    createAdmin,
    updateAdmin,
    changeUserRole,
    deleteAdmin,
    restoreAdmin,
    changeUserImage,
    updateFavorites
} from "../../controller/api/usersController";

export const usersRouter = express.Router();

// Users
usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", getUserById);
usersRouter.delete("/:id", isAdminMiddleware, deleteUser);
usersRouter.put("/:id/restore", isAdminMiddleware, restoreUser);
usersRouter.put("/:id/image", changeUserImage);

// Customers
usersRouter.post("/", isAdminMiddleware, createCustomer);
usersRouter.put("/:id", updateCustomer);
usersRouter.put("/:id/favorites", updateFavorites);

// Sellers
usersRouter.post("/seller", isAdminMiddleware, createSeller);
usersRouter.put("/seller/:id", updateSeller);

// Admins
usersRouter.put("/admin/:userId/role", isAdminMiddleware, changeUserRole);

// Super Admin
usersRouter.post("/admin", isSuperAdminMiddleware, createAdmin);
usersRouter.put("/admin/:id", isAdminMiddleware, updateAdmin);
usersRouter.delete("/admin/:id", isSuperAdminMiddleware, deleteAdmin);
usersRouter.put("/admin/:id/restore", isSuperAdminMiddleware, restoreAdmin);

export default usersRouter;