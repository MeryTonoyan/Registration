const $ = s => document.querySelector(s);
const API = 'http://localhost:3005';


$("#registerForm").onsubmit = (e) => {
    e.preventDefault();

    const data = {
        name: $("#regName").value,
        email: $("#regEmail").value,
        password: $("#regPassword").value,
        isAdmin: $("#regIsAdmin").checked
    };

    fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(user => {
            alert("Account created for " + user.name);
            location.reload();
        })
        .catch(err => alert("Registration failed"));
};


$("#loginForm").onsubmit = (e) => {
    e.preventDefault();

    const data = {
        email: $("#loginEmail").value,
        password: $("#loginPassword").value
    };

    fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
    })
        .then(res => {
            if (!res.ok) throw new Error("Invalid login");
            return res.json();
        })
        .then(user => {
            alert("Welcome back " + user.name);
            location.reload();
        })
        .catch(err => alert("Login failed: " + err.message));
};


const logout = () => {
    fetch(`${API}/logout`, { credentials: "include" })
        .then(() => {
            alert("Logged out");
            location.reload();
        });
};

if ($("#btnLogout")) $("#btnLogout").onclick = logout;
if ($("#btnLogoutTop")) $("#btnLogoutTop").onclick = logout;