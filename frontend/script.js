const $ = s => document.querySelector(s);

async function loadAdminUsers() {
    try {
        const res = await fetch("http://localhost:3001/admin/users", { credentials: "include" });
        if (!res.ok) return;
        const users = await res.json();
        const tbody = $("#usersTbody");
        tbody.innerHTML = "";
        users.forEach((user, index) => {
            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><span class="badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}">${user.role}</span></td>
                    <td>
                        ${user.role !== 'admin' ?
                `<button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">Delete</button>` :
                '<span class="small-muted">Root</span>'}
                    </td>
                </tr>`;
        });
    } catch (err) { console.error(err); }
}

window.deleteUser = async (id) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`http://localhost:3001/admin/delete/${id}`,
        { method: "DELETE", credentials: "include" });
    if (res.ok) loadAdminUsers();
    else alert("Delete failed");
};

$("#profileForm").onsubmit = async (e) => {
    e.preventDefault();
    const newName = $("#profileName").value;
    const res = await fetch("http://localhost:3001/changeName", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName }),
        credentials: "include"
    });
    if (res.ok) alert("Name updated successfully!");
    else alert("Failed to update name");
};

function setLoggedOutUI() {
    $("#guestArea").classList.remove("d-none");
    $("#appArea").classList.add("d-none");
    $("#btnLogoutTop").classList.add("d-none");
    $("#adminTabBtn").classList.add("d-none");
}

async function checkProfile() {
    try {
        const response = await fetch("http://localhost:3001/profile", { credentials: "include" });
        const data = await response.json();
        if (response.ok && data.email) {
            $("#guestArea").classList.add("d-none");
            $("#appArea").classList.remove("d-none");
            $("#btnLogoutTop").classList.remove("d-none");

            $("#profileName").value = data.name;

            if (data.role === "admin") {
                $("#adminTabBtn").classList.remove("d-none");
                $("#tabProfile").classList.add("d-none");
                $("#tabAdmin").classList.remove("d-none");
                loadAdminUsers();
            }
        } else { setLoggedOutUI(); }
    } catch (error) { setLoggedOutUI(); }
}

checkProfile();

$("#loginForm").onsubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: $("#loginEmail").value, password: $("#loginPassword").value }),
        credentials: "include"
    });
    if (res.ok) checkProfile();
    else alert("Login failed");
};

$("#registerForm").onsubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: $("#regName").value,
            email: $("#regEmail").value,
            password: $("#regPassword").value,
            isAdmin: $("#regIsAdmin").checked
        }),
        credentials: "include"
    });
    if (res.ok) checkProfile();
    else alert("Register failed");
};

const logoutHandler = async () => {
    await fetch("http://localhost:3001/logout", { credentials: "include" });
    setLoggedOutUI();
};
$("#btnLogout").onclick = logoutHandler;
$("#btnLogoutTop").onclick = logoutHandler;

$("#adminTabBtn").onclick = () => {
    $("#tabProfile").classList.add("d-none");
    $("#tabAdmin").classList.remove("d-none");
    loadAdminUsers();
};
