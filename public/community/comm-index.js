// const { resourceLimits } = require("worker_threads")
const newPostformElm = document.querySelector('#postaddbtn')

newPostformElm.addEventListener('click', async () => {
    let result;
    await Swal.fire({
        title: '建立帖子',
        html: `<form id="form"><input type="text" id="title" class="swal2-input" name="email" placeholder="Title">
        <textarea type="text" id="content" class="swal2-input" name="text" placeholder="tpye here"></textarea> 
        <button class="icon">Media upload<input type="file" name="image" id="image" /></button>
        </form>
        `,

        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            'Comfirm!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        preConfirm: async () => {
            const title = Swal.getPopup().querySelector('#title').value
            const text = Swal.getPopup().querySelector('#text').value
            const file = Swal.getPopup().querySelector('#file').value
            if (!title || !text) {
                Swal.showValidatoinMessage(`Please fill the text area and title!`)
                return
            }
            result = { title: title, text: text, file: file }
            let res = await fetch('/index', {
                method: 'POST',
                body: JSON.stringify(result),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },

        willClose: async () => {
        }
    })
})