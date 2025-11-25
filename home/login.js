function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === "ravindu" && password === "12345") {
        alert("Login successful!");
    } else {
        const message = document.getElementById('message');
        message.style.color = 'red';
        message.textContent = "Invalid username or password.";
    }
}

function goHome() {
    window.location.href = "index.html";
}

function forgotPassword() {
    alert("Please contact support to reset your password.");
}