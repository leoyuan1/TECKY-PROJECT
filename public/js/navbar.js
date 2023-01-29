document
    .querySelector('#post_pets')
    .addEventListener('click', checkUser);

document
    .querySelector('#message_box')
    .addEventListener('click', checkUser);

async function checkUser(event) {

    event.preventDefault();

    const res = await fetch('/session');
    const result = await res.json();

    if (result.message !== 'isUser') {
        Swal.fire('Please Login!');
        return;
    }

    if (event.target.id === 'post_pets') {
        window.location.href = 'post-pets-info.html';
        return;
    }

    if (event.target.id === 'message_box') {
        window.location.href = 'message-box.html';
        return;
    }
    
}