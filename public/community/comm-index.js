// const { resourceLimits } = require("worker_threads")
const newPostformElm = document.querySelector('#postaddbtn')

newPostformElm.addEventListener('click', async () => {
    let result;
    await Swal.fire({
        title: '建立帖子',
        html: `<input type='title' id='swal-input1' name='title' placeholder='Title'>
        <textarea name='conent' id="swal-input2">Text here..</textarea>`
        ,
        footer: `<input name='image' type='file'>`,

        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            'Comfirm!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        preConfirm: async () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value
            ]
        },

        willClose: async () => {
            let formData = new FormData(document.querySelector('#postaddbtn'))
            // start add post to server logic
            let res = await fetch('/community/post', {
                method: 'POST',
                body: formData
            })
        }
    })

})





// if (file) {
//     const reader = new FileReader()
//     reader.onload = (e) => {
//         Swal.fire({
//             title: 'Your uploaded picture',
//             imageUrl: e.target.result,
//             imageAlt: 'The uploaded picture'
//         })
//     }
//     reader.readAsDataURL(file)
// }
