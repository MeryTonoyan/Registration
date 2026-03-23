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
        .then(data => {
            localStorage.setItem("token", data.token);
            alert("Success!");
            location.reload();
        });
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
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem("token", data.token);
                alert("Welcome " + data.user.name);
                location.reload();
            }
        })
        .catch(err => alert("Login failed"));
};


const logout = () => {
    localStorage.removeItem("token");
    location.reload();
};


const token = localStorage.getItem("token");
if (token) {

    $("#guestArea").classList.add("d-none");
    $("#appArea").classList.remove("d-none");
}