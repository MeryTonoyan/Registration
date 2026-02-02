import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

let values = [];

app.get('/', (req, res) => {
    res.json(values);
});

app.post('/add', (req, res) => {
    let value = {
        id: Date.now(),
        ...req.body.value
    };
    values.push(value);
    res.json(value);
});

app.get('/profile', (req, res) => {
    if (req.session && req.session.user) {
        return res.json(req.session.user);
    }
    res.json({ message: 'not logged in' });
});

app.get('/logout', (req, res) => {
    if (req.session && req.session.user) {
        req.session.user = null;
        return res.json({ body: "logout user" });
    }
    res.json({ message: 'not logged in' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});