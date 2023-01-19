
const logInFormElm = document.querySelector('.login-btn')

logInFormElm.addEventListener('click', async () => {
    let result;
    await Swal.fire({
        title: 'login Form',
        html: `<input type="text" id="email" class="swal2-input" placeholder="Email address">
        <input type="password" id="password" class="swal2-input" placeholder="Password">
        `,
        confirmButtonText: 'Sign in',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            const email = Swal.getPopup().querySelector('#email').value
            const password = Swal.getPopup().querySelector('#password').value
            if (!email || !password) {
                Swal.showValidationMessage(`Please enter email and password`)
            }
            result = { email: email, password: password }
            const res = await fetch('/login', {
                method: 'POST',
                body: result
            })
        }
    })
    await Swal.fire(`
        email: ${result.email}
        Password: ${result.password}
        `.trim())
})
