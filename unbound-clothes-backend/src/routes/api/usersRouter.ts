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
    restoreAdmin
} from "../../controller/api/usersController";

export const usersRouter = express.Router();

// Users
usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", getUserById);
usersRouter.delete("/:id", isAdminMiddleware, deleteUser);
usersRouter.put("/:id/restore", isAdminMiddleware, restoreUser);

// Customers
usersRouter.post("/", isAdminMiddleware, createCustomer);
usersRouter.put("/:id", isAdminMiddleware, updateCustomer);

// Sellers
usersRouter.post("/seller", isAdminMiddleware, createSeller);
usersRouter.put("/seller/:id", isAdminMiddleware, updateSeller);

// Admins
usersRouter.post("/admin", isSuperAdminMiddleware, createAdmin);
usersRouter.put("/admin/:id", isSuperAdminMiddleware, updateAdmin);
usersRouter.delete("/admin/:id", isSuperAdminMiddleware, deleteAdmin);
usersRouter.put("/admin/:id/restore", isSuperAdminMiddleware, restoreAdmin);
usersRouter.put("/admin/:id/role", isSuperAdminMiddleware, changeUserRole);

export default usersRouter;