import express from "express";
import {
    getProfile,
    loginUser,
    registerUser,
    logoutUser,
    getAllUsers,
    changeName,
    changePass,
    deleteUser
} from "../controllers/user.controller.js";
import { isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", getProfile);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/logout", logoutUser);

router.get("/admin/users", isAdmin, getAllUsers);
router.delete("/admin/delete/:id", isAdmin, deleteUser);

router.post("/changeName", changeName);
router.post("/changePass", changePass);

export default router;