const BASE_URL = 'api'; // it takes the current host

async function register() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch(`${BASE_URL}/user/user.register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert("Check email for verification code");
            localStorage.setItem('email', email);
            document.location.href = 'verify.html';
        } else {
            try {
                const messages = JSON.parse(data.error.message)
                if (messages[0].message === `EMAIL ALREADY PRESENT`) {
                    localStorage.setItem('email', email);
                    alert("Email already present, verify for this email");
                    document.location.href = 'verify.html';
                    return;
                }
                alert(messages[0].message);
            } catch (error) {
                if (data.error.message === `EMAIL ALREADY PRESENT`) {
                    localStorage.setItem('email', email);
                    alert("Email already present, verify for this email");
                    document.location.href = 'verify.html';
                    return;
                }
                alert(data.error.message);
            }
        }
    } catch (error) {
        alert(`${error}`);
    }
};

async function verify() {
    let code = Number(document.getElementById("verificationCode").value.trim());
    const email = localStorage.getItem("email");

    try {

        if (!email) {
            alert('Register before verifying');
            document.location.href = 'register.html';
            return
        }
        const response = await fetch(`${BASE_URL}/user/user.verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code, email })
        });
        const data = await response.json();
        if (response.ok) {
            alert("Successfully verified");
            localStorage.removeItem("email");
            document.location.href = 'login.html';
        } else {
            try {
                const messages = JSON.parse(data.error.message)
                if (messages[0].message === `EMAIL ALREADY PRESENT`) {
                    alert("Email already present, verify for this email");
                    document.location.href = 'verify.html';
                    return;
                }
                alert(messages[0].message);
            } catch (error) {
                if (data.error.message === `EMAIL ALREADY PRESENT`) {
                    alert("Email already present, verify for this email");
                    document.location.href = 'verify.html';
                    return;
                }
                alert(data.error.message);
            }
        }
    } catch (error) {
        alert(`${error}`);
    }
};

async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch(`${BASE_URL}/user/user.login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert("logged in successfully");
            console.log(data.result.data.token);
            localStorage.setItem('token', data.result.data.token);
            document.location.href = 'index.html';
            return;
        } else {
            try {
                const messages = JSON.parse(data.error.message)
                if (messages[0].message === `USER NOT VERIFIED`) {
                    localStorage.setItem('email', email);
                    alert("User not verified, please verify");
                    document.location.href = 'verify.html';
                    return;
                }
                if (messages[0].message === `USER NOT REGISTERED`) {
                    alert("User not registered, please register");
                    document.location.href = 'register.html';
                    return;
                }
                alert(messages[0].message);
            } catch (error) {
                if (data.error.message === `USER NOT VERIFIED`) {
                    localStorage.setItem('email', email);
                    alert("User not verified, please verify");
                    document.location.href = 'verify.html';
                    return;
                } else if (data.error.message === `USER NOT REGISTERED`) {
                    alert("User not registered, please register");
                    document.location.href = 'register.html';
                    return;
                } else {
                    alert(data.error.message);
                    return;
                }
            }
        }
    } catch (error) {
        alert(`${error}`);
    }
};
