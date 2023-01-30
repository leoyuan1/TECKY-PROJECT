// const { resourceLimits } = require("worker_threads")
const newPostformElm = document.querySelector('#postaddbtn')

newPostformElm.addEventListener('click', async () => {
    const { value } = await Swal.fire({
        html: `<form id='new-post-form'>
        <input type='title' id='title' name='title' placeholder='Title'>
        <input type='feeling' id='feeling' name='feeling' placeholder='Feeling good?'>
        <textarea name='conent'>Text here..</textarea>
        <input name='image' type='file'>
        </form>
        `,

        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            'Comfirm!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        willClose: async () => {
            let formData = new FormData(document.querySelector('#new-post-form'))
            // start add post to server logic
            let res = await fetch('/post', {
                method: 'POST',
                body: formData
            })
        }
    })

})

if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
        Swal.fire({
            title: 'Your uploaded picture',
            imageUrl: e.target.result,
            imageAlt: 'The uploaded picture'
        })
    }
    reader.readAsDataURL(file)
}
