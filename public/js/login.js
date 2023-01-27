

const logInFormElm = document.querySelector('.login-btn')
const logOutElm = document.querySelector('#logout-btn')
logInFormElm.addEventListener('click', async () => {
    let result;
    await Swal.fire({
        title: 'login Form',
        html: `<input type="text" id="email" class="swal2-input" placeholder="Email address">
        <input type="password" id="password" class="swal2-input" placeholder="Password">
        `,
        footer: `<a href="/connect/google" class="btn btn-success">Sign in With Google</a>
            <a type="button" class="signup-btn" onclick='signup()'>Sign Up Here</a>
        `,
        confirmButtonText: 'Sign in',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            const email = Swal.getPopup().querySelector('#email').value
            const password = Swal.getPopup().querySelector('#password').value
            if (!email || !password) {
                Swal.showValidationMessage(`Please enter email and password`)
                return
            }
            result = { email: email, password: password }
            let res = await fetch('/login', {
                method: 'post',
                body: JSON.stringify(result),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let data = await res.json()
            if (data.message === "email not register") {
                await Swal.fire(`
                email: ${result.email}
                未註冊
                `.trim())
            } else if (data.message === "Invalid password") {
                await Swal.fire(`
                password 錯誤
                `.trim())
            } else if (data.message === "correct") {
                await Swal.fire(`
                登入成功
                `.trim())
                isUser()
            }
        }
    })
})

async function isUser() {
    let res = await fetch('/session')
    let result = await res.json()
    if (result.message === 'isUser') {
        document.getElementById("login-btn").style.display = "none";
        document.getElementById("welcome-btn").style.display = "block";
        document.getElementById("postPets").style.display = "block";
        document.getElementById('navbarDropdownMenuLink').innerHTML = `Welcome ${result.user.username}`;
    } else if (result.message === 'no session data') {
        return
    }
}

function init() {
    isUser()
}
init()

document.querySelector('#logout-btn').addEventListener('click', async () => {
    let res = await fetch('/logout')
    let data = await res.json()
    if (data.message == 'logout') {
        location.reload('/')
    }
})