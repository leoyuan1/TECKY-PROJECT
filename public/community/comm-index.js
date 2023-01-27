// const { resourceLimits } = require("worker_threads")

const newPostformElm = document.querySelector('#postaddbtn')


// newPostformElm.addEventListener('click', async (e) => {
//     e.preventDefault()

//     // prep
//     let formData = new FormData(newPostformElm)

//     // send
//     let res = await fetch('/post', {
//         method: 'POST',
//         body: formData
//     })


//     // post handling
//     if (res.ok) {
//         newPostformElm.reset()
//     } else {
//         console.log('post fail')
//     }
// });


// async function loadPost() {
//     let res = await fetch('/post')
//     if (res.ok) {
//         let data = await res.json()
//         let posts = data.data

//         updatePostContainer(posts)
//         console.table(posts)
//     } else {
//         alert('cannot fetch post')
//     }
// };


// async function deletePost(postId) {
//     await fetch(`/post/${postId}`, {
//         method: 'delete'
//     })
//     loadPost()
// };


// async function updatePost(postId) {
//     const options = {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             content: document.querySelector(`#post_${postId} textarea`).value
//         })
//     }

//     let res = await fetch(`http://localhost:8080/posts/${postId}`, options)
//     let data = res.json()
//     if (res.ok) {
//         console.log(data)
//     } else {
//         alert('update fail')
//     }
// };
// async function getMe() {
//     let res = await fetch('/me')
//     if (res.ok) {
//         let user = await res.json()
//         if (Object.keys(user).length == 0) {

//             let postIcons = document.querySelectorAll('.post-icon')
//             for (let postIcon of postIcons) {
//                 postIcon.classList.add('disable')
//             }
//         }

//     }
// };

// (async function init() {
//     await loadPost()
//     const socket = io.connect();
//     socket.on('load-post', () => {
//         loadPost()
//     })
//     getMe()
// })

// newPostformElm.addEventListener('click', async (e) => {
//     let result;
//     await Swal.fire({
//         title: '建立帖子',
//         html: `<input type=:"text" id=comment class="swal2-input" placholder="textarea">`,
//         confirmButtonText: '發佈',
//         showCancelButton: false,
//         showLoaderOnConfirm: true,
//         preconfirm: async () => {
//             return fetch('./postadd.html')
//                 .then(response => {
//                     if (!response.ok) {
//                         throw new Error(response.statusText)
//                     }
//                     return response.json()
//                 })
//                 .catch(error => {
//                     Swal.showValidationMessage(
//                         `Request failed: ${error}`
//                     )
//                 })
//         },
//         allowOutsideClick: () => !Swal.isLoading()
//     })
// })
// newPostformElm.addEventListener('click', async () => {
//     const { value: text } = await Swal.fire({
//         input: 'textarea',
//         inputLabel: 'Message',
//         inputPlaceholder: 'Type your message here...',
//         inputAttributes: {
//             'aria-label': 'Type your message here'
//         },
//         showCancelButton: true
//     })

//     if (text) {
//         Swal.fire(text)
//     }
newPostformElm.addEventListener('click', async () => {
    const { value: text, } = await Swal.fire({
        input: 'textarea',
        inputLabel: 'Message',
        inputPlaceholder: 'Type your message here...',
        inputAttributes: {
            'aria-label': 'Type your message here'
        },
        showCancelButton: true
    })

    if (text) {
        Swal.fire(text)
    }
    const { value: file } = await Swal.fire({
        title: 'Select image',
        input: 'file',
        inputAttributes: {
            'accept': 'image/*',
            'aria-label': 'Upload your profile picture'
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
