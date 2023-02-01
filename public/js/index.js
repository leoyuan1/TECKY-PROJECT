async function getPostInfo() {
    let res = await fetch('/pets/all-pets')
    let data = await res.json()
    let posts = data.data

    // 1st
    let randomPost = Math.floor(Math.random() * posts.length)
    let post = posts[randomPost]
    let resMedia = await fetch(`/pets/one-pet/${post.id}/media`)
    let postMedia = await resMedia.json()
    document.querySelector('.post-title').innerText = `名稱: ${post.pet_name}`
    document.querySelector('.post-type').innerText = `物種: ${post.type_name}`
    document.querySelector('.post-species').innerText = `品種: ${post.species_name}`
    // document.querySelector('.post-description').innerText = `簡介: ${post.pet_description}`
    document.querySelector('#adopt-post-btn').href = `/adopt-pets-info.html?id=${post.id}`
    if (postMedia.data[0]) {
        if (postMedia.data[0].file_name && postMedia.data[0].media_type == "image") {
            console.log(postMedia.data[0].file_name);
            let result = document.querySelector('#post-photo').src = `/pet-img/${postMedia.data[0].file_name}`
        }
    }

    // 2nd
    let secondRandomPost = Math.floor(Math.random() * posts.length)
    while (secondRandomPost == randomPost) {
        secondRandomPost = Math.floor(Math.random() * posts.length)
        console.log(secondRandomPost);
    }
    let secondPost = posts[secondRandomPost]
    let secondResMedia = await fetch(`/pets/one-pet/${secondPost.id}/media`)
    let secondPostMedia = await secondResMedia.json()
    document.querySelector('.second-post-title').innerText = `名稱: ${secondPost.pet_name}`
    document.querySelector('.second-post-type').innerText = `物種: ${secondPost.type_name}`
    document.querySelector('.second-post-species').innerText = `品種: ${secondPost.species_name}`
    // document.querySelector('.second-post-description').innerText = `簡介: ${secondPost.pet_description}`
    document.querySelector('#second-adopt-post-btn').href = `/adopt-pets-info.html?id=${secondPost.id}`
    if (secondPostMedia.data[0]) {
        if (secondPostMedia.data[0].file_name && secondPostMedia.data[0].media_type == "image") {
            console.log(secondPostMedia.data[0].file_name);
            document.querySelector('#second-post-photo').src = `/pet-img/${secondPostMedia.data[0].file_name}`
        }
    }

    let thirdRandomPost = Math.floor(Math.random() * posts.length)
    while (thirdRandomPost == randomPost || thirdRandomPost == secondRandomPost) {
        thirdRandomPost = Math.floor(Math.random() * posts.length)
    }
    let thirdPost = posts[thirdRandomPost]
    let thirdResMedia = await fetch(`/pets/one-pet/${thirdPost.id}/media`)
    let thirdPostMedia = await thirdResMedia.json()
    document.querySelector('.third-post-title').innerText = `名稱: ${thirdPost.pet_name}`
    document.querySelector('.third-post-type').innerText = `物種: ${thirdPost.type_name}`
    document.querySelector('.third-post-species').innerText = `品種: ${thirdPost.species_name}`
    // document.querySelector('.third-post-description').innerText = `簡介: ${thirdPost.pet_description}`
    document.querySelector('#third-adopt-post-btn').href = `/adopt-pets-info.html?id=${thirdPost.id}`
    if (thirdPostMedia.data[0]) {
        if (thirdPostMedia.data[0].file_name && thirdPostMedia.data[0].media_type == "image") {
            console.log(thirdPostMedia.data[0].file_name);
            document.querySelector('#third-post-photo').src = `/pet-img/${thirdPostMedia.data[0].file_name}`
        }
    }
}

init()
function init() {
    getPostInfo()
}
