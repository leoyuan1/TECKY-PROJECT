let newPostformElm = document.querySelector('.new-post-container')


newPostformElm.addEventListener('submit', async (e) => {
    e.preventDefault()

    // prep
    let formData = new FormData(newPostformElm)

    // send
    let res = await fetch('/post', {
        method: 'POST',
        body: formData
    })


    // post handling
    if (res.ok) {
        newPostformElm.reset()
    } else {
        console.log('post fail')
    }
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


async function deletePost(postId) {
    await fetch(`/post/${postId}`, {
        method: 'delete'
    })
    loadPost()
}


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

    let res = await fetch(`http://localhost:8080/posts/${postId}`, options)
    let data = res.json()
    if (res.ok) {
        console.log(data)
    } else {
        alert('update fail')
    }
}
async function getMe() {
    let res = await fetch('/me')
    if (res.ok) {
        let user = await res.json()
        if (Object.keys(user).length == 0) {

            let postIcons = document.querySelectorAll('.post-icon')
            for (let postIcon of postIcons) {
                postIcon.classList.add('disable')
            }
        }

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