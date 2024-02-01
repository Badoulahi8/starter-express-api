import { CleanBody } from "./clean.js"
import { Home } from "./home.js"

function CreateLogin() {
    CleanBody()
    const login = document.createElement('div')
    login.className = 'loginBox'
    login.innerHTML = `
        <h2>Log In Here</h2>
        <span id="errorLogin"></span>
        <form id="loginForm">
            <input type="text" id="username" name="username" placeholder="Email or Username" required />
            <input type="password" id="password" name="password" placeholder="********" required />
            <input type="submit" value="LOGIN" />
        </form>
    `
    document.body.appendChild(login)
}

export function Login() {
    CreateLogin()
    const loginForm = document.getElementById("loginForm")
    const errorLogin = document.getElementById("errorLogin")

    if (loginForm) {
        loginForm.addEventListener('submit', async () => {
            event.preventDefault()
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === "" || password === "") {
                alert("User or Password empty")
            } else {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();

                if (result.success) {
                    Home(result.token)
                } else {
                    if (errorLogin) {
                        errorLogin.style.color = "red"
                        errorLogin.innerHTML = "Error: " + result.message;
                    }
                }
            }
        })
    }
}