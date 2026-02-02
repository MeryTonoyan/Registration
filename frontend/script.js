const $ = (s) => document.querySelector(s);

fetch('http://localhost:3000/')
    .then(res => res.json())
    .then(data => {
        console.table(data);
    });

$('#registerForm').onsubmit = function(e) {
    e.preventDefault();

    let userObj = {
        name: $('#regName').value,
        email: $('#regEmail').value,
        password: $('#regPassword').value,
        role: $('#regIsAdmin').checked ? 'admin' : 'user'
    };

    fetch('http://localhost:3000/add', {
        method: 'POST',
        body: JSON.stringify({ value: userObj }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(res => {
            console.log("User added:", res);
            alert("Success!");
        });
};
function updateUI() {
    fetch('http://localhost:3000/profile')
        .then(res => res.json())
        .then(data => {
            if (data.message !== 'not logged in') {
                $('#guestArea').classList.add('d-none');
                $('#appArea').classList.remove('d-none');
                $('#profileName').value = data.name || '';
                $('#profileEmail').value = data.email || '';
                $('#profileRole').value = data.role || '';
            }
        });
}
$('#btnLogout').onclick = () => {
    fetch('http://localhost:3000/logout')
        .then(res => res.json())
        .then(res => {
            console.log(res.body);
            location.reload();
        });
};

updateUI();