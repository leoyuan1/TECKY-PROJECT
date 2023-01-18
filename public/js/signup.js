const signupFormElm = document.querySelector('.signup-form')

signupFormElm.addEventListener('submit', async (event) => {
    event.preventDefault()
    let formData = new FormData(signupFormElm)

    const res = await fetch('/signup', {
        method: 'POST',
        body: formData
    })
    if (res.ok) {
        let data = await res.json()
        signupFormElm.reset()
    } else {
        alert('fail')
    }
})