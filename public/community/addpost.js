let newPostformElm = document.querySelector('.btn-btn-link')
// let signinformElm = document.querySelector('.signin-form > form')

newPostformElm.addEventListener('submit', async (e) => {
    e.preventDefault()

    // prep
    let formData = new FormData(newPostformElm)

    // send
    let res = await fetch('http://localhost:8080/community/index.html/', {
        method: 'POST',
        body: formData
    })

})

signinformElm.addEventListener('submit', async (e) => {
    e.preventDefault()

    // prep

    let uploadData = {
        username: newPostformElm.value,
        password: newPostformElm.value
    }

    // send
    let res = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
    })

    // post handling
    if (!res.ok) {
        return
    }

    let data = res.json()
    console.log(data)
    window.location = '/index.html'
})

async function loadPost() {
    let res = await fetch('/post')
    if (res.ok) {
        let data = await res.json()
        let posts = data.data

        updatePostContainer(posts)
        console.table(posts)
    } else {
        alert('cannot fetch post')
    }
}

// function updatePostContainer(posts) {
//     let postContainerElem = document.querySelector('.post-container')
//     postContainerElem.innerHTML = ''
//     for (let postItem of posts) {
//         postContainerElem.innerHTML += `
//         <div class="post-wrapper" id="post${postItem.id}">
//             <div class="post-icon first">
//                 <span class="material-symbols-outlined" onclick='deletePost("${postItem.id}")'>
//                     delete
//                 </span>
//             </div>

//             <div class="post-icon second">
//                 <span class="material-symbols-outlined" onclick='updatePost("${postItem.id}")'>
//                     edit_note
//                 </span>
//             </div>
// 			<div class="post-icon third">
//                 <span class="material-symbols-outlined" onclick='toggleLikePost("${postItem.id}")'>
//                     favorite
//                 </span>
//             </div>
//             <div class="post-wrapper-inner">
//                 <textarea class='btn btn-link'>${postItem.content}
//                 </textarea>
//                 <img class='post-image' src="/${postItem.image}" alt="" >
//             </div>
//         </div>
//         `
//     }
// }

// async function deletePost(postId) {
//     await fetch(`/posts/${postId}`, {
//         method: 'delete'
//     })
//     loadPost()
// }

// async function toggleLikePosts(postId) {
//     await fetch(`/post/like/${postId}`, {
//         method: 'post'
//     })
// }

async function updatePost(postId) {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: document.querySelector(`#post_${postId} textarea`).value
        })
    }

    let res = await fetch(`http://localhost:8080/community/index.html/${postId}`, options)
    let data = res.json()
    if (res.ok) {
        console.log(data)
    } else {
        alert('update fail')
    }
}
async function getMe() {
    let res = await fetch('/uploads.js')
    if (res.ok) {
        let user = await res.json()

    }
}

; (async function init() {
    await loadPost()
    const socket = io.connect();
    socket.on('load-post', () => {
        loadPost()
    })
    getMe()
})()