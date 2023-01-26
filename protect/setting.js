let existPassword = document.getElementById("existPassword")
let newPassword = document.getElementById("password")
let confirmPassword = document.getElementById("confirmPassword");
let changePasswordFunction = document.querySelector('#submitButton')
newPassword.onchange = validatePassword;
confirmPassword.onkeyup = validatePassword;


function validatePassword() {
    if (newPassword.value != confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords Don't Match");
        return false;
    } else if (existPassword == newPassword) {
        confirmPassword.setCustomValidity("Exist Password and New Password Should not be a same");
        return false;
    } else {
        confirmPassword.setCustomValidity('');
        return true;
    }
}

newPassword.onchange = validatePassword;
confirmPassword.onkeyup = validatePassword;


changePasswordFunction.addEventListener("click", async (e) => {
    e.preventDefault()
    if (!newPassword.value || !confirmPassword.value || !existPassword.value) {
        return
    }
    let newPasswordValue = newPassword.value
    let existPasswordValue = existPassword.value
    let result = {
        existPassword: `${existPasswordValue}`,
        newPasswordValue: `${newPasswordValue}`
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