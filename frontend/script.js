const $ = s => document.querySelector(s)

fetch('http://localhost:3001/profile', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        console.table(data)
        if (data.id) {
            $('#guestArea').classList.add('d-none')
            $('#appArea').classList.remove('d-none')
            $('#profileName').value = data.name
            $('#profileEmail').value = data.email
        }
    })

$('#registerForm').onsubmit = (e) => {
    e.preventDefault()

    let data = {
        name: $('#regName').value,
        email: $('#regEmail').value,
        password: $('#regPassword').value,
        isAdmin: $('#regIsAdmin').checked
    }

    fetch('http://localhost:3001/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            location.reload()
        })
}

$('#loginForm').onsubmit = (e) => {
    e.preventDefault()
    const login = $('#loginEmail').value
    const password = $('#loginPassword').value

    fetch(`http://localhost:3001/login?login=${login}&password=${password}`, {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            if (data.id) {
                location.reload()
            } else {
                alert(data.message)
            }
        })
}

$('#btnLogout').onclick = () => {
    fetch('http://localhost:3001/logout', { credentials: 'include' })
        .then(() => location.reload())
}
$('#adminTabBtn').onclick = () => {
    fetch('http://localhost:3001/admin',
        { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'not admin') {
                alert("not admin");
                return;
            }

            $('#tabProfile').classList.add('d-none');
            $('#tabAdmin').classList.remove('d-none');

            const tbody = $('#usersTbody');
            tbody.innerHTML = '';

            data.forEach((user, index) => {
                tbody.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                    </tr>
                `;
            });

            console.log("cucaky tarmacvec");
        });
}
