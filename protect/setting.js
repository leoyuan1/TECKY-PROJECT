let existPassword = document.getElementById("existPassword");
let newPassword = document.getElementById("password");
let confirmPassword = document.getElementById("confirmPassword");
let changePasswordFunction = document.querySelector('#submitButton')


function validatePassword() {
    if (newPassword.value != confirmPassword.value) {
        // console.log('testing1');
        confirmPassword.setCustomValidity("Passwords Don't Match");
        return false;
    } else if (existPassword == newPassword) {
        // console.log('testing2');
        newPassword.setCustomValidity("Exist Password and New Password Should not be a same");
        return false;
    } else {
        // console.log('testing3');
        existPassword.setCustomValidity('');
        return true;
    }
}

// function validatePassword() {
//     if (password.value != confirm_password.value) {
//         console.log('testing');
//         confirm_password.setCustomValidity("Passwords Don't Match");
//         return false;
//     } else {
//         console.log('testing');
//         confirm_password.setCustomValidity('');
//         return true;
//     }
// }

changePasswordFunction.addEventListener("click", async (e) => {
    e.preventDefault()
    if (!document.querySelector('form').reportValidity()) return;
    if (!validatePassword()) {
        document.querySelector('form').reportValidity()
        return
    }

    let result = {
        existPassword: `${newPassword.value}`,
        newPasswordValue: `${existPassword.value}`
    }
    let res = await fetch("/change", {
        method: 'post',
        body: JSON.stringify(result),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let data = await res.json()
    if (data.message == "Updated Password") {
        alert('更改密碼成功')
        location.reload('/setting')
    } else if (data.message == 'Invalid password') {
        alert('密碼錯誤')
        location.reload('/setting')
    }
})

// async function isUser() {
//     let res = await fetch('/session')
//     let result = await res.json()
//     if (result.message === 'isUser') {
//         document.getElementById("login-btn").style.display = "none";
//         document.getElementById("welcome-btn").style.display = "block";
//         document.getElementById('welcome-btn').innerHTML = result.user.username;
//         document.getElementById("setting-btn").style.display = "block";
//         document.getElementById("logout-btn").style.display = "block";
//     } else if (result.message === 'no session data') {
//         return
//     }
// }

// function init() {
//     isUser()
// }
// init()

// document.querySelector('#logout-btn').addEventListener('click', async () => {
//     let res = await fetch('/logout')
//     let data = await res.json()
//     if (data.message == 'logout') {
//         location.reload('/')
//     }
// })