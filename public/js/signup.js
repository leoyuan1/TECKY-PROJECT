async function signup() {
    let result;
    await Swal.fire({
        title: 'Sign-up Form',
        html: `<form id="form"><input type="text" id="email" class="swal2-input" name="email" placeholder="Email address">
        <input type="password" id="password" class="swal2-input" name="password" placeholder="Password">
        <input type="username" id="username" class="swal2-input" name="username" placeholder="Username">
        <button class="icon">Icon upload<input type="file" name="image" id="image" /></button>
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
            let emailResult = (validateEmail(email))
            if (emailResult === false) {
                Swal.showValidationMessage(`Invalid email`)
                return
            }

            const formData = Swal.getPopup().querySelector('#form')
            if (email && password && username) {
                result = new FormData(formData)
                let res = await fetch('/signup', {
                    method: 'POST',
                    body: result
                })
                let data = await res.json()
                if (data.message === 'OK') {
                    showUserNav()
                    Swal.fire(`
                            email: ${email}
                            註冊成功
                            `.trim())
                } else if (data.message === 'email registered') {
                    Swal.fire(`
                    email: ${email}
                    已被註冊
                    `.trim())
                } else if (data.message === 'username registered') {
                    Swal.fire(`
                    username: ${username}
                    已被註冊
                    `.trim())
                }
            }
        }
    })
}

function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true
    }
    return false
}

// async function showUserNav() {
//     let res = await fetch('/session')
//     let result = await res.json()
//     if (result.message === 'isUser') {
//         document.getElementById("login-btn").style.display = "none";
//         document.getElementById("welcome-btn").style.display = "block";
//         document.getElementById("postPets").style.display = "block";
//         document.getElementById('navbarDropdownMenuLink').innerHTML = `Welcome ${result.user.username}`;
//     } else if (result.message === 'no session data') {
//         return
//     }
// }