import fs from "fs/promises";
import bcrypt from "bcrypt";

export const getProfile = (req, res) => {
    res.json(req.session.user || {});
};

export const loginUser = async (req, res) => {
    const { login, password } = req.body;
    try {
        let data = await fs.readFile("users.json", "utf-8");
        let users = JSON.parse(data);
        let user = users.find(u => u.email === login);

        if (!user) return res.status(401).json({ message: "Invalid login or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid login or password" });

        let sessionUser = { ...user };
        delete sessionUser.password;
        req.session.user = sessionUser;
        res.json(sessionUser);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const registerUser = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser = { id: Date.now(), name, email, password: hashedPassword, role: isAdmin ? "admin" : "user" };

        let data = await fs.readFile("users.json", "utf-8");
        let users = JSON.parse(data);
        users.push(newUser);
        fs.writeFile("users.json", JSON.stringify(users, null, 2), "utf-8");
        delete newUser.password;
        req.session.user = newUser;
        res.json(newUser);
    } catch (e) { res.status(500).json({ message: "Error during registration" }); }
};

export const logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ message: "logged out" });
    });
};

export const getAllUsers = async (req, res) => {
    try {
        const data = await fs.readFile("users.json", "utf-8");
        const users = JSON.parse(data).map(({ password, ...u }) => u);
        res.json(users);
    } catch (err) { res.status(500).json({ message: "Error fetching users" }); }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        let data = await fs.readFile("users.json", "utf-8");
        let users = JSON.parse(data);

        if (req.session.user.id == id) {
            return res.status(400).json({ message: "You cannot delete yourself" });
        }

        users = users.filter(u => u.id != id);
        await fs.writeFile("users.json", JSON.stringify(users, null, 2));
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ message: "Error deleting" }); }
};

export const changeName = async (req, res) => {
    const { newName } = req.body;
    try {
        let data = await fs.readFile("users.json", "utf-8");
        let users = JSON.parse(data);
        let userIndex = users.findIndex(u => u.id === req.session.user.id);

        if (userIndex === -1) return res.status(404).json({ message: "User not found" });

        users[userIndex].name = newName;
        await fs.writeFile("users.json", JSON.stringify(users, null, 2));

        req.session.user.name = newName;
        res.json({ message: "Updated" });
    } catch (err) { res.status(500).json({ message: "Error updating name" }); }
};

export const changePass = async (req, res) => {
    const { curPass, newPass, newPass2 } = req.body;
    if (newPass !== newPass2) return res.status(400).json({ message: "Mismatch" });
    try {
        let data = await fs.readFile("users.json", "utf-8");
        let users = JSON.parse(data);
        let user = users.find(u => u.id === req.session.user.id);

        const isMatch = await bcrypt.compare(curPass, user.password);
        if (!isMatch) return res.status(401).json({ message: "Wrong current pass" });

        user.password = await bcrypt.hash(newPass, 10);
        fs.writeFile("users.json", JSON.stringify(users, null, 2), "utf-8");
        res.json({ message: "Success" });
    } catch (err) { res.status(500).json({ message: "Error" }); }
};