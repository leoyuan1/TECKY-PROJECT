document
    .querySelector('#post_pets')
    .addEventListener('click', checkUser);

document
    .querySelector('#message_box')
    .addEventListener('click', checkUser);

// what is the right way?
async function checkUser(event) {

    event.preventDefault();

    const res = await fetch('/session');
    const result = await res.json();

    if (result.message !== 'isUser') {
        Swal.fire('Please Login!');
        return;
    }

    window.location.href = event.target.href


}