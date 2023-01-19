
const signupFormElm = document.querySelector('.signup-btn')

signupFormElm.addEventListener('click', async () => {
    let result;
    await Swal.fire({
        title: 'Sign-up Form',
        html: `<form id="form"><input type="text" id="email" class="swal2-input" placeholder="Email address">
        <input type="password" id="password" class="swal2-input" placeholder="Password">
        <input type="username" id="username" class="swal2-input" placeholder="Username">
        <input type="file" name="image" id="image" />
        </form>
        `,
        confirmButtonText: 'Sign up',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            const email = Swal.getPopup().querySelector('#email').value
            const password = Swal.getPopup().querySelector('#password').value
            const username = Swal.getPopup().querySelector('#username').value
            if (!email || !password || !username) {
                Swal.showValidationMessage(`Please enter email, password and username`)
            }

            console.log('testing 1');

            const data = document.querySelector('#form')
            console.log(data);
            result = new FormData(data)
            let res = await fetch('/signup', {
                method: 'POST',
                body: result
            })
            if (res.ok) {
                await Swal.fire(`
                email: ${email}
                註冊成功
                `.trim())
            }
        }
    })
})
