import express from "express";
import mysql from "mysql2/promise";
import session from "express-session";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));


app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
}));


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "registration-app"
});



app.post("/register", async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const role = isAdmin ? "admin" : "user";

    const [result] = await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashed, role]
    );

    req.session.user = { id: result.insertId, name, email, role };
    res.json(req.session.user);
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
        return res.json(req.session.user);
    }
    res.status(401).json({ message: "Sխալ տվյալներ" });
});


app.get("/profile", (req, res) => {
    res.json(req.session.user || {});
});

app.get("/admin/users", async (req, res) => {
    if (req.session.user?.role !== 'admin') return res.status(403).send("Forbidden");
    const [rows] = await db.query("SELECT id, name, email, role FROM users");
    res.json(rows);
});


app.delete("/admin/delete/:id", async (req, res) => {
  let[rows]=await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json(rows);
});


app.get("/logout", (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out" });
});

app.listen(3005, () => console.log("Server: http://localhost:3005"));