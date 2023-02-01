// const { resourceLimits } = require("worker_threads")
const newPost = document.querySelector('#postaddbtn')

newPost.addEventListener('click', async () => {
    let result;
    await Swal.fire({
        title: '建立帖子',
        html: `<form id="new-post-form"><input type="text" id="title" class="swal2-input" name="title" placeholder="Title">
        <textarea type="text" id="content" class="swal2-input" name="content" placeholder="tpye here"></textarea> 
        <button class="icon">Media upload<input type="file" name="image" id="media" /></button>
        </form>
        `,

        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            'Comfirm!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        preConfirm: async () => {
            const title = Swal.getPopup().querySelector('#title').value
            const text = Swal.getPopup().querySelector('#content').value
            const file = Swal.getPopup().querySelector('#media').value
            if (!title || !text) {
                Swal.showValidatoinMessage(`Please fill the text area and title!`)
                return
            }
            let formData = new FormData(document.querySelector('#new-post-form'))
            result = { title: title, text: text, file: file }
            let res = await fetch('/community', {
                method: 'POST',
                body: formData,
            })
        },

        willClose: async () => {
        }
    })
})