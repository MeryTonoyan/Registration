import express from "express";
import session from "express-session";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(session({
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

app.use("/", userRoutes);


app.listen(process.env.PORT || 3001, function () {
    console.log("server is runing")
})