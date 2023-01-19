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
            } else if (data.message === "Invalid email or password") {
                await Swal.fire(`
                email or password 錯誤
                `.trim())
            } else if (data.message === "correct") {
                await Swal.fire(`
                登入成功
                `.trim())
            }
        }
    })
})
