import express from "express";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
const SECRET_KEY = "qo_gaxtni_banalin";

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "registration"
}).promise();

app.post("/register", (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    const role = isAdmin ? "admin" : "user";

    bcrypt.hash(password, 10)
        .then(hashed => db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashed, role]))
        .then(([result]) => {

            const token = jwt.sign({ id: result.insertId, role }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token, user: { name, email, role } });
        })
        .catch(err => res.status(500).json({ error: "Register failed" }));
});


app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email])
        .then(([rows]) => {
            const user = rows[0];
            if (!user) throw new Error("User not found");
            return Promise.all([user, bcrypt.compare(password, user.password)]);
        })
        .then(([user, isMatch]) => {
            if (!isMatch) throw new Error("Wrong password");


            const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
        })
        .catch(err => res.status(401).json({ message: err.message }));
});

app.listen(3005, () => console.log("JWT Server running on 3005"));