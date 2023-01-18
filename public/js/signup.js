
const signupFormElm = document.querySelector('.loginOrSignup-btn')

signupFormElm.addEventListener('click', async () => {
    Swal.fire({
        title: 'Login Form',
        html: `<input type="text" id="login" class="swal2-input" placeholder="Email">
        <input type="password" id="password" class="swal2-input" placeholder="Password">
        `,
        confirmButtonText: 'Sign in',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            const login = Swal.getPopup().querySelector('#login').value
            const password = Swal.getPopup().querySelector('#password').value
            if (!login || !password) {
                Swal.showValidationMessage(`Please enter login and password`)
            }
            return { login: login, password: password }
        }
    }).then((result) => {
        Swal.fire(`
        Login: ${result.value.login}
        Password: ${result.value.password}
        `.trim())
    })
})