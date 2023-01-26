let exitPassword = document.getElementById("existPassword")
let newPassword = document.getElementById("password")
let confirmPassword = document.getElementById("confirmPassword");
let dataForm = document.getElementById('signupForm');

newPassword.onchange = validatePassword;
confirmPassword.onkeyup = validatePassword;

function validatePassword() {
    if (newPassword.value != confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords Don't Match");
        return false;
    } else if (exitPassword == newPassword) {
        confirmPassword.setCustomValidity("Exist Password and New Password Should not be a same");
        return false;
    } else {
        confirmPassword.setCustomValidity('');
        return true;
    }
}

newPassword.onchange = validatePassword;
confirmPassword.onkeyup = validatePassword;

async function validateSignupForm() {
    let newPasswordValue = await dataForm.newPassword.value
    let existPassword = await dataForm.existPassword.value
    let result = { existPassword: existPassword, newPasswordValue: newPasswordValue }
    let res = await fetch('/setting', {
        method: 'post',
        body: JSON.stringify(result),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let data = await res.json()
    if (data.message == "Updated Password") {
        alert('更改密碼成功')
    } else if (data.message == 'Invalid password') {
        alert('密碼錯誤')
    }
}
