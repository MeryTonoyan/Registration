import express from 'express'
import cors from 'cors'
import session from 'express-session'
import bcrypt from 'bcrypt'
import fs from 'fs/promises'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: 'http://localhost:63342',
    credentials: true
}));

app.use(session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie:
        { httpOnly: true,
        maxAge: 1000 * 60 * 60 }
}))

app.post('/register', async (req, res) => {
    const { name, email, password, isAdmin } = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    let val = {
        id: Date.now(),
        name,
        email,
        password: hashedPassword,
        role: isAdmin ? 'admin' : 'user'
    }

    let data = JSON.parse(await fs.readFile('users.json', 'utf-8'))
    data.push(val)
    await fs.writeFile('users.json', JSON.stringify(data, null, 2))

    let newValue = { ...val }
    delete newValue.password
    req.session.user = newValue
    res.json(newValue)
})

app.get('/login', async (req, res) => {
    const { login, password } = req.query
    let usersValues = JSON.parse(await fs.readFile('users.json', 'utf-8'))
    let user = usersValues.find(u => u.email.toLowerCase() === login.toLowerCase())

    if (user && await bcrypt.compare(password, user.password)) {
        let newUser = { ...user }
        delete newUser.password
        req.session.user = newUser
        return res.json(newUser)
    }
    res.status(400).json({ message: 'invalid email or password' })
})

app.get('/profile', (req, res) => {
    if (req.session.user) return res.json(req.session.user)
    res.json({ message: 'not logged in' })
})

app.get('/logout', (req, res) => {
    req.session.user = null
    res.json({ body: 'logout user' })
})

app.get('/admin', async (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        let data = JSON.parse(await fs.readFile('users.json', 'utf-8'));
        res.json(data);
    } else {
        res.json({ message: 'not admin' });
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("server is runing")
})